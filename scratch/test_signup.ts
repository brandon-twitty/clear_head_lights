import { adminDb } from '../src/lib/firebaseAdmin';

async function testSignup() {
  try {
    const leadRef = await adminDb.collection('leads').add({
      dealership: 'Test Dealership',
      email: 'test@dealership.com',
      name: 'Test Dealer',
      status: 'new'
    });
    console.log('Created lead:', leadRef.id);
  } catch(e) {
    console.error('Error:', e);
  }
}
testSignup();
