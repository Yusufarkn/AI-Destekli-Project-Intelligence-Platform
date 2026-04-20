const riskService = require('../services/riskService');

class RiskController {
  /**
   * Belirli bir proje için risk analizini döndüren controller metodu.
   * @param {Object} req 
   * @param {Object} res 
   */
  async getRiskAnalysis(req, res) {
    try {
      const projectId = req.params.projectId;

      // projectId kontrolü (Validation)
      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: 'projectId zorunludur.'
        });
      }

      // Risk raporunu servis katmanından al
      const riskData = await riskService.getProjectRisk(projectId);

      return res.status(200).json({
        success: true,
        data: riskData,
        message: 'Risk analizi başarıyla gerçekleştirildi.'
      });

    } catch (error) {
      const statusCode = (error.message === 'Proje bulunamadı.' || 
                          error.message === 'Analiz edilecek sprint bulunamadı.' || 
                          error.message === 'Analiz edilecek task bulunamadı.') ? 404 : 500;
      
      return res.status(statusCode).json({
        success: false,
        message: 'Risk analizi yapılırken bir hata oluştu.',
        error: error.message
      });
    }
  }
}

module.exports = new RiskController();
