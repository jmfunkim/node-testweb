const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const dbconfig = require('./db.js');
const connection = mysql.createConnection(dbconfig);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/post.html');
  });

app.get('/articles', (req, res) => {
  connection.query('SELECT * FROM board', (err, rows) => {
    if (err) {
      console.error(err);
    }
    res.send(rows);
  });
});

app.get('/article/:id', (req, res) => {
  connection.query('SELECT * FROM board WHERE idx = ?', [req.params.id], (err, rows) => {
    if (err) {
      console.error(err);
    }
    res.send(rows[0]);
  });
});

app.post('/article/create', (req, res) => {
  const sql = 'INSERT INTO board (title, writer, content) VALUES (?, ?, ?)';
  const params = [req.body.title, req.body.writer, req.body.content];
  
  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
    }
    res.send({ id: result.insertId, ...req.body });
  });
});

app.put('/article/:id', (req, res) => {
  const selectSql = 'SELECT * FROM board WHERE idx = ?';
  const updateSql = 'UPDATE board SET title = ?, writer = ?, content = ? WHERE idx = ?';
  const params = [req.body.title, req.body.writer, req.body.content, req.params.id];

  connection.query(selectSql, [req.params.id], (err, rows) => {
    if (err) {
      console.error(err);
    }
    connection.query(updateSql, params, (err) => {
      if (err) {
        console.error(err);
      }
      res.send({ id: req.params.id, ...req.body });
    });
  });
});

app.delete('/article/:id', (req, res) => {
  const selectSql = 'SELECT * FROM board WHERE idx = ?';
  const deleteSql = 'DELETE FROM board WHERE idx = ?';

  connection.query(selectSql, [req.params.id], (err, rows) => {
    if (err) {
      console.error(err);
    }
    connection.query(deleteSql, [req.params.id], (err) => {
      if (err) {
        console.error(err);
      }
      res.json({ message: `deleted: ${req.params.id}` });
    });
  });
});

app.listen(port, function() {
    console.log(`Server is running on http://localhost:${port}`)
  });
