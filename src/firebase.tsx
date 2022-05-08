import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZ9PTtI0X_vP17nMaIa-K2kJm8uaEQ-KM",
  authDomain: "foodaddtech.firebaseapp.com",
  projectId: "foodaddtech",
  storageBucket: "foodaddtech.appspot.com",
  messagingSenderId: "984989408354",
  appId: "1:984989408354:web:35f48782daf52299dac53b",
  measurementId: "G-YCLPFQNRH5",
  databaseURL: "https://foodaddtech-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);

export default firebase;