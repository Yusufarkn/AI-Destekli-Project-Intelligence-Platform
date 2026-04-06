const { db } = require('../config/firebaseConfig');

class TaskService {
  async createTask(taskData) {
    const docRef = await db.collection('tasks').add({
      ...taskData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...taskData };
  }

  async getAllTasks() {
    const snapshot = await db.collection('tasks').get();
    const tasks = [];
    snapshot.forEach(doc => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return tasks;
  }

  async updateTask(taskId, updateData) {
    const taskRef = db.collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();
    if (!taskDoc.exists) {
      throw new Error('Task bulunamadı.');
    }
    await taskRef.update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return { id: taskId, ...updateData };
  }

  async getWorkloadByUserId(userId) {
    // Sadece tamamlanmamış (done olmayan) tasklerin workload'unu hesaplamak daha mantıklıdır.
    const snapshot = await db.collection('tasks')
      .where('assignedTo', '==', userId)
      .where('status', '!=', 'done')
      .get();

    let totalWorkload = 0;
    snapshot.forEach(doc => {
      totalWorkload += parseFloat(doc.data().estimatedHours || 0);
    });

    return { userId, totalEstimatedHours: totalWorkload };
  }
}

module.exports = new TaskService();
