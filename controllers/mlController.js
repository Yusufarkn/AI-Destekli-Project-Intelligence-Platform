const { validationResult } = require('express-validator');
const mlService = require('../services/mlService');

class MLController {
  /**
   * Sprint gecikme tahminini döndüren controller metodu.
   * @param {Object} req 
   * @param {Object} res 
   */
  async getPrediction(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası.',
        errors: errors.array()
      });
    }

    try {
      const { task_completion_rate, bug_count, avg_task_time, workload_index } = req.body;

      // Eksik veri kontrolü (ekstra güvenlik)
      if (
        task_completion_rate === undefined || 
        bug_count === undefined || 
        avg_task_time === undefined || 
        workload_index === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: 'Eksik veri: Tüm metrikler (task_completion_rate, bug_count, avg_task_time, workload_index) zorunludur.'
        });
      }

      // Servis katmanından tahmini al
      const predictionData = await mlService.getSprintDelayPrediction({
        task_completion_rate,
        bug_count,
        avg_task_time,
        workload_index
      });

      return res.status(200).json({
        success: true,
        data: predictionData,
        message: 'Sprint gecikme tahmini başarıyla gerçekleştirildi.'
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Tahmin yapılırken bir hata oluştu.',
        error: error.message
      });
    }
  }
}

module.exports = new MLController();
