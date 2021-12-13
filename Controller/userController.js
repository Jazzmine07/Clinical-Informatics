const firebase = require('../firebase');
const bodyParser = require('body-parser');
const urlencoder = bodyParser.urlencoded({
  extended: false
})

exports.login = (req, res) => {
  var email = req.body.email;
  var pass = req.body.password;
  var database = firebase.database();
  var userRef = database.ref("clinicUsers");
  var parentsRef = database.ref("medicineList");
  var userInfo;

  // var studentAccount = {
  //   medicineName: 'chloe_torres@gmail.com'
  // }

  //parentsRef.push(studentAccount);
  //database.ref('parentUsers/' + studentAccount.idNum); // setting the path with id number as its pk
  //database.ref('parentUsers/' + studentAccount.idNum).set(studentAccount); // adding other fields

  // var parentInfo = {
  //   motherName: 'Chloe Torres',
  //   motherEmail: 'chloe_torres@gmail.com',
  //   motherContact: "",
  //   fatherName: 'Antonio Torres',
  //   fatherEmail: 'antonio_torres@gmail.com',
  //   fatherContact: "",
  //   guardianName: 'Chloe Torres',
  //   guardianEmail: 'chloe_torres@gmail.com',
  //   guardianContact: "",
  //   children: {
  //     0: "275755",
  //     1: "138088"
  //   }
  // }

  // database.ref('parentInfo/-Mp5kNza9yViFuMTFT02'); // setting the path with id number as its pk
  // database.ref('parentInfo/-Mp5kNza9yViFuMTFT02').set(parentInfo); // adding other fields

  // var personalInfo = {
  //   firstName: 'Ava',
  //   middleName: 'Lopez',
  //   lastName: 'Torres',
  //   studentType: 'old',
  //   grade: '1',
  //   section: 'truthfulness',
  //   birthday: '2014-12-29', // yyyy-mm-dd
  //   age: '7',
  //   sex: 'Female',
  //   address: 'Metro Manila',
  //   motherName: 'Chloe Torres',
  //   motherEmail: 'chloe_torres@gmail.com',
  //   fatherName: 'Antonio Torres',
  //   fatherEmail: 'antonio_torres@gmail.com',
  //   guardianName: 'Chloe Torres',
  //   guardianEmail: 'chloe_torres@gmail.com',
  // }
  // database.ref('studentInfo/' + studentAccount.idNum); // setting the path with id number as its pk
  // database.ref('studentInfo/' + studentAccount.idNum).set(personalInfo); // adding other fields

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
    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      // ------------------------------------DONT FORGET TO UNCOMMENT-------------------------------------------
      var uid = userCredential.user.uid;
      var childRef = database.ref("clinicUsers/"+uid);
      
      childRef.on('value', (snapshot) => { 
        if(snapshot.child('role').val() == "Clinician"){
          res.redirect("/dashboard");
        } else {
          res.redirect("/clinic-visit");
        }
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
}

// check if user is logged in 
exports.loggedIn = (req, res, next) => {
  var promise = new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) { // user is signed in 
        next()
      } else {
        res.render('login',{
          error: true,
          error_msg: "Please log in!"
        });
      }
    });
  });
  return promise;
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

// This function gets the user's details
exports.getUser = function(){
  var database = firebase.database();
  var userInfo;
  
  var promise = new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        var userRef = database.ref("clinicUsers/"+uid);
        
        userRef.on('value', (snapshot) => { 
          userInfo = ({
            key: snapshot.key,
            firstName: snapshot.child('firstName').val(),
            lastName: snapshot.child('lastName').val(),
            role: snapshot.child('role').val()
          })      
          resolve(userInfo); 
        })
      }
      // else{
      //   reject(Error("Why? :'("))
      // }
    });
  })
  return promise;

  //  await firebase.auth().onAuthStateChanged(async (user) => {
  //   if (user) {
  //     var uid = user.uid;
  //     var userRef = database.ref("clinicUsers/"+uid);
      
      
  //     await userRef.on('value', (snapshot) => { 
  //       userInfo = ({
  //         key: snapshot.key,
  //         firstName: snapshot.child('firstName').val(),
  //         lastName: snapshot.child('lastName').val(),
  //         role: snapshot.child('role').val()
  //       })      
  //       console.log("userInfo sa controller");      
  //       console.log(userInfo);
  //       return userInfo; // the initial repsonse
  //     })
  //   }
  // });
}

// This function gets all the clinic users
exports.getUsers = function(){
  var database = firebase.database();
  var clinicUsers = database.ref('clinicUsers');
  var usersObject = [];
  var key, childSnapshotData;

  var promise = new Promise((resolve,reject)=>{
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
          lastName: childSnapshotData.lastName,
        })
      })
      resolve(usersObject);
    })
  })
  return promise;
}

// This function is to get all users with nurse role
exports.getNurse = function(){
  var database = firebase.database();
  var clinicUsers = database.ref();
  var usersObject = [];
  var key, childSnapshotData;

  var promise = new Promise((resolve,reject)=>{
    clinicUsers.child("clinicUsers").orderByChild("role").equalTo("Nurse").on('value', (snapshot) => {
      snapshot.forEach(function(childSnapshot){
        key = childSnapshot.key;                        // Getting primary keys of users
        childSnapshotData = childSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
        usersObject.push({
          key: key,
          firstName: childSnapshotData.firstName,
          lastName: childSnapshotData.lastName,
        })
      })
      resolve(usersObject);
    })
  })

  return promise;
}

// This function is to get all users with clinician role
exports.getClinician = function(){
  var database = firebase.database();
  var clinicUsers = database.ref();
  var usersObject = [];
  var key, childSnapshotData;

  var promise = new Promise((resolve,reject)=>{
    clinicUsers.child("clinicUsers").orderByChild("role").equalTo("Clinician").on('value', (snapshot) => {
      snapshot.forEach(function(childSnapshot){
        key = childSnapshot.key;                        // Getting primary keys of users
        childSnapshotData = childSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
        usersObject.push({
          key: key,
          firstName: childSnapshotData.firstName,
          lastName: childSnapshotData.lastName,
        })
      })
      resolve(usersObject);
    })  
  })

  return promise;
}

// This function is to get all users except the current user's
exports.assignTo = function(req){
  var user = req;
  var database = firebase.database();
  var clinicUsers = database.ref('clinicUsers');
  var usersObject = [];
  var key, childSnapshotData;

  var promise= new Promise((resolve, reject)=>{
    clinicUsers.on('value', (snapshot) => {
      snapshot.forEach(function(childSnapshot){
        key = childSnapshot.key;                        // Getting primary keys of users
        childSnapshotData = childSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
        if(user != key){
          usersObject.push({
            key: key,
            firstName: childSnapshotData.firstName,
            lastName: childSnapshotData.lastName,
          })
        }
      })
      resolve(usersObject);
    })
  })
  return promise;
}