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

    // Projeye ait tüm sprintleri çek (projectId'ye göre filtreleme)
    // Firestore'da taskler projectId ile doğrudan ilişkili değilse, 
    // önce sprintleri bulup sonra o sprintlere ait taskleri çekmek gerekebilir.
    // Ancak basitlik ve performans için task modeline projectId eklemek veya 
    // sprintId listesi üzerinden sorgu yapmak tercih edilir.
    
    // Şimdilik tasks koleksiyonundan projectId'ye göre doğrudan sorgu atıldığını varsayıyoruz.
    // Eğer task modelinde projectId yoksa, sprintId üzerinden gidilir.
    
    const sprintSnapshot = await db.collection('sprints')
      .where('projectId', '==', projectId)
      .get();
    
    if (sprintSnapshot.empty) {
      return generateAnalyticsReport([]); // Hiç sprint yoksa boş rapor dön
    }

    const sprintIds = [];
    sprintSnapshot.forEach(doc => sprintIds.push(doc.id));

    // Sprint ID listesine göre tüm taskleri çek
    const taskSnapshot = await db.collection('tasks')
      .where('sprintId', 'in', sprintIds)
      .get();

    const tasks = [];
    taskSnapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    // Fonksiyonel programlama utils fonksiyonunu kullanarak analizi gerçekleştir
    return generateAnalyticsReport(tasks);
  }
}

module.exports = new AnalyticsService();
