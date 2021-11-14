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

        // for(i = 0; i < temp.length; i++){
        //     console.log("temp i");
        //     console.log(temp[i]);
        //     if(i != 0){  // get first date of the first item in the array
        //         for(j = 0; j < visitsObject.length; j++){
        //             console.log("visit object");
        //             console.log(visitsObject[j]);
        //             if(temp[i].visitDate == visitsObject[j].date){   // if same date
        //                 console.log("same date so pasok? ");

        //                 visitsObject[j].visitDetails.push({
        //                     studentName: temp[i].studentName,
        //                     timeIn: temp[i].timeIn,
        //                     timeOut: temp[i].timeOut,
        //                     status: temp[i].status,
        //                     visitDate: temp[i].visitDate
        //                 });
        //                 break;
        //             }
        //             // if(temp[i].visitDate != visitsObject[j].date){   // if different date
        //             //     console.log("different dates");

        //             //     detailsTemp.push({
        //             //         studentName: temp[i].studentName,
        //             //         timeIn: temp[i].timeIn,
        //             //         timeOut: temp[i].timeOut,
        //             //         status: temp[i].status,
        //             //         visitDate: temp[i].visitDate
        //             //     })
                        
        //             //     visitsObject.push({
        //             //         date: temp[i].visitDate,
        //             //         visitDetails: detailsTemp
        //             //     })
        //             //     detailsTemp = [];
        //             //     break;
        //             // }
        //             if(j == visitsObject.length-1){ // adding row if different date
        //                 console.log("ano ginagawa mo?");
        //                 visitsObject.push({
        //                     date: temp[i].visitDate,
        //                     visitDetails: temp[i]
        //                 })
        //                 break;
        //             }
        //             console.log(visitsObject[j]);
        //         }
        //     }
        //     else {
        //         detailsTemp.push({
        //             studentName: temp[i].studentName,
        //             timeIn: temp[i].timeIn,
        //             timeOut: temp[i].timeOut,
        //             status: temp[i].status,
        //             visitDate: temp[i].visitDate
        //         })
                
        //         visitsObject.push({
        //             date: temp[i].visitDate,
        //             visitDetails: detailsTemp
        //         })
        //         detailsTemp = [];
        //         console.log("first index");
        //         console.log(visitsObject[0]);
        //     }
        // }
        // temp = [];
        //console.log("visit object "+visitsObject);
        res(visitsObject);
    })
}