const firebase = require('../firebase');

exports.getStudentInfo = function(req, res){
    var id = req.body.studentID;
    var database = firebase.database();
    var studentRef = database.ref("studentInfo/"+ id);
    var snapshotData, studentInfo;

    studentRef.on('value', (snapshot) => {
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
            res.send({
                error: true,
                error_msg: "No student with that id number!"
            })
        }
    })
};

exports.getNotAllowedMedication = function(req, res){
    var id = req.body.studentID;
    var database = firebase.database();
    var medicineRef = database.ref("studentHealthHistory/"+id+"/allowedMedicines");
    var childSnapshotData, temp = [],notAllowed = [];

    medicineRef.on('value', (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                if(childSnapshotData.isAllowed == false){
                    notAllowed.push({
                        medicine: childSnapshot.key
                    })
                }
            })
            console.log("not allowed medications")
            console.log(notAllowed);
            res.status(200).send(notAllowed);
        } else {
            res.status(200).send(notAllowed);
        }
    })
};

exports.getBMI = function(req, res){
    var id = req.body.idNum;
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
            res.send({
                error: true,
                error_msg: "No student with that id number!"
            })
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