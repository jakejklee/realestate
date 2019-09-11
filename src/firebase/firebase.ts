import firebase from 'firebase';

  // Initialize Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyANhCXn9dRilPCh8Damk2FvNKHjhpC39Rw",
    authDomain: "eeum-home.firebaseapp.com",
    databaseURL: "https://eeum-home.firebaseio.com",
    projectId: "eeum-home",
    storageBucket: "eeum-home.appspot.com",
    messagingSenderId: "155851174099",
    appId: "1:155851174099:web:512ac758c3dbd059"
  };
  firebase.initializeApp(firebaseConfig);

  export default firebase;