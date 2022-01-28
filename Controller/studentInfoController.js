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
                bmi: snapshotData.bmi,
                bmiStatus: snapshotData.bmiStatus,
                height: snapshotData.height,
                heightStatus: snapshotData.heightStatus,
                weight: snapshotData.weight,
                weightStatus: snapshotData.weightStatus,
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
                pediaEmail: snapshotData.pediaEmail,
                pediaContact: snapshotData.pediaContact,
                dentistName: snapshotData.dentistName,
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

    medicineRef.once('value', (snapshot) => {
        if(snapshot.exists()){
            var lastUpdated = snapshot.child('lastUpdated').val();
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                notAllowed.push({
                    medicine: childSnapshot.key,
                    isAllowed: childSnapshotData.isAllowed,
                    lastUpdated: lastUpdated,
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

    historyRef.once('value', (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                studentInfo.push({ 
                    schoolYear: childSnapshot.key,  // getting parent key
                    age: childSnapshotData.age,
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
    var student = req.query.studentID;
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit").orderByChild("visitDate");
    var details = [];
    var childSnapshotData;

    clinicVisitRef.once('value', async (snapshot) => {
        if(snapshot.exists()){
            await snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                if(childSnapshotData.id == student){
                    details.push({
                        idNum: childSnapshotData.id,
                        studentName: childSnapshotData.studentName,
                        grade: childSnapshotData.grade,
                        section: childSnapshotData.section,
                        visitDate: childSnapshotData.visitDate,
                        attendingNurse: childSnapshotData.nurseName,
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
                        impression: childSnapshotData.impression, 
                        diagnosis: childSnapshotData.diagnosis,
                        status: childSnapshotData.status,
                        notes: childSnapshotData.notes,
                    })
                }
            })
            details.reverse();
            console.log("details");
            console.log(details)
            res.status(200).send(details);
        } else {
            res.status(200).send(details);
        }
    })  
};

exports.getLastVisit = function(req, res){
    var student = req.query.studentID;
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    var temp = [], details = "";
    var childSnapshotData;

    clinicVisitRef.orderByChild("id").equalTo(student).once('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                temp.push({
                    idNum: childSnapshotData.id,
                    studentName: childSnapshotData.studentName,
                    visitDate: childSnapshotData.visitDate,
                    attendingNurse: childSnapshotData.nurseName,
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
                    impression: childSnapshotData.impression,
                    treatment: childSnapshotData.treatment,
                    diagnosis: childSnapshotData.diagnosis,
                    status: childSnapshotData.status,
                    notes: childSnapshotData.notes,
                })
            })
            
            if(temp.length == 1){   // if once lang siya nagpunta sa clinic dati
                details = {
                    idNum: temp[0].idNum,
                    studentName: temp[0].studentName,
                    grade: temp[0].grade,
                    section: temp[0].section,
                    visitDate: temp[0].visitDate,
                    attendingNurse: temp[0].attendingNurse,
                    timeIn: temp[0].timeIn,
                    timeOut: temp[0].timeOut,
                    weight: temp[0].weight,
                    height: temp[0].height,
                    bodyTemp: temp[0].bodyTemp,
                    systolicBP: temp[0].systolicBP,
                    diastolicBP: temp[0].diastolicBP,
                    pulseRate: temp[0].pulseRate,
                    respirationRate: temp[0].respirationRate,
                    visitReason: temp[0].visitReason,
                    treatment: temp[0].treatment,
                    diagnosis: temp[0].diagnosis,
                    status: temp[0].status,
                    notes: temp[0].notes
                } 
                res.status(200).send(details);
            } else {    // if multiple times siya pumunta sa clinic but getting the lastest visit details only   
                details = {
                    idNum: temp[temp.length-1].idNum,
                    studentName: temp[temp.length-1].studentName,
                    grade: temp[temp.length-1].grade,
                    section: temp[temp.length-1].section,
                    visitDate: temp[temp.length-1].visitDate,
                    attendingNurse: temp[temp.length-1].attendingNurse,
                    timeIn: temp[temp.length-1].timeIn,
                    timeOut: temp[temp.length-1].timeOut,
                    weight: temp[temp.length-1].weight,
                    height: temp[temp.length-1].height,
                    bodyTemp: temp[temp.length-1].bodyTemp,
                    systolicBP: temp[temp.length-1].systolicBP,
                    diastolicBP: temp[temp.length-1].diastolicBP,
                    pulseRate: temp[temp.length-1].pulseRate,
                    respirationRate: temp[temp.length-1].respirationRate,
                    visitReason: temp[temp.length-1].visitReason,
                    treatment: temp[temp.length-1].treatment,
                    diagnosis: temp[temp.length-1].diagnosis,
                    status: temp[temp.length-1].status,
                    notes: temp[temp.length-1].notes
                }
                res.status(200).send(details);
            }
        } else {
            res.status(200).send(details);
        }
    })  
};

exports.getStudentIntakeHistory = function(req, res){
    var id = req.query.studentID;
    var database = firebase.database();
    var historyRef = database.ref("intakeHistory");
    var childSnapshotData, history = [];

    historyRef.orderByChild("id").equalTo(id).once('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                childSnapshot.child("medications").forEach(function(innerChild){
                    innerChildData = innerChild.exportVal();
                    history.push({
                        medicine: innerChildData.specificMedicine,
                        amount: innerChildData.amount,
                        time: innerChildData.time,
                        visitDate: childSnapshotData.visitDate,
                        attendingNurse: childSnapshotData.attendingNurse,
                        timeIn: childSnapshotData.timeIn,
                        timeOut: childSnapshotData.timeOut,
                    })
                })
            });
            res.status(200).send(history);
        } else {
            res.status(200).send(history);
        }
    })
};

exports.getImmunizationRecord = function(req, res){
    var id = req.query.studentID;
    var database = firebase.database();
    var historyRef = database.ref("studentHealthHistory/"+id+"/immuneHistory");
    var childSnapshotData, immunizationHistory = [];

    historyRef.once('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                immunizationHistory.push({
                    dateGiven: childSnapshotData.dateGiven,
                    name: childSnapshotData.name,
                    purpose: childSnapshotData.purpose,
                })
            });
            res.status(200).send(immunizationHistory);
        } else {
            res.status(200).send(immunizationHistory);
        }
    })
}

exports.getVaccineList = function(req, res){
    var database = firebase.database();
    var vaccineRef = database.ref("vaccineList");
    var vaccineList = [];

    vaccineRef.once('value', async (list) => {
        list.forEach(function(vaccine){
            vaccineList.push({
                vaccineName: vaccine.key
            })
        })
        res.status(200).send(vaccineList);
    })
}

exports.getStudentPastIllness = function(req, res){
    var id = req.query.studentID;
    var database = firebase.database();
    var illnessRef = database.ref("studentHealthHistory/"+ id + "/pastIllness");
    var illnessHistory = [];

    illnessRef.once('value', (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                illnessHistory.push({
                    disease: childSnapshotData.disease,
                    status: childSnapshotData.status,
                    startDate: childSnapshotData.startDate,
                    endDate: childSnapshotData.endDate,
                    notes: childSnapshotData.notes,
                    treatment: childSnapshotData.treatment
                })
            })
            res.status(200).send(illnessHistory);
        } else {
            res.status(200).send(illnessHistory);
        }
    })
};

exports.getStudentAllergies = function(req, res){
    var id = req.query.studentID;
    var database = firebase.database();
    var allergyRef = database.ref("studentHealthHistory/"+ id + "/allergies");
    var childSnapshotData, allergies = [];

    allergyRef.once('value', (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                allergies.push({
                    allergy: childSnapshotData.allergy,
                    diagnosisDate: childSnapshotData.diagnosisDate,
                    lastOccurrence: childSnapshotData.lastOccurrence,
                    allergyType: childSnapshotData.type
                })
            })
            console.log("allergies");
            console.log(allergies);
            res.status(200).send(allergies);
        } else {
            res.status(200).send(allergies);
        }
    })
};

exports.getStudentAllHealthAssessRecords = function(req, res){
    var id = req.query.studentID;
    var database = firebase.database();
    var studentApeRecord= database.ref("studentHealthHistory/"+id+"/ape");
    var studentAdeRecord= database.ref("studentHealthHistory/"+id+"/ade");
    var healthHistory= database.ref("studentHealthHistory/"+id);
    
    console.log("HI");
    var allApe=[], allAde=[], allHaRecords=[];
    console.log(id);

    healthHistory.once('value',(students)=>{
        if(allApe.length==0 && allAde.length==0){
            //students.forEach(function(student){
                console.log("DAMNIT");
                students.child("ape").forEach(function(childSnapshot){
                    console.log("Death")
                    if(childSnapshot.exists()){
                        console.log("HI!")
                        var childValues= childSnapshot.exportVal();
                        allApe.push({
                            sy:childSnapshot.key,
                            age:childValues.age,
                            dope:childValues.apeDate,
                            doctor:childValues.clinician,
                            systolic:childValues.systolic,
                            diastolic:childValues.diastolic,
                            temp: childValues.temp,
                            bp: childValues.bp,
                            pr: childValues.pr,
                            rr: childValues.rr,
                            sf:childValues.sf,
                            weight: childValues.weight,
                            height: childValues.height,
                            bmi: childValues.bmi,
                            bmiStatus: childValues.bmiStatus,
                            od: childValues.odVision,
                            os: childValues.osVision,
                            odGlasses: childValues.odGlasses,
                            osGlasses: childValues.osGlasses,
                            medProb: childValues.medProb,
                            allergies: childValues.allergies,
                            complaints: childValues.concern,
                            reco: childValues.assess
                        });
                    }
                })
                students.child("ade").forEach(function(childSnapshot2){
                    if(childSnapshot2.exists()){
                        var childValues2= childSnapshot2.exportVal();
                        allAde.push({
                            sy:childSnapshot2.key,
                            age:childValues2.age,
                            dope:childValues2.adeDate,
                            doctor:childValues2.clinician,
                            calculus:childValues2.calculus,
                            anomaly:childValues2.anomaly,
                            gingiva:childValues2.gingiva,
                            studentId:childValues2.id,
                            inputs:childValues2.inputs,
                            studentName:childValues2.name,
                            pocket:childValues2.pocket,
                            schoolYear:childValues2.schoolYear                
                        });
                    }
                })                           
            //})
        }
        console.log(allApe);
        console.log(allAde);
        allHaRecords.push(allApe);
        allHaRecords.push(allAde);
        console.log("HI");
        res.send(allHaRecords);
    })
    


};