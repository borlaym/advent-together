import * as admin from 'firebase-admin';
console.log('hello')
console.log(process.env)

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG || '')),
  databaseURL: 'https://advent-together-default-rtdb.europe-west1.firebasedatabase.app'
});

export default admin.database();