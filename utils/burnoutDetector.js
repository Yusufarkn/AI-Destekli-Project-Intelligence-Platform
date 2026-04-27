/**
 * Burnout (Tükenmişlik) Tespit Modülü
 * 
 * Bu modül, geliştiricilerin son 3 sprintteki performans verilerini analiz ederek
 * tükenmişlik riskini hesaplar. Fonksiyonel programlama prensiplerine (pure functions, immutability)
 * uygun olarak geliştirilmiştir.
 */

/**
 * Geliştiricinin burnout riskini hesaplayan ana fonksiyon.
 * @param {Array} sprintHistory - Geliştiricinin geçmiş sprint verileri (Array of Objects)
 * @returns {Object} Burnout analiz sonuçları
 */
const detectBurnout = (sprintHistory) => {
  // Analiz için en az son 3 sprint verisi gereklidir
  if (!sprintHistory || sprintHistory.length < 3) {
    return {
      isBurnoutRisk: false,
      burnoutRiskScore: 0,
      detectedPatterns: ["Analiz için yeterli sprint verisi (en az 3) bulunmuyor."]
    };
  }

  // Sadece son 3 sprinti al (Zaman serisi analizi için)
  const lastThreeSprints = sprintHistory.slice(-3);

  // 1. Trend Hesaplama: Task Yükü (totalTasks)
  // Her sprint arasındaki farkı hesaplayıp artış eğilimini (slope) buluyoruz
  const taskCounts = lastThreeSprints.map(s => s.totalTasks);
  const taskSlopes = taskCounts.slice(1).map((count, i) => count - taskCounts[i]);
  const isTaskIncreasing = taskSlopes.every(slope => slope > 0);
  const avgTaskIncrease = taskCounts[0] !== 0 
    ? (taskSlopes.reduce((acc, curr) => acc + curr, 0) / taskCounts[0] * 100).toFixed(1)
    : "0.0";

  // 2. Trend Hesaplama: Bug Yoğunluğu (bugsReported)
  const bugCounts = lastThreeSprints.map(s => s.bugsReported);
  const bugSlopes = bugCounts.slice(1).map((count, i) => count - bugCounts[i]);
  const isBugsIncreasing = bugSlopes.every(slope => slope > 0);

  // 3. Trend Hesaplama: Tamamlama Oranı (Completion Rate)
  const completionRates = lastThreeSprints.map(s => s.totalTasks !== 0 ? (s.completedTasks / s.totalTasks) * 100 : 0);
  const rateSlopes = completionRates.slice(1).map((rate, i) => rate - completionRates[i]);
  const isRateDecreasing = rateSlopes.every(slope => slope < 0);
  
  const initialRate = completionRates[0].toFixed(1);
  const finalRate = completionRates[completionRates.length - 1].toFixed(1);

  // Paternlerin Kesişimi
  const isBurnoutRisk = isTaskIncreasing && isBugsIncreasing && isRateDecreasing;

  // Risk Skoru Hesaplama (0-100)
  // Her bir negatif patern skoru artırır. 3'lü kesişim varsa taban puan 70'ten başlar.
  let score = 0;
  if (isTaskIncreasing) score += 20;
  if (isBugsIncreasing) score += 20;
  if (isRateDecreasing) score += 30;
  if (isBurnoutRisk) score += 30; // 3'lü patern bonusu

  // Tespit edilen mesajları oluştur
  const detectedPatterns = [];
  if (isTaskIncreasing) detectedPatterns.push(`Task load has increased by an average of ${avgTaskIncrease}% over the last 3 sprints.`);
  if (isBugsIncreasing) detectedPatterns.push("Bug density is trending upwards.");
  if (isRateDecreasing) detectedPatterns.push(`Completion rate dropped from ${initialRate}% to ${finalRate}%.`);

  return {
    burnoutRiskScore: score,
    isBurnoutRisk,
    detectedPatterns: detectedPatterns.length > 0 ? detectedPatterns : ["No burnout patterns detected."]
  };
};

module.exports = {
  detectBurnout
};
