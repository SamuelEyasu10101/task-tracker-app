// backend_task_tracker.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'samuel',
  password: 'password123',
  database: 'tasktracker'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Create tasks table if it doesn't exist
const createTableQuery = `CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false
)`;
db.query(createTableQuery);

app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/tasks', (req, res) => {
  const { text } = req.body;
  db.query('INSERT INTO tasks (text) VALUES (?)', [text], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, text, completed: false });
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, completed });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
