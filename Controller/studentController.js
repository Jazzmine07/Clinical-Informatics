const firebase = require('../firebase');
const bodyParser = require('body-parser');

var TAG = "studentController.js";

exports.getStudent = function(req, res){
    var id = req.body.studentVisit;
    var database = firebase.database();
    var studentRef = database.ref("studentInfo/"+ id);
    var studentInfo;

    studentRef.on('value', (snapshot) => {
        if(snapshot.exists()){
            console.log("test "+ snapshot.child('motherName').val());
            console.log("test "+ snapshot.child('motherEmail').val());
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
            res.send(studentInfo);
        } else {
            console.log("check if dadaan dito?");
            res.send({
                error: true,
                error_msg: "No student with that id number!"
            })
        }
    })
}

exports.addClinicVisit = function(req, res){
    var id = req.body.studentID;
    var visitDate = req.body.visitDate;
    var timeIn = req.body.clinicIn;
    var timeOut = req.body.clinicOut;
    var clinician = req.body.clinicianVisit;
    var complaint = req.body.complaintVisit;
    var treatment = req.body.treatmentVisit;
    var notes = req.body.notes;
    var status = req.body.status;
    var medication = req.body.medicationVisit;
    var diagnosis = req.body.diagnosis; //ned to add
    var symptoms = req.body.symptoms;// need to add

    res.send(req.body);
    console.log(TAG, "id: "+ req.body.studentID);
    console.log(TAG, "Body: " + req.body.treatmentVisit);

    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    


    var record ={
        attendingClinician:String(clinician),
        notes: String(notes),
        sIdNum: String(id),
        status: String(status),
        timeIn: String(timeIn),
        timeout: String(timeOut),
        visitDate: String(visitDate),
        visitReason: String(complaint),
        treatment: String(treatment),
        //diagnosis: String(diagnosis),
        //medication:medication,
        // symptoms: symptoms
    };


    clinicVisitRef.push().set(Object.values(record));



}