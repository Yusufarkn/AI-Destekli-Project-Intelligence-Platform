const { db } = require('../config/firebaseConfig');

class SprintService {
  async createSprint(sprintData) {
    const docRef = await db.collection('sprints').add({
      ...sprintData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...sprintData };
  }

  async getAllSprints() {
    const snapshot = await db.collection('sprints').get();
    const sprints = [];
    snapshot.forEach(doc => {
      sprints.push({ id: doc.id, ...doc.data() });
    });
    return sprints;
  }
}

module.exports = new SprintService();
