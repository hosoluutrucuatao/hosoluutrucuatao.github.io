import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  doc,
  getDoc,
  setLogLevel
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Silence noisy WebChannel timeout warnings and auto-detect long polling for iframe/proxy resilience
setLogLevel('silent');

// CRITICAL: Specify firestoreDatabaseId and enable auto long-polling for reliable connection
export const db = initializeFirestore(
  app,
  {
    experimentalAutoDetectLongPolling: true
  },
  firebaseConfig.firestoreDatabaseId
);

export const auth = getAuth(app);

export async function testConnection(): Promise<boolean> {
  try {
    await getDoc(doc(db, 'settings', 'general'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return false;
    }
    return true;
  }
}
