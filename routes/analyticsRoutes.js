const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /analytics/:projectId - Proje analitik metriklerini getirir
router.get('/:projectId', analyticsController.getAnalytics);

module.exports = router;
