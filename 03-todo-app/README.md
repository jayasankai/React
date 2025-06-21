# 03-todo-app

This project is a full-stack Todo application with:
- **Frontend:** React (Vite)
- **Backend:** Node.js/Express
- **Database:** MySQL (table: `todo`)

## Features
- Add, edit, delete, and fetch todos
- Backend API connects to MySQL on `localhost:3306`, table `todo`

## Getting Started

### 1. Backend
```
cd backend
npm install
npm start
```
- Update MySQL credentials in `backend/server.js` if needed.
- Ensure a MySQL database and `todo` table exist:
  ```sql
  CREATE DATABASE IF NOT EXISTS todo;
  USE todo;
  CREATE TABLE IF NOT EXISTS todo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL
  );
  ```

### 2. Frontend
```
npm install
npm run dev
```

The React app runs on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:5000](http://localhost:5000).
