const firebase = require('../firebase');
const bodyParser = require('body-parser');

exports.getStudent = function(req, res){
    var id = req.body.studentVisit;
    var database = firebase.database();
    var studentRef = database.ref("studentInfo/"+ id);
    var studentInfo;

    console.log("id: "+id);
    studentRef.on('value', (snapshot) => {
        if(snapshot.exists()){
            console.log("test "+ snapshot.child('firstName').val());
            console.log("test "+ snapshot.child('middleName').val());
            console.log("test "+ snapshot.child('lastName').val());
            console.log("test "+ snapshot.child('birthday').val());
            console.log("test "+ snapshot.child('age').val());
            console.log("test "+ snapshot.child('sex').val());
            console.log("test "+ snapshot.child('address').val());
            studentInfo = {
                firstName: snapshot.child('firstName').val(),
                middleName: snapshot.child('middleName').val(),
                lastName: snapshot.child('lastName').val(),
                birthday: snapshot.child('birthday').val(),
                //nationailty: snapshot.child('nationality').val(),
                age: snapshot.child('age').val(),
                sex: snapshot.child('sex').val(),
                address: snapshot.child('address').val()
            }
            
        }
    })    
}