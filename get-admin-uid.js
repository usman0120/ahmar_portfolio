import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA6Ptt_sxiydIZwH0TZvGJgbdJJP_3ci0Q",
  authDomain: "ahmar-portfolio.firebaseapp.com",
  projectId: "ahmar-portfolio",
  storageBucket: "ahmar-portfolio.firebasestorage.app",
  messagingSenderId: "745137997812",
  appId: "1:745137997812:web:ebd0d7837efa334106dba1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const createAndGetAdmin = async () => {
  try {
    // Try to create admin user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@ahmar.com', 
      'password123'
    );
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', userCredential.user.email);
    console.log('🔑 UID:', userCredential.user.uid);
    console.log('📋 Copy this UID to your Firestore rules:');
    console.log('   "' + userCredential.user.uid + '"');
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  Admin user already exists, trying to login...');
      
      // If user exists, try to login to get UID
      const loginCredential = await signInWithEmailAndPassword(
        auth,
        '2006ahmarsaleem@gmail.com',
        'ahmar0027'
      );
      console.log('✅ Login successful!');
      console.log('📧 Email:', loginCredential.user.email);
      console.log('🔑 UID:', loginCredential.user.uid);
      console.log('📋 Copy this UID to your Firestore rules:');
      console.log('   "' + loginCredential.user.uid + '"');
      
      // Sign out after getting UID
      await auth.signOut();
    } else {
      console.error('❌ Error:', error.message);
    }
  }
};

createAndGetAdmin();