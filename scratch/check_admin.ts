import { adminDb } from '../src/lib/firebaseAdmin';

async function checkAdmin() {
  const doc = await adminDb.collection('users').doc('m2g8RsVm1CQs3VrYVZt0yeAVZPJ2').get();
  console.log('Admin user doc:', doc.data());
}
checkAdmin();
