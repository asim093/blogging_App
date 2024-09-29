import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAQXlnmkRquT5N14aB47rjM1DU_cxa0eDw",
  authDomain: "bloggingapp-8ded8.firebaseapp.com",
  projectId: "bloggingapp-8ded8",
  storageBucket: "bloggingapp-8ded8.appspot.com",
  messagingSenderId: "994117349513",
  appId: "1:994117349513:web:b79721c5e77677a4181658",
  measurementId: "G-R6JXNHSQ4Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app }