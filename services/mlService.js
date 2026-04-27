const { predictDelay } = require('../utils/mlModel');

class MLService {
  /**
   * Giriş verilerini kullanarak sprint gecikme tahminini gerçekleştirir.
   * @param {Object} inputData 
   * @returns {Object}
   */
  async getSprintDelayPrediction(inputData) {
    // ML modelini (utils/mlModel.js) kullanarak tahmini gerçekleştir
    return predictDelay(inputData);
  }
}

module.exports = new MLService();
