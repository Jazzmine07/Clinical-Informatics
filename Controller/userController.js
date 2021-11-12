const firebase = require('../firebase');
const bodyParser = require('body-parser');
const urlencoder = bodyParser.urlencoded({
  extended: false
})

exports.login = function(req, res){
  var email = req.body.email;
  var pass = req.body.password;

  console.log("email: " + email);
  console.log("password: " + pass);

  var database = firebase.database();
  var userRef = database.ref("user");

  // create user with email and password in firebase authentication (wont reflect sa real time database)
  // firebase.auth().createUserWithEmailAndPassword(email, pass) 
  // .then((userCredential) => {
  //   console.log("user " + userCredential.user);
  //   // Update user with first name and last name
  //   var update = {
  //     email: userCredential.user.email,
  //     firstName: "Dr. Joseph",
  //     lastName: "Ayo"
  //   }
  //   database.ref('user/' + userCredential.user.uid); // setting the path with uid as its pk
  //   database.ref('user/' + userCredential.user.uid).set(update); // adding fields such as email, firstname and lastname
  // })
  // .catch((error) => {
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   console.log("error");
  //   console.log(errorCode);
  //   console.log(errorMessage);
  // });

  // user sign in
  firebase.auth().signInWithEmailAndPassword(email, pass)
  .then((userCredential) => {

    //How to get specific field
    var query = userRef.child(userCredential.user.uid);
    query.on('value', (snapshot) => {
      console.log("result:");
      console.log(snapshot.val());

      console.log("email: " + snapshot.child('email').val());
      console.log("firstName: " + snapshot.child('firstName').val());
      console.log("lastName: " + snapshot.child('lastName').val());

      var user = {
        email: snapshot.child('email').val(),
        firstName: snapshot.child('firstName').val(),
        lastName: snapshot.child('lastName').val()
      }

      res.render('index');
      
      //res(user);
      // var pk = snapshot;
      // console.log("is dis the key? " + pk);

      // if(snapshot.key.child("email")){
      //     console.log("email?: ");
      //     console.log(snapshot.val());
      // }
    })
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode === 'auth/wrong-password') {
      res.render('login',{
        error: true,
        error_msg: "Wrong password!"
      });
    } 
    else if (errorCode === 'auth/invalid-email') {
      res.render('login',{
        error: true,
        error_msg: "Please enter a valid email!"
      });
    } 
    else if (errorCode === 'auth/user-not-found') {
      res.render('login',{
        error: true,
        error_msg: "No user with such email!"
      });
    } 
    else if (errorCode === 'auth/user-disabled') {
      res.render('login',{
        error: true,
        error_msg: "Account disabled by Admin!"
      });
    }
    else {  // in the case of multiple login failed attempts
      res.render('login',{
        error: true,
        error_msg: errorMessage 
      });
    }
  });

  

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