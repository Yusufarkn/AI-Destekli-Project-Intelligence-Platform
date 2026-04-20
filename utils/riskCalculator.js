/**
 * AI Risk Engine için saf hesaplama fonksiyonları (pure functions).
 * map, filter ve reduce metodları kullanılarak yazılmıştır.
 */

// Tamamlanma oranını hesaplar (done / toplam)
const calculateCompletionRate = (tasks) => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'done').length;
  return completed / tasks.length;
};

// Bug yoğunluğunu hesaplar (description'da 'bug' geçenler / toplam)
const calculateBugDensity = (tasks) => {
  if (tasks.length === 0) return 0;
  const bugs = tasks.filter(t => t.description && t.description.toLowerCase().includes('bug')).length;
  return bugs / tasks.length;
};

// Ortalama tamamlanma süresini hesaplar (actualHours ortalaması)
const calculateAvgCompletionTime = (tasks) => {
  const validTasks = tasks.filter(t => t.actualHours !== undefined && t.actualHours !== null);
  if (validTasks.length === 0) return 0;
  const total = validTasks.reduce((sum, t) => sum + parseFloat(t.actualHours), 0);
  return total / validTasks.length;
};

// Overload olan kullanıcı sayısını ve faktörü hesaplar
const calculateOverloadMetrics = (tasks) => {
  // Kullanıcı bazlı saatleri topla
  const userHours = tasks.reduce((acc, t) => {
    if (t.assignedTo && t.estimatedHours) {
      acc[t.assignedTo] = (acc[t.assignedTo] || 0) + parseFloat(t.estimatedHours);
    }
    return acc;
  }, {});

  const overloadedUsersList = Object.values(userHours).filter(hours => hours > 40);
  const overloadedUsersCount = overloadedUsersList.length;
  const overloadFactor = overloadedUsersCount > 0 ? 1 : 0;

  return { overloadedUsersCount, overloadFactor };
};

// Risk seviyesini belirler
const determineRiskLevel = (score) => {
  if (score <= 40) return 'low';
  if (score <= 70) return 'medium';
  return 'high';
};

// Ana risk hesaplama fonksiyonu
const calculateFinalRisk = (tasks) => {
  if (!tasks || tasks.length === 0) {
    throw new Error('Analiz edilecek task bulunamadı.');
  }

  const completionRate = calculateCompletionRate(tasks);
  const bugDensity = calculateBugDensity(tasks);
  const avgCompletionTime = calculateAvgCompletionTime(tasks);
  const { overloadedUsersCount, overloadFactor } = calculateOverloadMetrics(tasks);

  // Normalizasyon
  const completionRisk = 1 - completionRate;
  const bugRisk = bugDensity;
  const timeRisk = Math.min(avgCompletionTime / 100, 1); // Max 100 varsayımıyla normalize et, max 1
  const overloadRisk = overloadFactor;

  // Ağırlıklı hesaplama
  const riskScoreNormalized = 
    (0.3 * completionRisk) + 
    (0.3 * bugRisk) + 
    (0.2 * timeRisk) + 
    (0.2 * overloadRisk);

  const riskScore = parseFloat((riskScoreNormalized * 100).toFixed(2));

  return {
    riskScore,
    riskScoreNormalized: parseFloat(riskScoreNormalized.toFixed(4)),
    riskLevel: determineRiskLevel(riskScore),
    metrics: {
      completionRate: parseFloat(completionRate.toFixed(2)),
      bugDensity: parseFloat(bugDensity.toFixed(2)),
      avgCompletionTime: parseFloat(avgCompletionTime.toFixed(2)),
      overloadedUsers: overloadedUsersCount
    }
  };
};

module.exports = {
  calculateCompletionRate,
  calculateBugDensity,
  calculateAvgCompletionTime,
  calculateOverloadMetrics,
  calculateFinalRisk
};
