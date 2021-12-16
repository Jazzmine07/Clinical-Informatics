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
            res.send({
                msg: "No medication restriction."
            })
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