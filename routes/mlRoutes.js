const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const mlController = require('../controllers/mlController');

// POST /predict-delay - Sprint gecikme tahminini getirir
router.post('/', [
  body('task_completion_rate')
    .notEmpty().withMessage('task_completion_rate zorunludur.')
    .isFloat({ min: 0, max: 1 }).withMessage('task_completion_rate 0 ile 1 arasında olmalıdır.'),
  body('bug_count')
    .notEmpty().withMessage('bug_count zorunludur.')
    .isInt({ min: 0 }).withMessage('bug_count pozitif bir tam sayı olmalıdır.'),
  body('avg_task_time')
    .notEmpty().withMessage('avg_task_time zorunludur.')
    .isFloat({ min: 0 }).withMessage('avg_task_time pozitif bir sayı olmalıdır.'),
  body('workload_index')
    .notEmpty().withMessage('workload_index zorunludur.')
    .isFloat({ min: 0 }).withMessage('workload_index pozitif bir sayı olmalıdır.')
], mlController.getPrediction);

module.exports = router;
