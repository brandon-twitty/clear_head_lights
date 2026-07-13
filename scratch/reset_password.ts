import { adminAuth } from '../src/lib/firebaseAdmin';

adminAuth.generatePasswordResetLink('clearheadlightsforless@gmail.com')
  .then((link) => {
    console.log('Password reset link:', link);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error generating link:', error);
    process.exit(1);
  });
