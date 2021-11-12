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

  // var studentAccount = {
  //   idNum: '275755',
  //   password: 'manresa123',
  // }
  // database.ref('users/' + studentAccount.idNum); // setting the path with id number as its pk
  // database.ref('users/' + studentAccount.idNum).set(studentAccount); // adding other fields

  // var personalInfo = {
  //   idNum: '275755',
  //   firstName: 'Levi',
  //   middleName: 'Lopez',
  //   lastName: 'Torres',
  //   studentType: 'old',
  //   grade: '2',
  //   section: 'truthfulness',
  //   birthday: '2013-11-15', // yyyy-mm-dd
  //   age: '8',
  //   sex: 'Male',
  //   address: 'Metro Manila',
  //   motherName: 'Chloe Torres',
  //   motherEmail: 'chloe_torres@gmail.com',
  //   fatherName: 'Antonio Torres',
  //   fatherEmail: 'antonio_torres@gmail.com',
  //   guardianName: 'Chloe Torres',
  //   guardianEmail: 'chloe_torres@gmail.com',
  // }
  // database.ref('studentInfo/' + personalInfo.idNum); // setting the path with id number as its pk
  // database.ref('studentInfo/' + personalInfo.idNum).set(personalInfo); // adding other fields


  //create user with email and password in firebase authentication (wont reflect sa real time database)
  // firebase.auth().createUserWithEmailAndPassword(email, pass) 
  // .then((userCredential) => {
  //   console.log("user " + userCredential.user);
  //   // Update user with first name and last name
  //   var update = {
  //     email: userCredential.user.email,
  //     firstName: "Dr. Joseph",
  //     lastName: "Ayo"
  //   }
  //   database.ref('users/' + userCredential.user.uid); // setting the path with uid as its pk
  //   database.ref('users/' + userCredential.user.uid).set(update); // adding fields such as email, firstname and lastname
  // })
  // .catch((error) => {
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   console.log("error");
  //   console.log(errorCode);
  //   console.log(errorMessage);
  // });

  if(email == "" && pass == ""){
    res.render('login',{
      error: true,
      error_msg: "Please enter data!"
    });
  }
  else {
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
        
        //res(user);
        // var pk = snapshot;
        // console.log("is dis the key? " + pk);

        // if(snapshot.key.child("email")){
        //     console.log("email?: ");
        //     console.log(snapshot.val());
        // }

        res.redirect('/dashboard'); // redirect to dashboard page
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
  }

  

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