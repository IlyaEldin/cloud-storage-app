const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {

      const dbPath = path.join(__dirname, '..', 'database', 'app.sqlite');

      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log("📁 Created database directory:", dbDir);
      }

      console.log("🔗 Connecting to database:", dbPath);

      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error("❌ Ошибка подключения к БД:", err.message);
          reject(err);
        } else {
          console.log("✅ Подключение к SQLite установлено");
          this.initTable()
            .then(resolve)
            .catch(reject);
        }
      });
    });
  }


  initTable() {
    return new Promise((resolve, reject) => {

      const usersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Автоинкремент ID
                    login TEXT UNIQUE NOT NULL,            -- Уникальный логин
                    password TEXT NOT NULL,                -- Пароль
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- Дата создания
                )
            `;

      const filesTable = `
                CREATE TABLE IF NOT EXISTS files (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    iduser INTEGER NOT NULL,
                    namefile TEXT NOT NULL,
                    typefile TEXT NOT NULL,
                    sizefile TEXT,
                    file_path TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (iduser) REFERENCES users (id)
                )
            `;


      this.db.run(usersTable, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("✅ Таблица users готова");


          this.db.run(filesTable, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log("✅ Таблица files готова");
              resolve();
            }
          });
        }
      });
    });
  }


  close() {
    if (this.db) {
      this.db.close();
      console.log("🔌 Подключение к БД закрыто");
    }
  }

  newUser(login, password) {
    return new Promise((resolve, reject) => {

      const sql = `
            INSERT INTO users (login, password) 
            VALUES (?, ?)
            `;


      this.db.run(sql, [login, password], function (err) {
        if (err) {
          reject(err);
        } else {
          console.log("✅ Пользователь создан", this.lastID);
          resolve({ id: this.lastID });
        }
      });
    });
  }

  findUserByLogin(login) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE login = ?`;

      this.db.get(sql, [login], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getFilesByUserId(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM files WHERE iduser = ?`;

      this.db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  deleteFile(idFile, idUser) {
    return new Promise((resolve, reject) => {

      const getFilePathSQL = `SELECT file_path FROM files WHERE id = ? AND iduser = ?`;

      this.db.get(getFilePathSQL, [idFile, idUser], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve({ deleted: 0 });
          return;
        }

        const filePath = row.file_path;

        const deleteSQL = `DELETE FROM files WHERE id = ? AND iduser = ?`;

        this.db.run(deleteSQL, [idFile, idUser], function (err) {
          if (err) {
            reject(err);
          } else {
            console.log("✅ File deleted from DB");

            if (filePath) {
              fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                  console.log(
                    "⚠️ Could not delete physical file:",
                    unlinkErr.message
                  );
                } else {
                  console.log("✅ Physical file deleted:", filePath);
                }
                resolve({ deleted: this.changes, filePath: filePath });
              });
            } else {
              resolve({ deleted: this.changes });
            }
          }
        });
      });
    });
  }

  addFile(idUser, namefile, typefile, sizeFile, filePath = null) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO files (iduser, namefile, typefile, sizefile, file_path) VALUES (?, ?, ?, ?, ?)`;

      this.db.run(
        sql,
        [idUser, namefile, typefile, sizeFile, filePath],
        function (err) {
          if (err) {
            reject(err);
          } else {
            console.log("✅ Файл добавлен в БД, ID:", this.lastID);
            console.log("📁 File path saved:", filePath);
            resolve({
              id: this.lastID,
              idUser,
              namefile,
              typefile,
              sizeFile,
              filePath,
            });
          }
        }
      );
    });
  }

  updateFilePath(fileId, filePath) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE files SET file_path = ? WHERE id = ?`;

      console.log("💾 Updating file path:", { fileId, filePath });

      this.db.run(sql, [filePath, fileId], function (err) {
        if (err) {
          console.log("❌ Error updating file path:", err);
          reject(err);
        } else {
          console.log("✅ File path updated, changes:", this.changes);
          resolve({
            updated: this.changes,
            fileId: fileId,
            filePath: filePath,
          });
        }
      });
    });
  }

  getFileById(fileId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM files WHERE id = ?`;

      this.db.get(sql, [fileId], (err, row) => {
        if (err) {
          console.error("DB getFileById error:", err);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  searchFiles(userId, searchTerm) {
    return new Promise((resolve, reject) => {
      const sql = `
            SELECT * FROM files 
            WHERE iduser = ? 
            AND namefile LIKE ?
        `;
      const searchPattern = `%${searchTerm}%`;

      this.db.all(sql, [userId, searchPattern], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}


module.exports = new Database();
