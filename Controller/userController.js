const connection = require('../database');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const urlencoder = bodyParser.urlencoded({
  extended: false
})
// var formidable = require('formidable');
// var fs = require('fs');
console.log("Before Login");

exports.login = function (req,res){
  var session = req.session;
  var email= req.body.email;
  var pass= req.body.password;
  console.log("Entered Login");

  var sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  
  connection.query(sql, [email, pass], function(err, results) {
    if(err) throw err     
      // if user not found
      if (results.length <= 0) {
        //req.flash('error', 'Please correct enter email and Password!')
        connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, results) {
          if (results.length <= 0) {
            console.log("User Not Found")
          }
          else{
            console.log("Wrong Password")
            res.redirect('/login')
          }
        });
      }
      else { // if user found
        // render to views/user/edit.ejs template file
        // req.session.loggedin = true;
        // req.session.name = name; 
        console.log("Successfully Login")    
        
        if(results[0].role.toString() =="Registrar"){
          console.log(results);
          console.log("Is a Registrar");
          res.redirect('/login');
        }
        else if (results[0].role.toString() == "Clinician"){
          console.log("Is a Clinician");
          res.redirect('/login');
        }
      }            
  })
  

}; 

//Add 
// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "INSERT INTO user (id, first_name, las_name,role,email,password) VALUES ('Company Inc', 'Highway 37')";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//     });
// });
