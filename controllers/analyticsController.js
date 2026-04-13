const analyticsService = require('../services/analyticsService');

class AnalyticsController {
  /**
   * Belirli bir proje için analitik verileri döndüren controller metodu.
   * @param {Object} req 
   * @param {Object} res 
   */
  async getAnalytics(req, res) {
    try {
      const projectId = req.params.projectId;

      // projectId kontrolü (Validation)
      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: 'projectId zorunludur.'
        });
      }

      // Analiz raporunu servis katmanından al
      const analyticsData = await analyticsService.getProjectAnalytics(projectId);

      return res.status(200).json({
        success: true,
        data: analyticsData,
        message: 'Analitik veriler başarıyla oluşturuldu.'
      });

    } catch (error) {
      return res.status(error.message === 'Proje bulunamadı.' ? 404 : 500).json({
        success: false,
        message: 'Analitik veriler oluşturulurken bir hata oluştu.',
        error: error.message
      });
    }
  }
}

module.exports = new AnalyticsController();
