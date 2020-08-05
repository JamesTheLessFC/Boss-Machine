const express = require('express');
const minionsRouter = express.Router();

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId
} = require('./db');

//GET /api/minions to get an array of all minions.
minionsRouter.get('/', (req, res, next) => {
  res.send(getAllFromDatabase('minions'));
});

//POST /api/minions to create a new minion and save it to the database.
minionsRouter.post('/', (req, res, next) => {
  const newMinion = {
    name: req.body.name,
    title: req.body.title,
    salary: Number(req.body.salary),
    weaknesses: req.body.weaknesses
  };
  res.status(201).send(addToDatabase('minions', newMinion));
});

minionsRouter.use('/:minionId', (req, res, next) => {
  const minion = getFromDatabaseById('minions', req.params.minionId);
  if (!minion) {
    res.status(404).send();
  } else {
    req.minion = minion;
    next();
  }
});

//GET /api/minions/:minionId to get a single minion by id.
minionsRouter.get('/:minionId', (req, res, next) => {
  res.send(req.minion);
});

//PUT /api/minions/:minionId to update a single minion by id.
minionsRouter.put('/:minionId', (req, res, next) => {
  const newMinion = {
    id: req.minion.id,
    name: req.body.name,
    title: req.body.title,
    salary: Number(req.body.salary),
    weaknesses: req.body.weaknesses
  };
  res.send(updateInstanceInDatabase('minions', newMinion));
});

//DELETE /api/minions/:minionId to delete a single minion by id.
minionsRouter.delete('/:minionId', (req, res, next) => {
  const success = deleteFromDatabasebyId('minions', req.params.minionId);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

const workRouter = require('./workRouter');

minionsRouter.use('/:minionId/work', workRouter);

module.exports = minionsRouter;
