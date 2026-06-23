const { db } = require('../config/firebaseConfig');
const { generateAnalyticsReport } = require('../utils/analyticsUtils');

class AnalyticsService {
  /**
   * Belirli bir proje ID'sine ait task verilerini çeker ve analiz eder.
   * @param {string} projectId 
   * @returns {Promise<Object>}
   */
  async getProjectAnalytics(projectId) {
    // Projenin varlığını kontrol et (opsiyonel ama iyi bir pratik)
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error('Proje bulunamadı.');
    }

    // Projeye ait tüm taskleri çek (projectId'ye göre filtreleme)
    const taskSnapshot = await db.collection('tasks')
      .where('projectId', '==', projectId)
      .get();

    const tasks = [];
    taskSnapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    // Fonksiyonel programlama utils fonksiyonunu kullanarak analizi gerçekleştir
    return generateAnalyticsReport(tasks);
  }

  /**
   * Belirli bir proje için özet analitik verileri döndürür.
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getProjectSummary(projectId) {
    // Projenin varlığını kontrol et
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error('Proje bulunamadı.');
    }

    const projectData = projectDoc.data();

    // Projeye ait tüm taskleri çek
    const taskSnapshot = await db.collection('tasks')
      .where('projectId', '==', projectId)
      .get();

    const tasks = [];
    taskSnapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    // Metrikleri hesapla
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done' || t.status === 'Completed').length;
    const activeTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'In Progress').length;
    const delayedTasks = 0; // Mock for now
    const completionRate = totalTasks > 0 ? parseFloat(((completedTasks / totalTasks) * 100).toFixed(1)) : 0;

    // Sprint trendleri (mock for now)
    const sprintTrends = [
      { name: 'Sprint 1', velocity: 8, quality: 85 },
      { name: 'Sprint 2', velocity: 10, quality: 80 },
      { name: 'Sprint 3', velocity: 7, quality: 75 },
    ];

    // Bug density data (developers)
    const devStats = {};
    tasks.forEach(t => {
      const dev = t.assignee || t.assignedTo || 'Bilinmeyen';
      if (!devStats[dev]) {
        devStats[dev] = { completedTasks: 0, bugs: 0 };
      }
      if (t.status === 'done' || t.status === 'Completed') {
        devStats[dev].completedTasks++;
      }
      if ((t.description && t.description.toLowerCase().includes('bug')) || t.priority === 'High') {
        devStats[dev].bugs++;
      }
    });

    const bugDensityData = Object.entries(devStats).map(([developer, stats]) => ({
      developer,
      completedTasks: stats.completedTasks,
      bugs: stats.bugs,
    }));

    return {
      overallRiskScore: projectData.riskScore || 50,
      activeSprint: projectData.sprintCount ? `Sprint ${projectData.sprintCount}` : 'Sprint 1',
      totalSprints: projectData.sprintCount || 3,
      activeTasks,
      delayedTasks,
      criticalAlerts: [],
      sprintTrends,
      bugDensityData,
      completionRate,
      onTimeDelivery: 85,
      qualityScore: 80,
      teamVelocity: 25,
    };
  }
}

module.exports = new AnalyticsService();
