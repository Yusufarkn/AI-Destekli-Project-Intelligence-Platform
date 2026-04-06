const { body } = require('express-validator');

const createTaskValidator = [
  body('sprintId').notEmpty().withMessage('sprintId zorunludur.'),
  body('title')
    .notEmpty().withMessage('Task başlığı zorunludur.')
    .isLength({ min: 3 }).withMessage('Task başlığı en az 3 karakter olmalıdır.'),
  body('status').notEmpty().withMessage('status zorunludur.').isIn(['todo', 'in_progress', 'done']).withMessage('Geçersiz statü (todo, in_progress veya done olmalı).'),
  body('estimatedHours')
    .notEmpty().withMessage('estimatedHours zorunludur.')
    .isFloat({ min: 0.1 }).withMessage('estimatedHours pozitif bir sayı olmalıdır.')
];

const updateTaskValidator = [
  body('title').optional().isLength({ min: 3 }).withMessage('Task başlığı en az 3 karakter olmalıdır.'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Geçersiz statü (todo, in_progress veya done olmalı).'),
  body('estimatedHours').optional().isFloat({ min: 0.1 }).withMessage('estimatedHours pozitif bir sayı olmalıdır.'),
  body('actualHours').optional().isFloat({ min: 0 }).withMessage('actualHours 0 veya daha büyük bir sayı olmalıdır.')
];

module.exports = { createTaskValidator, updateTaskValidator };
