const { body } = require('express-validator');

// Kullanıcı oluşturma için validasyon kuralları
const createUserValidator = [
  body('name')
    .notEmpty().withMessage('İsim alanı boş bırakılamaz.')
    .isLength({ min: 3 }).withMessage('İsim en az 3 karakter olmalıdır.'),
  body('email')
    .notEmpty().withMessage('Email alanı boş bırakılamaz.')
    .isEmail().withMessage('Geçerli bir email adresi giriniz.'),
  body('role')
    .notEmpty().withMessage('Rol alanı boş bırakılamaz.')
    .isIn(['admin', 'project_manager', 'developer']).withMessage('Geçersiz rol. Sadece admin, project_manager veya developer olabilir.')
];

module.exports = { createUserValidator };
