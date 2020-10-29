import firebase from 'firebase';

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBt7KJBx6egkk1i9zImboiSGD3ZggAUhx0",
  authDomain: "real-estate-eaa79.firebaseapp.com",
  databaseURL: "https://real-estate-eaa79.firebaseio.com",
  projectId: "real-estate-eaa79",
  storageBucket: "",
  messagingSenderId: "59286563581",
  appId: "1:59286563581:web:f1a71bdc766e765c79ec94"
};
firebase.initializeApp(firebaseConfig);

export default firebase;