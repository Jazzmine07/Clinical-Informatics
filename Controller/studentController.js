const firebase = require('../firebase');
const bodyParser = require('body-parser');
const { use } = require('../routes');

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
    // visit details
    var id = req.body.studentId;
    var name = req.body.studentName;
    var visitDate = req.body.visitDate;
    var timestamp = req.body.timeStamp;
    var timeIn = req.body.timeIn;
    var timeOut = req.body.timeOut;
    var nurse = req.body.nurse;
    var bodyTemp = req.body.bodyTemp;
    var systolicBP = req.body.systolicBP;
    var diastolicBP = req.body.diastolicBP;
    var pulseRate = req.body.pulseRate;
    var respirationRate = req.body.respirationRate;                      
    var complaint = req.body.complaint;
    var treatment = req.body.treatement;
    
    // medication
    var medicationAssign = req.body.medicationAssign;
    var prescribedBy = req.body.prescribedBy;
    var medicationList = req.body.medicineList;
    var purposeList = req.body.purposeList;
    var amountList = req.body.amountList;
    var intervalList = req.body.intervalList;
    var startMed = req.body.startMed;
    var endMed = req.body.endMed;
    
    // diagnosis
    var diagnosisAssign = req.body.diagnosisAssign;
    var diagnosis = req.body.diagnosis;

    var notes = req.body.notes;
    var status = req.body.status;

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
        attendingNurse: nurse,
        bodyTemp: bodyTemp,
        systolicBP: systolicBP,
        diastolicBP: diastolicBP,
        pulseRate: pulseRate,
        respirationRate: respirationRate,   

        visitReason: complaint,
        treatment: treatment,

        medicationAssigned: medicationAssign,
        medicationPrescribed: prescribedBy,
        medication: "", // array of medications
        medicationStartDate: startMed,
        medicationEndDate: endMed,

        diagnosisAssigned: diagnosisAssign,
        diagnosis: diagnosis,
        status: status,
        notes: notes,
    };

    key = clinicVisitRef.push(record).key;

    // for(i = 0; i < medicationList.length; i++){
    //     // left side is the field name in firebase
    //     medication = {
    //         medicines: medicationList[i],
    //         purpose: purposeList[i],
    //         amount: amountList[i],
    //         interval: intervalList[i]
    //     };
    //     //database.ref('clinicVisit/' + key + '/medication').push(medication);
    // }

    var assignMedication = database.ref("assignedForms/"+ medicationAssign);
    var assignDiagnosis = database.ref("assignedForms/"+diagnosisAssign);

    var medicationForm = {
        task: "Clinic Visit",
        description: "Medication",
        formId: key,
        assignedBy: nurse,
        dateAssigned: visitDate,
        timestamp: timestamp
    }

    var diagnosisForm = {
        task: "Clinic Visit",
        description: "Diagnosis",
        formId: key,
        assignedBy: nurse,
        dateAssigned: visitDate,
        timestamp: timestamp
    }

    var assignBoth = {
        task: "Clinic Visit",
        description: "Diagnosis & Medication",
        formId: key,
        assignedBy: nurse,
        dateAssigned: visitDate,
        timestamp: timestamp
    }

    var userNotification = database.ref("notifications/"+medicationAssign);

    var notif = {
        type: "form",
        message: "You have been assigned to a new form!",
        date: visitDate,
        timestamp: timestamp,
        seen: false
    }

    if(medicationAssign == diagnosisAssign){
        assignMedication.push(assignBoth);
    } else {
        assignMedication.push(medicationForm);
        assignDiagnosis.push(diagnosisForm);
        userNotification.push(notif);
    }
    
    res.redirect('/clinic-visit');
}

exports.getClinicVisits = function(req, res){
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timestamp");
    var i, temp =[];
    var childSnapshotData;

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("clinicVisit")){
            query.on('value', (childSnapshot) => {
                childSnapshot.forEach(function(innerChildSnapshot){                  // Getting primary keys of users
                    childSnapshotData = innerChildSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
                    
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
        else {
            res(temp);
        }
    })
}

exports.getAssignedForms = function(req, res){
    var user = req;
    var database = firebase.database();
    var databaseRef = database.ref();
    var formsReference = database.ref("assignedForms");
    var formsRef = database.ref("assignedForms/"+user);
    var userRef = database.ref("clinicUsers");
    var query = formsRef.orderByChild("timestamp");
    var forms =[];
    var childSnapshotData;
    var fname, lname;
    
    databaseRef.once('value', (dbSnapshot) => {
        if(dbSnapshot.hasChild("assignedForms")){
            formsReference.once('value', (formSnapshot) => {
                if(formSnapshot.hasChild(user)){
                    query.on('value', (snapshot) => {
                        snapshot.forEach(function(childSnapshot){                 
                            childSnapshotData = childSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
                            userRef.child(childSnapshotData.assignedBy).on('value', (userSnapshot) => {
                                fname = userSnapshot.child('firstName').val();
                                lname = userSnapshot.child('lastName').val();
                                forms.push({ // contains all data (not grouped by date)
                                    task: childSnapshotData.task,
                                    description: childSnapshotData.description,
                                    formId: childSnapshotData.formId,
                                    assignedBy: fname + " " + lname,
                                    dateAssigned: childSnapshotData.dateAssigned
                                })  
                                console.log("forms controller");
                                console.log(forms);
                                forms.reverse();
                            })  
                            res(forms);      
                        })
                    })
                } else {
                    res(forms);
                }
            })
        } else {
            res(forms);
        }
    })
}

exports.getNotifications = function(req, res){
    var user = req;
    var database = firebase.database();
    var notifRef = database.ref("notifications/"+user);
    var childSnapshotData;
    var notifs = [];

    notifRef.on('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot){
            childSnapshotData = childSnapshot.exportVal();
            notifs.push({
                type: childSnapshotData.type,
                message: childSnapshotData.message,
                date: childSnapshotData.date,
                seen: childSnapshotData.seen
            })
            res.send(notifs);
        })
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
    console.log("Assessment:" + assess);

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
        assess: assess,
        // normal: normal
    };
    apeRef.push(record);
    // key = apeRef.push(record).key;
    
    res.send({
        success: true,
        success_msg: "Record added!"
    });
}

exports.getSectionStudents = function(req, res){
    var schoolYear= req.body.schoolYear;
    var section = req.body.section;
    var studentName= req.body.studentName;
    const students = [];

    var database = firebase.database();
    var studentRef = database.ref("studentInfo");
       
    if(section != null){
        console.log(schoolYear);
        console.log(section);
        studentRef.orderByChild("section").equalTo(section).on('value', (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach(function(childSnapshot){
                    console.log("looking for section:" + section);
                    console.log("Key: "+childSnapshot.key);
                    console.log("Section: "+childSnapshot.child("section").val());
                    console.log("Id Number: "+childSnapshot.child("idNum").val());
                    students.push(childSnapshot.key);
                })
                console.log("Students in "+ section +":"+students);
            }
            res.send(students);
        });
    }

    
}