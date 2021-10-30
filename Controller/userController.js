//const connection = require('../database');
const database = require('../firebase');
const bodyParser = require('body-parser');
const urlencoder = bodyParser.urlencoded({
  extended: false
})

exports.login = function(req, res){
  var email = req.body.email;
  var pass = req.body.password;

  console.log("email: " + email);
  console.log("password: " + pass);

  var userRef = database.ref("user");
  console.log("ref: " + userRef);

  userRef.push({
    email: email,
    pass: pass,
  })
  .then((snapchat) => {
    console.log("data is added!");
    var key = snapchat.key;
    console.log("is dis the key? " + key);
  })
  .catch((error) =>{
    console.log("error");
    console.log(error);
  })

  var query = userRef.orderByChild("email").equalTo(email);

  query.on('value', (snapshot) => {
    console.log("onValue:");
    console.log(snapshot.val());
    // if(snapchat.childSnapshot("email")){
    //     console.log("email?:");
    //     console.log(snapshot.val());
    // }
  })

  //Retrieving data (entire object)
  // get(userRef).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     console.log("Data:");
  //     console.log(snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.log("Error");
  //   console.error(error);
  // });

  //getting table userRef = user
  // var childRef = child(userRef);
  // console.log("child " + childRef);
  // onValue(child, (snapshot) => {
  //   console.log("onValue:");
  //   console.log(snapshot.val());
  //   if(snapchat.childSnapshot("email")){
  //     console.log("email?:");
  //     console.log(snapshot.val());
  //   }
  // })

  // onValue(userRef, (snapshot) => {
  //   snapshot.forEach((childSnapshot) => {
  //     const childData = childSnapshot.val();
  //     console.log("childata " + childData);
  //   });
  // })
}