const express = require('express');
const Musician = require('./models/musician');
const app = express();

app.use(express.json());


app.get('/', (req, res, next) => {
  res.send({ hello: 'world' });
});

app.get('/musicians', (req, res, next) => {
  Musician
    .find()
    .then(musician => res.send(musician))
    .catch(next);
});

app.get('/musicians/:id', (req, res, next) => {
  Musician
    .findById(req.params.id)
    .then(musician => res.send(musician))
    .catch(next);
});

app.post('/musicians', (req, res, next) => {
  Musician
    .insert(req.body)
    .then(musician => res.send(musician))
    .catch(next);
});


module.exports = app;
