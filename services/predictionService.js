const { detectBurnout } = require('../utils/burnoutDetector');

class PredictionService {
  /**
   * Geliştirici için burnout analizini gerçekleştirir.
   * @param {string} developerId 
   * @param {Array} developerSprintHistory 
   * @returns {Object} Analiz sonuçları
   */
  async analyzeBurnout(developerId, developerSprintHistory) {
    // Algoritmayı çalıştır
    const analysis = detectBurnout(developerSprintHistory);

    // Geliştirici ID'sini sonuca ekle
    return {
      developerId,
      ...analysis
    };
  }
}

module.exports = new PredictionService();
