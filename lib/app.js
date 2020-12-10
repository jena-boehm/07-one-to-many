const express = require('express');
const Musician = require('./models/musician');
const app = express();

app.use(express.json());


app.get('/', (req, res, next) => {
  res.send({ hello: 'world' });
});

app.post('/musicians', (req, res, next) => {
  Musician
    .insert(req.body)
    .then(musician => res.send(musician))
    .catch(next);
});


module.exports = app;
