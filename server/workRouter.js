const express = require('express');
const workRouter = express.Router({ mergeParams: true });

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId
} = require('./db');

//GET /api/minions/:minionId/work to get an array of all work for the specified minon.
workRouter.get('/', (req, res, next) => {
    const work = getAllFromDatabase('work');
    const minionWork = work.filter((workInstance) => {
      return workInstance.minionId === req.minion.id;
    });
    res.send(minionWork);
});

//POST /api/minions/:minionId/work to create a new work object and save it to the database.
workRouter.post('/', (req, res, next) => {
  const minionWork = {
    title: req.body.title,
    description: req.body.description,
    hours: Number(req.body.hours),
    minionId: req.body.minionId
  };
  res.status(201).send(addToDatabase('work', minionWork));
});

workRouter.use('/:workId', (req, res, next) => {
  const work = getFromDatabaseById('work', req.params.workId);
  if (!work) {
    res.status(404).send();
  } else {
    req.work = work;
    next();
  }
});

//PUT /api/minions/:minionId/work/:workId to update a single work by id.
workRouter.put('/:workId', (req, res, next) => {
  if (req.work.minionId !== req.minion.id) {
    res.status(400).send();
  } else {
    const newWork = {
      id: req.work.id,
      title: req.body.title,
      description: req.body.description,
      hours: Number(req.body.hours),
      minionId: req.body.minionId
    };
    res.send(updateInstanceInDatabase('work', newWork));
  }
});

//DELETE /api/minions/:minionId/work/:workId to delete a single work by id.
workRouter.delete('/:workId', (req, res, next) => {
  deleteFromDatabasebyId('work', req.params.minionId);
  res.status(204).send();
});

module.exports = workRouter;
