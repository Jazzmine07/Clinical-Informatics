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
    var i, temp =[];
    var childSnapshotData;

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
        
        var filtered = [];
        temp.reverse().forEach(record => {
            var found = false;
            for(i = 0; i < filtered.length; i++){
                if(record.visitDate == filtered[i].date){   // filters if same date
                    filtered[i].visitDetails.push(record);
                    filtered[i].count++;
                    found = true;
                    break;
                } 
            }
            if(!found){
                filtered.push({
                    date: record.visitDate,
                    visitDetails: [],
                    count: 1
                })
                filtered[i].visitDetails.push(record);
            }          
        });

        res(filtered);
    })    
}

exports.addAPE = function(req, res){
    var id= req.body.studentId;
    var name = req.body.studentName;
    var apeDate = req.body.visitDate;
    var clinician = req.body.clinician;
    var temp= req.body.bodyTemp;
    var bp = req.body.bp;
    var pr = req.body.pr;
    var rr = req.body.rr;
    var sf = req.body.skinFindings;
    var weight = req.body.weight;
    var height = req.body.height;
    var bmi = req.body.bmi;
    var odVision = req.body.odVision;
    var osVision = req.body.osVision;
    var odGlasses = req.body.odGlasses;
    var osGlasses = req.body.osGlasses;
    var medProb = req.body.medProb;
    var allergies = req.body.allergies;
    var concern = req.body.concern;
    var assess = req.body.assess;
    var normal = req.body.normal;
    
    var key;

    var database = firebase.database();
    var apeRef = database.ref("studentHealthHistory/"+id+"/ape");
    var record = {
        id: id,
        name: name,
        apeDate: apeDate,
        clinician: clinician,
        temp: temp,
        bp: bp,
        pr: pr,
        rr: rr,
        sf: sf,
        weight: weight,
        height: height,
        bmi: bmi,
        odVision: odVision,
        osVision: osVision,
        odGlasses: odGlasses,
        osGlasses: osGlasses,
        medProb: medProb,
        allergies: allergies,
        concern: concern,
        //assess: assess,
        // normal: normal
    };

    apeRef.push(record);
    // key = apeRef.push(record).key;
    
    res.send({
        success: true,
        success_msg: "Record added!"
    });
}