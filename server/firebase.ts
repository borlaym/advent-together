import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)),
  databaseURL: 'https://advent-together.firebaseapp.com/'
});

export default admin.database();