const { validationResult } = require('express-validator');
const predictionService = require('../services/predictionService');

class PredictionController {
  /**
   * Geliştirici burnout tahminini döndüren controller metodu.
   * @param {Object} req 
   * @param {Object} res 
   */
  async getBurnoutPrediction(req, res) {
    // Validasyon kontrolü
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası.',
        errors: errors.array()
      });
    }

    try {
      const { developerId, developerSprintHistory } = req.body;

      // Eksik veri kontrolü (ekstra güvenlik)
      if (!developerId || !developerSprintHistory) {
        return res.status(400).json({
          success: false,
          message: 'Eksik veri: developerId ve developerSprintHistory zorunludur.'
        });
      }

      // Servis katmanından tahmini al
      const burnoutResult = await predictionService.analyzeBurnout(
        developerId, 
        developerSprintHistory
      );

      return res.status(200).json({
        success: true,
        data: burnoutResult,
        message: 'Burnout analizi başarıyla tamamlandı.'
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Burnout tahmini yapılırken bir hata oluştu.',
        error: error.message
      });
    }
  }
}

module.exports = new PredictionController();
