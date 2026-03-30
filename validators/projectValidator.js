const { body } = require('express-validator');

// Proje oluşturma için validasyon kuralları
const createProjectValidator = [
  body('name')
    .notEmpty().withMessage('Proje adı boş bırakılamaz.')
    .isLength({ min: 3 }).withMessage('Proje adı en az 3 karakter olmalıdır.'),
  body('description')
    .notEmpty().withMessage('Açıklama alanı boş bırakılamaz.')
];

// Projeye kullanıcı atama için validasyon kuralları
const assignUserValidator = [
  body('userId')
    .notEmpty().withMessage('Kullanıcı ID (userId) boş bırakılamaz.')
];

module.exports = { createProjectValidator, assignUserValidator };
