const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');

// GET /risk/:projectId - Proje risk analizini getirir
router.get('/:projectId', riskController.getRiskAnalysis);

module.exports = router;
