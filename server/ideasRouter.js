const express = require('express');
const ideasRouter = express.Router();

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId
} = require('./db');

const checkMillionDollarIdea = require('./checkMillionDollarIdea');

// GET /api/ideas to get an array of all ideas.
ideasRouter.get('/', (req, res, next) => {
  res.send(getAllFromDatabase('ideas'));
});

// POST /api/ideas to create a new idea and save it to the database.
ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
  const newIdea = {
    name: req.body.name,
    description: req.body.description,
    numWeeks: Number(req.body.numWeeks),
    weeklyRevenue: Number(req.body.weeklyRevenue)
  };
  res.status(201).send(addToDatabase('ideas', newIdea));
});

ideasRouter.use('/:ideaId', (req, res, next) => {
  const idea = getFromDatabaseById('ideas', req.params.ideaId);
  if (!idea) {
    res.status(404).send();
  } else {
    req.idea = idea;
    next();
  }
});

// GET /api/ideas/:ideaId to get a single idea by id.
ideasRouter.get('/:ideaId', (req, res, next) => {
  res.send(req.idea);
});

// PUT /api/ideas/:ideaId to update a single idea by id.
ideasRouter.put('/:ideaId', (req, res, next) => {
  const newIdea = {
    id: req.idea.id,
    name: req.body.name,
    description: req.body.description,
    numWeeks: Number(req.body.numWeeks),
    weeklyRevenue: Number(req.body.weeklyRevenue)
  };
  res.send(updateInstanceInDatabase('ideas', newIdea));
});

// DELETE /api/ideas/:ideaId to delete a single idea by id.
ideasRouter.delete('/:ideaId', (req, res, next) => {
  const success = deleteFromDatabasebyId('ideas', req.params.ideaId);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

module.exports = ideasRouter;
