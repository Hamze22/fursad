import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBCqqBMEje7_M7ZB3v-s_Jaf-Tz1HafiJo",
  authDomain: "fursad-c833a.firebaseapp.com",
  projectId: "fursad-c833a",
  storageBucket: "fursad-c833a.firebasestorage.app",
  messagingSenderId: "848795564218",
  appId: "1:848795564218:web:c7bd96371b3be4da816a83",
  measurementId: "G-SQ1SDCR70Z"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

