const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

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

// 数据库设置
const path = require('path');
const dbPath = path.resolve(__dirname, '../database/movie_db.sql');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// 登录端点
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Request body:', req.body); // 打印前端发送的数据

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else if (row) {
            console.log('Query result:', row); // 打印查询结果
            res.json({ username: row.username });
        } else {
            console.log('No matching user found'); // 如果没有匹配的用户
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});