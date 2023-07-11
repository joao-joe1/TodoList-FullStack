const express = require('express');
const tasksController = require('./controllers/tasksConstroller')
const router = express.Router()
const tasksMiddleware = require('./middlewares/taskMiddleware')

router.get('/tasks', tasksController.getAll);
router.post('/tasks', tasksMiddleware.validateBody, tasksController.createTask);
router.delete('/tasks/:id', tasksController.deleteTask);
router.put('/tasks/:id', tasksMiddleware.validateBodyPut, tasksController.updateTask);

module.exports = router;