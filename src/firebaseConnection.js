import { initializeApp} from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD16nPyMdUdTgSALDEnRxLeWjL0d95xgRk",
  authDomain: "my-curso.firebaseapp.com",
  projectId: "my-curso",
  storageBucket: "my-curso.appspot.com",
  messagingSenderId: "1060611067282",
  appId: "1:1060611067282:web:6dc19e6e1b178c27cc854b",
  measurementId: "G-RXF7TXFP01"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export { db, auth };