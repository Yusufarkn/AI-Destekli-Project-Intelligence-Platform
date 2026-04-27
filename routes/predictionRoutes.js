const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const predictionController = require('../controllers/predictionController');

/**
 * @route   POST /prediction/burnout
 * @desc    Geliştirici burnout riskini tahmin eder.
 * @access  Public (Örnek amaçlı)
 */
router.post('/burnout', [
  body('developerId')
    .notEmpty().withMessage('developerId zorunludur.'),
  body('developerSprintHistory')
    .isArray({ min: 1 }).withMessage('developerSprintHistory bir dizi olmalı ve en az 1 sprint verisi içermelidir.')
    .custom((value) => {
      // Sprint verilerinin yapısını kontrol et
      const isValid = value.every(s => 
        s.sprintId && 
        typeof s.totalTasks === 'number' && 
        typeof s.completedTasks === 'number' && 
        typeof s.bugsReported === 'number'
      );
      if (!isValid) {
        throw new Error('Geçersiz sprint verisi formatı. sprintId, totalTasks, completedTasks ve bugsReported zorunludur.');
      }
      return true;
    })
], predictionController.getBurnoutPrediction);

module.exports = router;
