import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbbrUpr1Sru_ay4Jh1eVSmoXdp_nG_6Lw",
  authDomain: "finance-track-e0e22.firebaseapp.com",
  projectId: "finance-track-e0e22",
  storageBucket: "finance-track-e0e22.appspot.com",
  messagingSenderId: "775013855619",
  appId: "1:775013855619:web:754a0f2f3a2cd883c146b6",
  measurementId: "G-Q2L1KY33XF",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
