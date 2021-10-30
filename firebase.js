const firebase = require('firebase');                   

const firebaseConfig = {
    apiKey: "AIzaSyDI-FxXAgROiDQ5nh3IgjlUgH2GHGRZp2g",
    authDomain: "clinical-informatics-manresa.firebaseapp.com",
    databaseURL: "https://clinical-informatics-manresa-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "clinical-informatics-manresa",
    storageBucket: "clinical-informatics-manresa.appspot.com",
    messagingSenderId: "683224252670",
    appId: "1:683224252670:web:b72ced2ccf361262f765af",
    measurementId: "G-FXGGCJX9G6"
};

// Initialize firebase
const app = firebase.initializeApp(firebaseConfig); 

module.exports = app;
