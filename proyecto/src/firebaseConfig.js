import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
apiKey: "AIzaSyD6zijD3aIZA_ttDTXnBw8cVyTAalmBXBg",
  authDomain: "digiapp-v2.firebaseapp.com",
  projectId: "digiapp-v2",
  storageBucket: "digiapp-v2.firebasestorage.app",
  messagingSenderId: "1039584771220",
  appId: "1:1039584771220:web:b8cb60c27436e91407c881",
  measurementId: "G-V20N4K0X9B"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app); // ✅ ¡Esto es necesario!
export { auth, db };