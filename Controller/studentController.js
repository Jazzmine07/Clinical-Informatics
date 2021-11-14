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
            res.send({
                error: true,
                error_msg: "No student with that id number!"
            })
        }
    })
}

exports.addClinicVisit = function(req, res){
    var id = req.body.studentId;
    var name = req.body.studentName;
    var visitDate = req.body.visitDate;
    var timestamp = req.body.timeStamp;
    var timeIn = req.body.timeIn;
    var timeOut = req.body.timeOut;
    var clinician = req.body.clinician;
    var complaint = req.body.complaint;
    var treatment = req.body.treatement;
    var notes = req.body.notes;
    var status = req.body.status;
    var medicationList = req.body.medicineList;
    var purposeList = req.body.purposeList;
    var amountList = req.body.amountList;
    var intervalList = req.body.intervalList;
    var medication;
    var i, key;
    
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    var record = {
        id: id, 
        studentName: name,
        visitDate: visitDate,
        timestamp: timestamp,
        timeIn: timeIn,
        timeout: timeOut,
        attendingClinician: clinician,
        visitReason: complaint,
        treatment: treatment,
        notes: notes,
        status: status,
        medication: ""
    };

    clinicVisitRef.push(record);
    key = clinicVisitRef.push(record).key;

    for(i = 0; i < medicationList.length; i++){
        // left side is the field name in firebase
        medication = {
            medicines: medicationList[i],
            purpose: purposeList[i],
            amount: amountList[i],
            interval: intervalList[i]
        };
        //database.ref('clinicVisit/' + key + '/medication').push(medication);
    }
    
    res.send({
        success: true,
        success_msg: "Record added!"
    });
}

exports.getClinicVisits = function(req, res){
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timestamp");
    var visitsObject = [], detailsTemp = [], temp =[];
    var i, j, childSnapshotData;

    query.on('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot){                  // Getting primary keys of users
            childSnapshotData = childSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
            
            temp.push({ // contains all data (not grouped by date)
              studentName: childSnapshotData.studentName,
              timeIn: childSnapshotData.timeIn,
              timeOut: childSnapshotData.timeOut,
              status: childSnapshotData.status,
              visitDate: childSnapshotData.visitDate
            })         
        })
        console.log(temp)
        
        /*
            new object 'filtered' contains arrays of records
            if date does not exist as a key in 'filtered' => add key to 'filtered' => push record to key
            if date exists  as a key => push to the key

            remove key
            check if object with key 'date' exists => if not => create object with key 'date'
            check if object with key 'date' exists => if exists => ????
        */
        var filtered = {};
        
        temp.forEach(record => {
            if(record.visitDate in filtered){ //if key exist
                var key = record.visitDate;
                filtered[key].push({
                    visitDetails: record
                });
            }
            else{ 
                var key = record.visitDate;
                filtered[key] = [];
                filtered[key].push(record);
            }            
        });
        console.log(filtered);

        

        
        
        
        res(visitsObject);
    })
}