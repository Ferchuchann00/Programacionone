const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Crear base de datos
const db = new sqlite3.Database('./clientes.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    apellido TEXT,
    nombre TEXT,
    telefono TEXT,
    cuil TEXT
  )`);
});

// Obtener clientes
app.get('/clientes', (req, res) => {
  db.all("SELECT * FROM clientes", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Agregar cliente
app.post('/clientes', (req, res) => {
  const { apellido, nombre, telefono, cuil } = req.body;
  db.run(`INSERT INTO clientes (apellido, nombre, telefono, cuil) VALUES (?, ?, ?, ?)` ,
    [apellido, nombre, telefono, cuil],
    function(err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// Eliminar cliente
app.delete('/clientes/:id', (req, res) => {
  db.run("DELETE FROM clientes WHERE id = ?", req.params.id, function(err) {
    if (err) return res.status(500).json(err);
    res.json({ deleted: this.changes });
  });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
