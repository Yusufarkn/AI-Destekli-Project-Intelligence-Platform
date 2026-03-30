const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { createProjectValidator, assignUserValidator } = require('../validators/projectValidator');

// POST /projects - Yeni proje oluşturma
router.post('/', createProjectValidator, projectController.createProject);

// GET /projects - Tüm projeleri listeleme
router.get('/', projectController.getAllProjects);

// POST /projects/:id/assign-user - Projeye kullanıcı atama
router.post('/:id/assign-user', assignUserValidator, projectController.assignUserToProject);

module.exports = router;
