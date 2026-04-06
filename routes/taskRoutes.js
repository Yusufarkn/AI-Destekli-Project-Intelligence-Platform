const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { createTaskValidator, updateTaskValidator } = require('../validators/taskValidator');

// POST /tasks - Yeni task oluşturma
router.post('/', createTaskValidator, taskController.createTask);

// GET /tasks - Tüm taskleri listeleme
router.get('/', taskController.getAllTasks);

// PUT /tasks/:id - Task güncelleme
router.put('/:id', updateTaskValidator, taskController.updateTask);

module.exports = router;
