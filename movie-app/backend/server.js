const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware

// 配置 CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // 允许的前端地址
    methods: ['GET', 'POST', 'OPTIONS'], // 允许的请求方法
    allowedHeaders: ['Content-Type'], // 允许的请求头
}));
app.use(bodyParser.json());
app.options('/login', (req, res) => {
    res.sendStatus(200); // 响应预检请求
});
// Database setup
const db = new sqlite3.Database('./database/movie_db.sql', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else if (row) {
            res.json({ username: row.username });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});