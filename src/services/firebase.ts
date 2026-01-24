import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "여기에_본인_APIKEY",
  authDomain: "여기에_본인_authDomain",
  projectId: "여기에_본인_projectId",
  storageBucket: "여기에_본인_storageBucket",
  messagingSenderId: "여기에_본인_messagingSenderId",
  appId: "여기에_본인_appId",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
