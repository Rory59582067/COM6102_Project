const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// 配置 CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // 前端运行的地址
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的请求方法
    allowedHeaders: ['Content-Type'], // 允许的请求头
    credentials: true, // 如果需要发送 Cookie，可以启用此选项
}));

app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});
app.options('/login', (req, res) => {
    res.sendStatus(200); // 响应预检请求
});

// 数据库设置
const dbPath = path.resolve(__dirname, '../database/movie_db.sqlite');
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


// Movies routes
app.get('/movies', (req, res) => {
    db.all('SELECT * FROM movies', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.post('/movies', (req, res) => {
    console.log('Received data:', req.body); // 打印接收到的数据
    const { title, director, year } = req.body;

    if (!title || !director || !year) {
        console.error('Missing fields:', { title, director, year });
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run(
        'INSERT INTO movies (title, director, year) VALUES (?, ?, ?)',
        [title, director, year],
        function (err) {
            if (err) {
                console.error('Error inserting movie:', err.message);
                return res.status(500).json({ error: 'Failed to add movie' });
            }
            console.log('Movie added with ID:', this.lastID);
            res.status(201).json({ id: this.lastID });
        }
    );
});

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    console.log('Deleting movie with ID:', id);
    db.run('DELETE FROM movies WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ deleted: this.changes });
        }
    });
});

app.put('/movies/:id', (req, res) => {
    const { id } = req.params;
    const { title, director, year } = req.body;

    console.log('Updating movie with ID:', id, { title, director, year });

    if (!title || !director || !year) {
        console.error('Missing fields:', { title, director, year });
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run(
        'UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?',
        [title, director, year, id],
        function (err) {
            if (err) {
                console.error('Error updating movie:', err.message);
                return res.status(500).json({ error: 'Failed to update movie' });
            }
            if (this.changes === 0) {
                console.log('No movie found with the given ID.');
                return res.status(404).json({ error: 'Movie not found' });
            }
            console.log('Movie updated successfully.');
            res.status(200).json({ message: 'Movie updated successfully' });
        }
    );
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    console.log('Received registration request:', { username, password });

    if (!username || !password) {
        console.error('Missing username or password');
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Error checking username:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (row) {
            console.log('Username already exists:', username);
            return res.status(400).json({ error: 'Username already exists' });
        }

        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err) {
            if (err) {
                console.error('Error inserting user:', err.message);
                return res.status(500).json({ error: 'Failed to register user' });
            }
            console.log('User registered successfully with ID:', this.lastID);
            res.status(201).json({ id: this.lastID, message: 'User registered successfully' });
        });
    });
});