const firebase = require('../firebase');
const bodyParser = require('body-parser');
const urlencoder = bodyParser.urlencoded({
  extended: false
})

exports.login = (req, res) => {
  var email = req.body.email;
  var pass = req.body.password;
  var database = firebase.database();
  var parentsRef = database.ref("parentUsers");
  var userInfo;

  // var parentAccount = {
  //   email: 'greta_flores@gmail.com',
  //   password: 'manresa123'
  // }

  // var key = parentsRef.push(parentAccount).key;

  // var parentInfo = {
  //   children: {
  //     0: "2016061",
  //     1: "2021010"
  //   },
  //   email: parentAccount.email
  // }
  // database.ref('parentInfo/'+key).set(parentInfo);
    
  // var personalInfo = {
  //   firstName: 'Tauro Bailey',
  //   middleName: 'Sison',
  //   lastName: 'Bituin',
  //   studentType: 'Old',
  //   grade: '6',
  //   section: 'Abnegation',
  //   birthday: '2010-08-13', // yyyy-mm-dd
  //   age: '11',
  //   sex: 'Male',
  //   address: 'Evacom Building 1700',
  //   motherName: 'Estelle Bituin',
  //   motherEmail: 'estelle_bituin@gmail.com',
  //   motherContact: '09778947521',
  //   fatherName: 'Paolo Bituin',
  //   fatherEmail: 'paolo_bituin@gmail.com',
  //   fatherContact: '09668741257',
  //   guardianName: 'Jose Malinaw',
  //   guardianEmail: 'jose_malinaw@gmail.com',
  //   guardianContact: '09174521523',
  //   hasSpecialNeeds: "No",
  //   nationality: "Filipino",
  //   religion: "Roman Catholic",

  // }
    
  // var personalInfo2 = {
  //   firstName: 'Peyton Jaheim',
  //   middleName: 'Maniri',
  //   lastName: 'Abayan',
  //   studentType: 'Old',
  //   grade: '6',
  //   section: 'Abnegation',
  //   birthday: '2010-06-14', // yyyy-mm-dd
  //   age: '11',
  //   sex: 'Female',
  //   address: 'Presidents Avenue, BF Homes',
  //   motherName: 'Sasha Abayan',
  //   motherEmail: 'sasha_abayan@gmail.com',
  //   motherContact: '09478965897',
  //   fatherName: 'Steven Abayan',
  //   fatherEmail: 'steven_abayan@gmail.com',
  //   fatherContact: '09669863529',
  //   guardianName: 'Steven Abayan',
  //   guardianEmail: 'steven_abayan@gmail.com',
  //   guardianContact: '09669863529',
  //   hasSpecialNeeds: "No",
  //   nationality: "Filipino",
  //   religion: "Roman Catholic",

  // }
  // //database.ref('studentInfo/' + studentAccount.idNum); // setting the path with id number as its pk
  // database.ref('studentInfo/' + 2016006).set(personalInfo); // adding other fields
  // database.ref('studentInfo/' + 2016007).set(personalInfo2);
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
      
      childRef.once('value', (snapshot) => { 
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
    // var clinicUsersRef = database.ref("clinicUsers");
    // clinicUsersRef.orderByChild("email").equalTo(email).once('value', (snapshot) => {
    //   if(snapshot.exists()){
    //     snapshot.forEach(function(userSnapshot){
    //       var user = userSnapshot.exportVal();
    //       console.log(user);
    //       if(user.password == pass){
    //         res.cookie('user', JSON.stringify({
    //           key: userSnapshot.key,
    //           firstName: user.firstName,
    //           lastName: user.lastName,
    //           role: user.role
    //         }));
    //         if(user.role == "Clinician"){
    //           res.redirect("/dashboard");
    //         } else {
    //           res.redirect("/clinic-visit");
    //         }
    //       } else {
    //         res.render('login', {
    //           error: true,
    //           error_msg: "Wrong password!"
    //         });
    //       }
    //     })
    //   } else {
    //     res.render('login', {
    //       error: true,
    //       error_msg: "No user with that email!"
    //     });
    //   }
    // })

      // io.on('connection', (socket) => {
      //   console.log('a user is connected');
      // });
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
    user = firebase.auth().currentUser;
    if(user !== null){
      var uid = user.uid;
      var userRef = database.ref("clinicUsers/"+uid);
      
      userRef.once('value', (snapshot) => { 
        userInfo = ({
          key: snapshot.key,
          firstName: snapshot.child('firstName').val(),
          lastName: snapshot.child('lastName').val(),
          role: snapshot.child('role').val()
        })      
        resolve(userInfo); 
      })
    }
  })
  return promise;
}

// This function gets all the clinic users
exports.getUsers = function(){
  var database = firebase.database();
  var clinicUsers = database.ref('clinicUsers');
  var usersObject = [];
  var key, childSnapshotData;

  var promise = new Promise((resolve,  reject)=>{
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

  var promise = new Promise((resolve, reject)=>{
    clinicUsers.child("clinicUsers").orderByChild("role").equalTo("Nurse").on('value', (snapshot) => {
      snapshot.forEach(function(childSnapshot){
        key = childSnapshot.key;                        
        childSnapshotData = childSnapshot.exportVal(); 
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

  var promise = new Promise((resolve, reject)=>{
    clinicUsers.child("clinicUsers").orderByChild("role").equalTo("Clinician").on('value', (snapshot) => {
      snapshot.forEach(function(childSnapshot){
        key = childSnapshot.key;                        
        childSnapshotData = childSnapshot.exportVal();
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
        key = childSnapshot.key;                        
        childSnapshotData = childSnapshot.exportVal();
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

// This function is to get all doctors and current nurse
exports.getPrescribedBy = function(req){
  var user = req;
  var database = firebase.database();
  var clinicUsers = database.ref();
  var usersObject = [], temp = [];
  var key, childSnapshotData;

  var promise = new Promise((resolve, reject) => {
    clinicUsers.child("clinicUsers").orderByChild("role").equalTo("Clinician").on('value', (snapshot) => {
      snapshot.forEach(function(childSnapshot){
        key = childSnapshot.key;                        
        childSnapshotData = childSnapshot.exportVal();
        usersObject.push({
          key: key,
          firstName: childSnapshotData.firstName,
          lastName: childSnapshotData.lastName,
        })
      })
    }) 

    clinicUsers.child("clinicUsers").on('value', (snapshot) => {
      snapshot.forEach(function(childSnapshot){
        key = childSnapshot.key;                        
        childSnapshotData = childSnapshot.exportVal(); 
        if(user == key){
          usersObject.push({
            key: key,
            firstName: childSnapshotData.firstName,
            lastName: childSnapshotData.lastName,
          })
        }
      })
    })

    resolve(usersObject);
  })

  return promise;
}