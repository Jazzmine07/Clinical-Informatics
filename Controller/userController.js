//const connection = require('../database');
const database = require('../firebase');
const { get, onValue, push, ref, set, } = require("firebase/database");
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
  // push = with unique id
  // set = no unique id
  // push(userRef, {
  //   email: email,
  //   pass: pass,
  // })
  // .then((snapchat) => {
  //   console.log("data is added!");
  //   var key = snapchat.key;
  //   console.log("is dis the key? " + key);
  // })
  // .catch((error) =>{
  //   console.log("error");
  //   console.log(error);
  // })

  //Retrieving data (entire object)
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

  // getting table userRef = user
  onValue(userRef, (snapshot) => {
    console.log("onValue:");
    console.log(snapshot.val());
    if(snapchat.childSnapshot("email")){
      console.log("email?:");
      console.log(snapshot.val());
    }
  })

  onValue(userRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      console.log("childata " + childData);
    });
  })
}