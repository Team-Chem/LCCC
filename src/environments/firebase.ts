import { environment } from "./environment";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firebase
export const app = initializeApp(environment.firebase);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);