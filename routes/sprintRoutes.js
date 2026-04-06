const express = require('express');
const router = express.Router();
const sprintController = require('../controllers/sprintController');
const { createSprintValidator } = require('../validators/sprintValidator');

// POST /sprints - Yeni sprint oluşturma
router.post('/', createSprintValidator, sprintController.createSprint);

// GET /sprints - Tüm sprintleri listeleme
router.get('/', sprintController.getAllSprints);

module.exports = router;
