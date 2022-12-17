// Calls the packages needed to access express, path, the file system, and uniqid
const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

// adds the ability to call express through the variable app.
const app = express();

// gives us a port acccess that defaults to 3001 if no other port is given.
const PORT = process.env.PORT || 3001;

// allows our server to use JSON and to access the public folder.
app.use(express.json());
app.use(express.static('public'));

// creates a get method that redirects you to the notes HTML page.
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// creates a get function that reads the information in the db.json file and sends it back
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (error, data) => {
    res.send(data);
  });
});

// Add notes to the db.json file and sends back the information.
app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (error, data) => {
    const notes = JSON.parse(data);
    notes.push({ ...req.body, id: uniqid() });
    fs.writeFile('./db/db.json', JSON.stringify(notes), (error, data) => {
      res.send(req.body);
    });
  });
});

// creates a method to delete previously made notes based on their unique id.
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (error, data) => {
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter((note) => note.id !== req.params.id);
    fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (error, data) => {
      res.send(req.body);
    });
  });
});

// creates a default get method that sends users to the home page.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// console logs when the server goes live and what port it is running on.
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
