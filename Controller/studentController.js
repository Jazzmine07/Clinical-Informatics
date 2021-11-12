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
                grade: snapshot.child('grade').val(),
                section: snapshot.child('section').val(),
                studentType: snapshot.child('studentType').val(),
                birthday: snapshot.child('birthday').val(),
                //nationailty: snapshot.child('nationality').val(),
                //religion: snapshot.child('religion').val(),
                age: snapshot.child('age').val(),
                sex: snapshot.child('sex').val(),
                address: snapshot.child('address').val(),
                fatherName: snapshot.child('fatherName').val(),
                fatherEmail: snapshot.child('fatherEmail').val(),
                fatherContact: snapshot.child('fatherContact').val(),
                motherName: snapshot.child('motherName').val(),
                motherEmail: snapshot.child('motherEmail').val(),
                motherContact: snapshot.child('motherContact').val(),
            }
        } else {
            res.render('clinic-visit-create',{
                error: true,
                errorr_msg: "No student with that id number!"
            })
        }
    })
    res.send(studentInfo);
}

exports.addClinicVisit = function(req, res){
    var id = req.body.id;
    var name = req.body.studentName;
    var level = req.body.level;
    var grade = req.body.grade;
    var section = req.body.section;
}