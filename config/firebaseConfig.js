const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

// serviceAccountKey.json dosyasının yolunu belirtiyoruz
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = getFirestore();

console.log('Firebase Admin SDK initialized successfully.');

module.exports = { admin, db };
