const firebase = require('../firebase');
const bodyParser = require('body-parser');
const urlencoder = bodyParser.urlencoded({
  extended: false
})

exports.login = function(req, res){
  var email = req.body.email;
  var pass = req.body.password;
  var database = firebase.database();
  var userRef = database.ref("clinicUsers");

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

  //---------------------------------------------DONT FORGET TO UNCOMMENT--------------------------------------
  if(email == "" && pass == ""){
    res.render('login',{
      error: true,
      error_msg: "Please enter data!"
    });
  }
  if(email == ""){
    res.render('login',{
      error: true,
      error_msg: "Please enter email!"
    });
  }
  if(pass == ""){
    res.render('login',{
      error: true,
      error_msg: "Please enter password!"
    });
  }
  else {
    //user sign in
    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      // How to get specific field and pk
      // ------------------------------------DONT FORGET TO UNCOMMENT-------------------------------------------
      userRef.on('value', (snapshot) => {
        if(snapshot.hasChild(userCredential.user.uid) == false){  // checker if user is in the user tables
          //add user to the realtime database
          var update = {
            email: userCredential.user.email,
            firstName: "",
            lastName: "",
            role: ""
          }
          database.ref('clinicUsers/' + userCredential.user.uid); // setting the path with uid as its pk
          database.ref('clinicUsers/' + userCredential.user.uid).set(update); // adding fields such as email, firstname and lastname 
        }
      })

      res.redirect('/dashboard');
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
}

// check if user is logged in 
exports.loggedIn = (req, res, next) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) { // user is signed in 
      return next()
    } else {
      res.render('login',{
        error: true,
        error_msg: "Please log in!"
      });
    }
  });
};

exports.logout = (req, res) => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    res.redirect('/login');
  }).catch((error) => {
    // An error happened.
    res.render('login',{
      error: true,
      error_msg: error.message
    });
  });
};


exports.getUser = function(req, res){
  var database = firebase.database();

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var uid = user.uid;
      var userRef = database.ref("users/"+uid);
      var userInfo;
      
      userRef.on('value', (snapshot) => { 
        console.log("pease? " + snapshot.child('firstName').val());
        if(snapshot.child('firstName').val() === ""){
          userInfo = ({
            firstName: "user",
            lastName: "",
            role: ""
          })
        } else {
          userInfo = ({
            firstName: snapshot.child('firstName').val(),
            //lastName: snapshot.child(uid).child('lastName').val(),
            //role: snapshot.child(uid).child('role').val()
          })
        }
      })
      res(userInfo);
    }
  });
}

exports.getUsers = function(req, res){
  var database = firebase.database();
  var clinicUsers = database.ref('clinicUsers');
  var usersObject = [];
  var key, childSnapshotData;

  clinicUsers.on('value', (snapshot) => {
    snapshot.forEach(function(childSnapshot){
      key = childSnapshot.key;                        // Getting primary keys of users
      childSnapshotData = childSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
      //console.log("key "+ key);
      //console.log("childSnapshotData firstName "+childSnapshotData.firstName);
      //console.log("childSnapshotData lastName "+childSnapshotData.lastName);

      usersObject.push({
        key: key,
        firstName: childSnapshotData.firstName,
        lastName: childSnapshotData.lastName
      })
    })
    res(usersObject);
  })
}