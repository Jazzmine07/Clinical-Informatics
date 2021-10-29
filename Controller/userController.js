//const connection = require('../database');
const database = require('../firebase');
const { get, onValue, ref, set } = require("firebase/database");
const bodyParser = require('body-parser');
const urlencoder = bodyParser.urlencoded({
  extended: false
})

exports.login = function(req, res){
  var email = req.body.email;
  var pass = req.body.password;

  console.log("email: " + email);
  console.log("password: " + pass);
  console.log("database: " + database);

  var userRef = ref(database, 'user/');
  console.log("ref: " + userRef);

  // Adding data
  set(userRef, {
    email: email,
    firstName: "Sofie",
    lastName: "Cuevas",
    pass: pass,
  })
  .then(() => {
    console.log("did it work??");
  })
  .catch((error) =>{
    console.log("error");
    console.log(error);
  })

  // Retrieving data
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.log("Data:");
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.log("Error");
    console.error(error);
  });
};