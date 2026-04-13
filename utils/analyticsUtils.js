/**
 * Analytics Engine için saf fonksiyonlar (pure functions) içeren yardımcı araçlar.
 * map, filter ve reduce kullanılarak fonksiyonel programlama prensiplerine göre yazılmıştır.
 */

// Toplam task sayısını hesaplar
const calculateTotalTasks = (tasks) => tasks.length;

// Tamamlanma oranını hesaplar (done olanlar / toplam)
const calculateCompletionRate = (tasks) => {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.status === 'done');
  return parseFloat((completedTasks.length / tasks.length).toFixed(2));
};

// Ortalama tamamlanma süresini hesaplar (actualHours ortalaması)
const calculateAvgCompletionTime = (tasks) => {
  const tasksWithActualHours = tasks.filter(task => task.actualHours !== undefined && task.actualHours !== null);
  if (tasksWithActualHours.length === 0) return 0;
  
  const totalHours = tasksWithActualHours.reduce((sum, task) => sum + parseFloat(task.actualHours), 0);
  return parseFloat((totalHours / tasksWithActualHours.length).toFixed(2));
};

// Bug yoğunluğunu hesaplar (description içinde "bug" geçenler / toplam)
const calculateBugDensity = (tasks) => {
  if (tasks.length === 0) return 0;
  const bugTasks = tasks.filter(task => 
    task.description && task.description.toLowerCase().includes('bug')
  );
  return parseFloat((bugTasks.length / tasks.length).toFixed(2));
};

// Tüm metrikleri birleştiren ana fonksiyon
const generateAnalyticsReport = (tasks) => {
  return {
    completionRate: calculateCompletionRate(tasks),
    avgCompletionTime: calculateAvgCompletionTime(tasks),
    bugDensity: calculateBugDensity(tasks),
    totalTasks: calculateTotalTasks(tasks)
  };
};

module.exports = {
  calculateTotalTasks,
  calculateCompletionRate,
  calculateAvgCompletionTime,
  calculateBugDensity,
  generateAnalyticsReport
};
