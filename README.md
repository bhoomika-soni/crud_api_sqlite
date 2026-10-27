# CRUD API with SQLite Database

## 📌 Project Overview

This project is a RESTful CRUD API built using Node.js, Express.js, and SQLite. It allows users to create, read, update, and delete tasks through API endpoints.

Unlike an in-memory API, this version uses an SQLite database to store tasks persistently, so the data remains available after the server restarts.

## 🚀 Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for building REST APIs
- **SQLite** – Database for persistent task storage
- **sqlite3** – Node.js SQLite database driver

## ✨ Features

- Create a new task
- Retrieve all tasks
- Retrieve a task by ID
- Update an existing task
- Delete a task
- Store task data in an SQLite database
- Automatically create the database and tasks table when the application starts

## 📂 Project Structure

```text
crud-api-sqlite/
├── node_modules/
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
└── tasks.db
```

**Note:** `tasks.db` is generated automatically when the application runs. It does not need to be committed to GitHub.

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/bhoomika-soni/crud_api_sqlite.git
```

### 2. Navigate to the project directory

```bash
cd crud_api_sqlite
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm start
```

If the `start` script is not configured in `package.json`, run:

```bash
node server.js
```

The server runs at:

`http://localhost:3000`

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve a task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |

## 📝 Example Requests

### Create a Task

**POST** `/tasks`

Request body:

```json
{
  "title": "Learn SQLite"
}
```

### Get All Tasks

**GET** `/tasks`

### Get a Task by ID

**GET** `/tasks/1`

### Update a Task

**PUT** `/tasks/1`

Request body:

```json
{
  "title": "Complete database assignment",
  "completed": true
}
```

### Delete a Task

**DELETE** `/tasks/1`

## 🗄️ Database

The application uses SQLite to store task information in a local database file named `tasks.db`.

The `tasks` table contains the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | INTEGER | Unique task identifier |
| `title` | TEXT | Task title |
| `completed` | INTEGER | Completion status: `0` for false and `1` for true |

The database and table are initialized automatically when the server starts.

## 🧪 Testing

You can test the API endpoints using Postman or another API testing tool.

Start the server before sending requests.

## 👩‍💻 Author

**Bhoomika Soni**
