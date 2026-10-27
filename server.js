const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to SQLite database
const dbPath = path.join(__dirname, "tasks.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create tasks table
db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
    )
`, (err) => {
    if (err) {
        console.error("Error creating table:", err.message);
    } else {
        console.log("Tasks table is ready.");
    }
});

// Helper function to execute INSERT, UPDATE and DELETE
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            }
        });
    });
}

// Helper function to retrieve multiple rows
function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Helper function to retrieve one row
function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// GET all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await all("SELECT * FROM tasks ORDER BY id");
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve tasks" });
    }
});

// GET a single task
app.get("/tasks/:id", async (req, res) => {
    try {
        const task = await get(
            "SELECT * FROM tasks WHERE id = ?",
            [req.params.id]
        );

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve task" });
    }
});

// POST create a new task
app.post("/tasks", async (req, res) => {
    try {
        const { title, completed = false } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                error: "Title is required"
            });
        }

        if (typeof completed !== "boolean") {
            return res.status(400).json({
                error: "Completed must be true or false"
            });
        }

        const result = await run(
            "INSERT INTO tasks (title, completed) VALUES (?, ?)",
            [title.trim(), completed ? 1 : 0]
        );

        const task = await get(
            "SELECT * FROM tasks WHERE id = ?",
            [result.lastID]
        );

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: "Failed to create task" });
    }
});

// PUT update an existing task
app.put("/tasks/:id", async (req, res) => {
    try {
        const { title, completed } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof completed !== "boolean"
        ) {
            return res.status(400).json({
                error: "A valid title and completed boolean are required"
            });
        }

        const result = await run(
            `UPDATE tasks
             SET title = ?, completed = ?
             WHERE id = ?`,
            [title.trim(), completed ? 1 : 0, req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        const task = await get(
            "SELECT * FROM tasks WHERE id = ?",
            [req.params.id]
        );

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

// DELETE a task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const result = await run(
            "DELETE FROM tasks WHERE id = ?",
            [req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});