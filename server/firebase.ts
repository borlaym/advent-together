import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG || '')),
  databaseURL: 'https://advent-together-default-rtdb.europe-west1.firebasedatabase.app'
});

export default admin.database();