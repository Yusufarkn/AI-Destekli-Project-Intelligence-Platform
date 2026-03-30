const admin = require('firebase-admin');
const path = require('path');

// serviceAccountKey.json dosyasının yolunu belirtiyoruz
// Bu dosya Firebase Console -> Project Settings -> Service Accounts üzerinden indirilir
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log('Firebase Admin SDK initialized successfully.');

module.exports = { admin, db };
