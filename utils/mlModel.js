/**
 * Manuel olarak implement edilmiş basit bir Logistic Regression modeli.
 * Herhangi bir hazır ML kütüphanesi kullanılmamıştır.
 */

// Sigmoid fonksiyonu: prediction = 1 / (1 + e^-z)
const sigmoid = (z) => {
  return 1 / (1 + Math.exp(-z));
};

// Tahmin ağırlıkları (Weights) ve Bias
const weights = {
  w1: -2.5, // completion_rate: yüksekse gecikme riski düşer (-)
  w2: 0.3,  // bug_count: yüksekse gecikme riski artar (+)
  w3: 0.2,  // avg_task_time: yüksekse gecikme riski artar (+)
  w4: 1.5,  // workload_index: yüksekse gecikme riski artar (+)
  bias: -1
};

/**
 * Verilen metriklerle gecikme ihtimalini hesaplar.
 * @param {Object} input 
 * @returns {Object}
 */
const predictDelay = (input) => {
  const { task_completion_rate, bug_count, avg_task_time, workload_index } = input;

  // Doğrusal bileşen (z) hesaplama
  // z = (w1 * completion) + (w2 * bugs) + (w3 * time) + (w4 * workload) + bias
  const z = 
    (weights.w1 * task_completion_rate) +
    (weights.w2 * bug_count) +
    (weights.w3 * avg_task_time) +
    (weights.w4 * workload_index) +
    weights.bias;

  // Olasılık (Probability) hesaplama
  const probability = sigmoid(z);
  
  // Tahmin sonucunu belirle (Threshold: 0.5)
  const isDelayed = probability > 0.5;

  return {
    delayProbability: parseFloat(probability.toFixed(4)),
    delayPercentage: `%${(probability * 100).toFixed(2)}`,
    prediction: isDelayed ? 'Delayed' : 'On Time'
  };
};

module.exports = {
  sigmoid,
  predictDelay
};
