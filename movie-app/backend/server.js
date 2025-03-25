// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'movie_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const token = jwt.sign({ username }, 'secretKey');
            res.json({ success: true, token });
        } else {
            res.json({ success: false });
        }
    });
});

app.get('/api/movies', (req, res) => {
    db.query('SELECT * FROM movies', (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/api/movies', (req, res) => {
    const { title, director, year } = req.body;
    db.query('INSERT INTO movies (title, director, year) VALUES (?, ?, ?)', [title, director, year], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

app.put('/api/movies/:id', (req, res) => {
    const { title, director, year } = req.body;
    const id = req.params.id;
    db.query('UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?', [title, director, year, id], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

app.delete('/api/movies/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM movies WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});