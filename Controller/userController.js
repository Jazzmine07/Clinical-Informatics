const mongoose = require('mongoose');
const memberModel = require('../models/member');
const roleModel = require('../models/role');

const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
// const moment = require('moment');
// const saltRounds = 10;
const bodyParser = require('body-parser')
const urlencoder = bodyParser.urlencoded({
  extended: false
})
var formidable = require('formidable');
var fs = require('fs');
const e = require('express');



exports.loginUser = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const {
        validationUsername,
        validationPassword
      } = req.body;
  
      var sql= "SELECT email, password";
      db.query(sql, function(err, results){
        if(results.length){
          req.session.email = results[0].email;
          req.session.role = results[0].role;
          console.log(results[0].email);
          if(req.session.role == "Registrar"){
            res.redirect('/registrar_home');
          }
          else if(req.session.role == "Clinician"){
            res.redirect('/clinician_home');
          }
          else{
            res.redirect('/login');
          }
        }
      });


      // userModel.getUser({username: validationUsername}, (err, User) => {
       
      //   if (err) {
      //     // Database error occurred...
      //     req.flash('error_msg', 'ERROR occurred in db! Please try again.');
      //     res.redirect('/login');
      //   } else {
  
      //     // Successful query
      //     if (User) {
      //      // console.log(User);
      //     //  console.log("Successfully found user!");
      //       if (User.role == 'Registrar' ){
      //         req.session.isRegistrar = true;
      //       } else{
      //           req.session.isRegistrar = false;
      //       }

      //       if (User.role== 'Clinician' ){
      //           req.session.isClinician = true;
      //       } else{
      //           req.session.isClinician = false;
      //       }
  
   
      //       bcrypt.compare(validationPassword, User.password, (err, result) => {
  
      //       // Passwords match
      //         if (result) {
      //           req.session.User = User;
      //           req.session.role = User.role;
                
      //           if(isRegistrar){
      //               res.redirect('/registrar_home');
      //           }
      //           else if(isClinician){
      //               res.redirect('/clinician_home');
      //           }
      //          // console.log(req.session);
      //         } else {
      //           // passwords don't match
      //           req.flash('error_msg', 'Incorrect password. Please try again.');
      //           res.redirect('/login');
      //         }
      //       });
  
      //     } else {
      //       // passwords don't match
      //       req.flash('error_msg', 'No user found. Please try again.');
      //       res.redirect('/login');
      //     }
      //   }
      // });
  
    } else {
      const messages = errors.array().map((item) => item.msg);
  
      req.flash('error_msg', messages.join(' '));
      res.redirect('/login');
    }
  
  };