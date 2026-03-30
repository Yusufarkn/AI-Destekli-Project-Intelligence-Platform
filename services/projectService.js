const { db, admin } = require('../config/firebaseConfig');

class ProjectService {
  // Yeni proje oluşturma
  async createProject(projectData) {
    const docRef = await db.collection('projects').add({
      ...projectData,
      members: [], // Başlangıçta boş üye listesi
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...projectData, members: [] };
  }

  // Tüm projeleri getirme
  async getAllProjects() {
    const snapshot = await db.collection('projects').get();
    const projects = [];
    snapshot.forEach(doc => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  }

  // Projeye kullanıcı atama
  async assignUser(projectId, userId) {
    const projectRef = db.collection('projects').doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      throw new Error('Proje bulunamadı.');
    }

    // Kullanıcı var mı kontrolü (Opsiyonel ama iyi bir pratik)
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('Atanacak kullanıcı bulunamadı.');
    }

    // Firestore arrayUnion ile listeye kullanıcı ekleme
    await projectRef.update({
      members: admin.firestore.FieldValue.arrayUnion(userId)
    });

    return { projectId, userId };
  }
}

module.exports = new ProjectService();
