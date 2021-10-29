// const firebase = require('firebase-admin');
// const { database } = require('firebase-admin');
// const { initializeApp } = require('firebase-admin/app');

const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");   // realtime databse

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
const app = initializeApp(firebaseConfig);
//const app = firebase.initializeApp(firebaseConfig);
//console.log(app);
const db = getDatabase(app);
console.log("database in firebase.js " + db);
module.exports = db;
