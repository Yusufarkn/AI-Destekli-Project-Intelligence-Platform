const { db } = require('../config/firebaseConfig');
const { calculateFinalRisk } = require('../utils/riskCalculator');

class RiskService {
  /**
   * Belirli bir proje için risk analizini gerçekleştirir.
   * @param {string} projectId 
   * @returns {Promise<Object>}
   */
  async getProjectRisk(projectId) {
    // Projenin varlığını doğrula
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error('Proje bulunamadı.');
    }

    // Projeye ait tüm sprintleri çek
    const sprintSnapshot = await db.collection('sprints')
      .where('projectId', '==', projectId)
      .get();
    
    if (sprintSnapshot.empty) {
      throw new Error('Analiz edilecek sprint bulunamadı.');
    }

    const sprintIds = [];
    sprintSnapshot.forEach(doc => sprintIds.push(doc.id));

    // Sprint ID listesine göre tüm taskleri çek
    const taskSnapshot = await db.collection('tasks')
      .where('sprintId', 'in', sprintIds)
      .get();

    if (taskSnapshot.empty) {
      throw new Error('Analiz edilecek task bulunamadı.');
    }

    const tasks = [];
    taskSnapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    // Risk hesaplamalarını gerçekleştir
    return calculateFinalRisk(tasks);
  }
}

module.exports = new RiskService();
