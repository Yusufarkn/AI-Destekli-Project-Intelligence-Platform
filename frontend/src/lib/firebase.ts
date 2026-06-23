import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase yapılandırma bilgilerini buraya ekle
// NOT: Gerçek proje bilgilerini serviceAccountKey.json veya Firebase Console'dan al!
const firebaseConfig = {
  // Örnek yapılandırma - gerçek bilgileri Firebase Console'dan al
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
