FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p /app/src/database
VOLUME /app/src/database
EXPOSE 3000
CMD ["npm", "start"]