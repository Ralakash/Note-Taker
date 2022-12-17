const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (error, data) => {
    res.send(data);
  });
});

// Add notes
app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (error, data) => {
    const notes = JSON.parse(data);
    notes.push({ ...req.body, id: uniqid() });
    fs.writeFile('./db/db.json', JSON.stringify(notes), (error, data) => {
      res.send(req.body);
    });
  });
});

// Delete posts
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (error, data) => {
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter((note) => note.id !== req.params.id);
    fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (error, data) => {
      res.send(req.body);
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
