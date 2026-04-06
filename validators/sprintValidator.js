const { body } = require('express-validator');

const createSprintValidator = [
  body('projectId').notEmpty().withMessage('projectId zorunludur.'),
  body('name')
    .notEmpty().withMessage('Sprint adı zorunludur.')
    .isLength({ min: 3 }).withMessage('Sprint adı en az 3 karakter olmalıdır.'),
  body('startDate').notEmpty().withMessage('startDate zorunludur.').isISO8601().withMessage('Geçerli bir tarih formatı giriniz (ISO8601).'),
  body('endDate').notEmpty().withMessage('endDate zorunludur.').isISO8601().withMessage('Geçerli bir tarih formatı giriniz (ISO8601).'),
  body('status').notEmpty().withMessage('status zorunludur.').isIn(['active', 'completed']).withMessage('Geçersiz statü (active veya completed olmalı).')
];

module.exports = { createSprintValidator };
