const express = require('express');
const Musician = require('./models/musician');
const Song = require('./models/Song');
const app = express();

app.use(express.json());


// GET ROUTES
app.get('/', (req, res, next) => {
  res.send({ hello: 'world' });
});

// Get all musicians
app.get('/musicians', (req, res, next) => {
  Musician
    .find()
    .then(musician => res.send(musician))
    .catch(next);
});

// Get all songs
app.get('/songs', (req, res, next) => {
  Song
    .find()
    .then(song => res.send(song))
    .catch(next);
});

//Get one musician by id
app.get('/musicians/:id', (req, res, next) => {
  Musician
    .findById(req.params.id)
    .then(musician => res.send(musician))
    .catch(next);
});

//Get one song by id
app.get('/songs/:id', (req, res, next) => {
  Song
    .findById(req.params.id)
    .then(song => res.send(song))
    .catch(next);
});


//POST ROUTES
app.post('/musicians', (req, res, next) => {
  Musician
    .insert(req.body)
    .then(musician => res.send(musician))
    .catch(next);
});

app.post('/songs', (req, res, next) => {
  Song
    .insert(req.body)
    .then(song => res.send(song))
    .catch(next);
});


//PUT ROUTES
app.put('/musicians/:id', (req, res, next) => {
  Musician
    .update(req.params.id, req.body)
    .then(musician => res.send(musician))
    .catch(next);
});

app.put('/songs/:id', (req, res, next) => {
  Song
    .update(req.params.id, req.body)
    .then(song => res.send(song))
    .catch(next);
});

//DELETE ROUTES
app.delete('/musicians/:id', (req, res, next) => {
  Musician
    .delete(req.params.id)
    .then(musician => res.send(musician))
    .catch(next);
});

app.delete('/songs/:id', (req, res, next) => {
  Song
    .delete(req.params.id)
    .then(song => res.send(song))
    .catch(next);
});


module.exports = app;
