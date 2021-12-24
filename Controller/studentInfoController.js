const firebase = require('../firebase');

exports.getStudentInfo = function(req, res){
    var id = req.query.studentID;
    var database = firebase.database();
    var studentRef = database.ref("studentInfo/"+ id);
    var snapshotData, studentInfo;

    studentRef.once('value', (snapshot) => {
        if(snapshot.exists()){
            snapshotData = snapshot.exportVal();
            studentInfo = {
                firstName: snapshotData.firstName,
                middleName: snapshotData.middleName,
                lastName: snapshotData.lastName,
                grade: snapshotData.grade,
                section: snapshotData.section,
                studentType: snapshotData.studentType,
                birthday: snapshotData.birthday,
                nationailty: snapshotData.nationality,
                religion: snapshotData.religion,
                age: snapshotData.age,
                sex: snapshotData.sex,
                height: snapshotData.height,
                weight: snapshotData.weight,
                address: snapshotData.address,
                fatherName: snapshotData.fatherName,
                fatherEmail: snapshotData.fatherEmail,
                fatherContact: snapshotData.fatherContact,
                motherName: snapshotData.motherName,
                motherEmail: snapshotData.motherEmail,
                motherContact: snapshotData.motherContact,
                guardianName: snapshotData.guardianName,
                guardianEmail: snapshotData.guardianEmail,
                guardianContact: snapshotData.guardianContact,
                pediaName: snapshotData.pediaName,
                pediaEmail:snapshotData.pediaEmail,
                pediaContact: snapshotData.pediaContact,
                dentistName:snapshotData.dentistName,
                dentistEmail: snapshotData.dentistEmail,
                dentistContact: snapshotData.dentistContact,
                preferredHospital: snapshotData.preferredHospital,
                hospitalAddress: snapshotData.hospitalAddress
            }
            res.status(200).send(studentInfo);
        } else {
            res.status(200).send(studentInfo);
        }
    })
};

exports.getNotAllowedMedication = function(req, res){
    var id = req.query.studentID;
    var database = firebase.database();
    var medicineRef = database.ref("studentHealthHistory/"+id+"/allowedMedicines");
    var childSnapshotData, notAllowed = [];

    medicineRef.on('value', (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                notAllowed.push({
                    medicine: childSnapshot.key,
                    isAllowed: childSnapshotData.isAllowed
                })
            })
            res.status(200).send(notAllowed);
        } else {
            res.status(200).send(notAllowed);
        }
    })
};

exports.getBMI = function(req, res){
    var id = req.query.studentID;
    var database = firebase.database();
    var historyRef = database.ref("studentHealthHistory/"+ id + "/ape");
    var studentInfo = [];

    historyRef.on('value', (snapshot) => {
        if(snapshot.exists()){
            var test = snapshot.exportVal();
            console.log("snasphot exportval");
            console.log(test);
            
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                studentInfo.push({ 
                    schoolYear: childSnapshot.key,  // getting parent key
                    bmi: childSnapshotData.bmi,
                    weight: childSnapshotData.weight,
                    height: childSnapshotData.height
                })  
            })
            res.send(studentInfo);
        } else {
            res.send(studentInfo);
        }
    })
};

exports.getStudentVisits = function(req, res){
    var id = req.body.studentID;
    var database = firebase.database();
    var visitRef = database.ref("clinicVisit");
    var userRef = database.ref("clinicUsers");
    var i, childSnapshotData, temp = [], visits = [];

    visitRef.orderByChild("id").equalTo(id).on('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                temp.push({
                    visitDate: childSnapshotData.visitDate,
                    attendingNurse: childSnapshotData.attendingNurse,
                    timeIn: childSnapshotData.timeIn,
                    timeOut: childSnapshotData.timeOut,
                    weight: childSnapshotData.weight,
                    height: childSnapshotData.height,
                    bodyTemp: childSnapshotData.bodyTemp,
                    systolicBP: childSnapshotData.systolicBP,
                    diastolicBP: childSnapshotData.diastolicBP,
                    pulseRate: childSnapshotData.pulseRate,
                    respirationRate: childSnapshotData.respirationRate,
                    visitReason: childSnapshotData.visitReason,
                    treatment: childSnapshotData.treatment,
                    diagnosis: childSnapshotData.diagnosis,
                    status: childSnapshotData.status,
                    notes: childSnapshotData.notes,
                });
            });

            for(i = 0; i < temp.length; i++){
                await userRef.child(temp[i].attendingNurse).once('value',(userSnapshot) => {
                    fname = userSnapshot.child('firstName').val();
                    lname = userSnapshot.child('lastName').val();
                    visits.push({
                        visitDate: temp[i].visitDate,
                        attendingNurse: fname + " " + lname,
                        timeIn: temp[i].timeIn,
                        timeOut: temp[i].timeOut,
                        weight: temp[i].weight,
                        height: temp[i].height,
                        bodyTemp: temp[i].bodyTemp,
                        systolicBP: temp[i].systolicBP,
                        diastolicBP: temp[i].diastolicBP,
                        pulseRate: temp[i].pulseRate,
                        respirationRate: temp[i].respirationRate,
                        visitReason: temp[i].visitReason,
                        treatment: temp[i].treatment,
                        diagnosis: temp[i].diagnosis,
                        status: temp[i].status,
                        notes: temp[i].notes
                    })
                });  
            }
            console.log("student visits");
            console.log(visits);
            res.status(200).send(visits);
        } else {
            res.status(200).send(visits);
        }
    })
};

exports.getStudentIntakeHistory = function(req, res){
    var id = req.query.studentID;
    var database = firebase.database();
    var historyRef = database.ref("intakeHistory");
    var userRef = database.ref("clinicUsers");
    var i, childSnapshotData, temp = [], history = [], medications = [];

    historyRef.orderByChild("id").equalTo(id).on('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                childSnapshot.child("medications").forEach(function(innerChild){
                    innerChildData = innerChild.exportVal();
                    console.log("innerchild");
                    console.log(innerChildData);
                    history.push({
                        medicine: innerChildData.medicine,
                        amount: innerChildData.amount,
                        time: innerChildData.time,
                        visitDate: childSnapshotData.visitDate,
                        attendingNurse: childSnapshotData.attendingNurse,
                        timeIn: childSnapshotData.timeIn,
                        timeOut: childSnapshotData.timeOut,
                    })
                })
            });

            console.log("student intake history");
            console.log(history);
            res.status(200).send(history);
        } else {
            res.status(200).send(history);
        }
    })
};