// Folder.jsx
export default function Folder({ name }) {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #1976d2",
        margin: "5px",
        borderRadius: "4px",
        background: "#f0f7ff",
      }}
    >
      📁 {name}
    </div>
  );
}
