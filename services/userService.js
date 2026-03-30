const { db } = require('../config/firebaseConfig');

class UserService {
  // Yeni kullanıcı oluşturma
  async createUser(userData) {
    const docRef = await db.collection('users').add({
      ...userData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...userData };
  }

  // Tüm kullanıcıları getirme
  async getAllUsers() {
    const snapshot = await db.collection('users').get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  }
}

module.exports = new UserService();
