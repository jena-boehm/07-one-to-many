const express = require('express');
const Musician = require('./models/musician');
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

//Get one musician by id
app.get('/musicians/:id', (req, res, next) => {
  Musician
    .findById(req.params.id)
    .then(musician => res.send(musician))
    .catch(next);
});


//POST ROUTE
app.post('/musicians', (req, res, next) => {
  Musician
    .insert(req.body)
    .then(musician => res.send(musician))
    .catch(next);
});


//PUT ROUTE


//DELETE ROUTE


module.exports = app;
