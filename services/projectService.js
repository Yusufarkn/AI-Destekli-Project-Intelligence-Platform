const { db, admin } = require('../config/firebaseConfig');

const calculateProjectRisk = (project) => {
  let risk = 30;
  if (project.settings) {
    const delayEffect = (project.settings.delaySensitivity - 50) * 0.4;
    const bugEffect = (30 - project.settings.bugThreshold) * 0.3;
    risk += delayEffect + bugEffect;
  }
  if (project.sprintCount > 20) risk += 15;
  else if (project.sprintCount > 10) risk += 5;
  return Math.round(Math.max(5, Math.min(95, risk)));
};

class ProjectService {
  // Yeni proje oluşturma
  async createProject(projectData) {
    const newProject = {
      ...projectData,
      members: [],
      riskScore: 30,
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('projects').add(newProject);
    return { id: docRef.id, ...newProject };
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

  // Projeyi güncelleme
  async updateProject(projectId, updateData) {
    const projectRef = db.collection('projects').doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      throw new Error('Proje bulunamadı.');
    }

    const currentData = projectDoc.data();
    const mergedData = { ...currentData, ...updateData };
    const newRiskScore = calculateProjectRisk(mergedData);

    const dataToUpdate = {
      ...updateData,
      riskScore: newRiskScore,
      updatedAt: new Date().toISOString()
    };

    await projectRef.update(dataToUpdate);

    return { id: projectId, ...dataToUpdate };
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
