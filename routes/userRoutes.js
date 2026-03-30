const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { createUserValidator } = require('../validators/userValidator');

// POST /users - Yeni kullanıcı oluşturma
router.post('/', createUserValidator, userController.createUser);

// GET /users - Tüm kullanıcıları listeleme
router.get('/', userController.getAllUsers);

module.exports = router;
