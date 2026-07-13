import { adminDb } from '../src/lib/firebaseAdmin';

async function testGenerateInvite() {
  const leadId = 'mB6oH4fNl5W5T8L6S4F9';
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  try {
    const lead = {
      email: 'test@dealership.com',
      dealership: 'Test Dealership',
      name: 'Test Dealer',
      address: '',
      id: leadId
    };

    console.log('Setting invite...');
    await adminDb.collection("invites").doc(token).set({
      email: lead.email,
      dealership: lead.dealership,
      name: lead.name,
      address: lead.address || "",
      leadId: lead.id,
      createdAt: new Date().toISOString()
    });
    console.log('Invite set!');

    console.log('Updating lead...');
    await adminDb.collection("leads").doc(lead.id).update({ status: "contacted", invitedAt: new Date().toISOString() });
    console.log('Lead updated!');
    
    console.log('Token is:', token);
  } catch (error) {
    console.error("Error generating invite:", error);
  }
}

testGenerateInvite();
