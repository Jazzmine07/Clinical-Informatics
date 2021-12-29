const firebase = require('../firebase');

exports.getDashboard = function(req, res){
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit"); 
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var visitCount = 0, sentClass = 0, hospitalized = 0; sentHome = 0;
    var childSnapshotData, dashboard; 

    var promise = new Promise((resolve, reject) => {
        clinicVisitRef.orderByChild("visitDate").equalTo(date).on('value', (snapshot) => { 
            snapshot.forEach(function(childSnapshot) {
                childSnapshotData = childSnapshot.exportVal();
                console.log(childSnapshot.key);
                visitCount++;
                console.log(visitCount);
                if(childSnapshotData.status == "Sent To Class"){
                    sentClass++;
                } else if(childSnapshotData.status == "Hospitalized"){
                    hospitalized++;
                } else if(childSnapshotData.status == "Sent Home"){
                    sentHome++;
                }
            });
            dashboard = {
                visitCount: visitCount,
                classCount: sentClass,
                hospitalizedCount: hospitalized,
                sentHomeCount: sentHome
            }
            resolve(dashboard);
        })
    })
    return promise;
};

exports.addClinicVisit = function(req, res){
    var { studentId, studentName , studentGrade, studentSection, visitDate, timeIn, timeOut, clinicType, nurseKey, nurseName,
        weight, height, bodyTemp,  systolicBP,  diastolicBP, pulseRate, respirationRate, 
        weightStatus, heightStatus, bodyTempStatus, systolicStatus, diastolicStatus, pulseRateStatus, respRateStatus,
        complaint, impression, treatment, 
        diagnosisAssign, diagnosis, prescribedBy, medicationsArray, intakeArray, notes, status } = req.body;

    var i, formId;
    var time = Math.round(+new Date()/1000);

    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    var userRef = database.ref("clinicUsers");
    
    try {
        var update = {
            height: height,
            weight: weight
        };
        database.ref("studentInfo/"+studentId).update(update);

        var record = {
            id: studentId, 
            studentName: studentName,
            grade: studentGrade,
            section: studentSection,
            visitDate: visitDate,
            timestamp: time,
            timeIn: timeIn,
            timeOut: timeOut,
            clinicType: clinicType,
            nurseKey: nurseKey,
            nurseName: nurseName,
    
            weight: weight,
            weightStatus: weightStatus,
            height: height,
            heightStatus: heightStatus,
            bodyTemp: bodyTemp,
            bodyTempStatus: bodyTempStatus,
            systolicBP: systolicBP,
            systolicStatus: systolicStatus,
            diastolicBP: diastolicBP,
            diastolicStatus: diastolicStatus,
            pulseRate: pulseRate,
            pulseRateStatus: pulseRateStatus,
            respirationRate: respirationRate,   
            respRateStatus: respRateStatus,
    
            visitReason: complaint,
            impression: impression,
            treatment: treatment,
    
            diagnosisAssigned: diagnosisAssign,
            diagnosis: diagnosis,
    
            prescribedBy: prescribedBy,
    
            status: status,
            notes: notes,
        };
    
        formId = clinicVisitRef.push(record).key;  
        if(medicationsArray != undefined){
            for(i = 0; i < medicationsArray.length; i++){
                medication = {
                    medicine: medicationsArray[i].medication,
                    purpose: medicationsArray[i].purpose,
                    amount: parseInt(medicationsArray[i].amount),
                    interval: medicationsArray[i].interval,
                    startMed: medicationsArray[i].startMed,
                    endMed: medicationsArray[i].endMed
                };
                database.ref('clinicVisit/' + formId + '/medications').push(medication);
            }
        }
    
        // if intake array is not empty!
        if(intakeArray != undefined){
            var intakeHistory = {
                attendingNurse: nurseName,
                grade: studentGrade,
                id: studentId, 
                medications: "", // array of medications
                section: studentSection,
                studentName: studentName,
                timeIn: timeIn,
                timeOut: timeOut,
                timestamp: time,
                visitDate: visitDate,
            }
        
            var intakeRef = database.ref("intakeHistory");
            var historyKey = intakeRef.push(intakeHistory).key;
            for(i = 0; i < intakeArray.length; i++){
                history = {
                    medicine: intakeArray[i].med,
                    medicineName: intakeArray[i].medication,
                    amount: parseInt(intakeArray[i].amount),
                    time: intakeArray[i].time
                };
                database.ref('intakeHistory/' + historyKey + '/medications').push(history);
            }
        }
    
        if(diagnosisAssign != ""){
            var assignDiagnosis = database.ref("assignedForms/"+diagnosisAssign+"/"+formId);
            var diagnosisForm = {
                task: "Clinic Visit",
                description: "Diagnosis & Prescription",
                assignedBy: nurseName,
                dateAssigned: visitDate,
                timestamp: time
            }
    
            var userDiagnosisNotification = database.ref("notifications/"+diagnosisAssign+"/"+formId);
            var notif = {
                type: "form",
                message: "You have been assigned to a new form!",
                date: visitDate,
                timestamp: time,
                seen: false
            }
    
            assignDiagnosis.set(diagnosisForm);
            userDiagnosisNotification.set(notif);
        }

        // needed as ajax was used to send data
        res.status(200).send();
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.editClinicVisit = function(req, res){
    var { userKey, userName, formId, studentId, studentName, studentGrade, studentSection, 
        visitDate, timeIn, timeOut, diagnosis, 
        medicationAssign, medicationAssigned, medicationsArray, intakeArray, status, notes } = req.body;
    var i;
    
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit/"+formId);
    var userRef = database.ref("clinicUsers/"+userKey);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = Math.round(+new Date()/1000);

    userRef.once("value", (userSnapshot) => { 
        if(userSnapshot.child("role").val() == "Clinician"){
            console.log("pumasok sa clinician if");
            if(medicationAssign == ""){ // meaning clinician is the one inputting the medication section
                console.log("pumasok pag wlang medication assigned");
                var record = {
                    timeOut: timeOut,
                    diagnosis: diagnosis,
                    status: status,
                    notes: notes,
                };

                clinicVisitRef.update(record);

                for(i = 0; i < medicationsArray.length; i++){
                    medication = {
                        medicine: medicationsArray[i].medication,
                        purpose: medicationsArray[i].purpose,
                        amount: parseInt(medicationsArray[i].amount),
                        interval: medicationsArray[i].interval,
                        startMed: medicationsArray[i].startMed,
                        endMed: medicationsArray[i].endMed
                    };
                    database.ref('clinicVisit/' + formId + '/medications').push(medication);
                }

                //if intake array is not empty!
                if(intakeArray != undefined){
                    var intakeHistory = {
                        attendingClinician: userName,
                        grade: studentGrade,
                        id: studentId, 
                        medications: "", // array of medications
                        section: studentSection,
                        studentName: studentName,
                        timeIn: timeIn,
                        timeOut: timeOut,
                        timestamp: time,
                        visitDate: visitDate,
                    }
                
                    var intakeRef = database.ref("intakeHistory");
                    var historyKey = intakeRef.push(intakeHistory).key;
                    for(i = 0; i < intakeArray.length; i++){
                        history = {
                            medicine: intakeArray[i].medication,
                            medicineName: intakeArray[i].med,
                            amount: parseInt(intakeArray[i].amount),
                            time: intakeArray[i].time
                        };
                        database.ref('intakeHistory/' + historyKey + '/medications').push(history);
                    }
                }

                // -----------REMOVING ASSIGNED FORM & NOTIF FOR CLINICIAN--------------
                var formRef = database.ref("assignedForms/"+ userKey);
                formRef.on('value', (snapshot) => { 
                    snapshot.forEach(function(childSnapshot) {
                        if(childSnapshot.key == formId){
                            database.ref("assignedForms/"+ userKey + "/" + formId).remove();
                            database.ref("notifications/"+ userKey + "/" + formId).remove();
                        }
                    });
                })
                res.status(200).send();
            } else {
                var record = {
                    timeOut: timeOut,
                    diagnosis: diagnosis,
                    medicationAssigned: medicationAssign,
                    medications: "", // array of medications
                    status: status,
                    notes: notes,
                };

                clinicVisitRef.update(record);

                //-----------NOTIFICATION FOR NURSE---------------
                var assignMedication = database.ref("assignedForms/"+medicationAssign+"/"+formId);
                var medicationForm = {
                    task: "Clinic Visit",
                    description: "Encode Prescription",
                    assignedBy: userName,
                    dateAssigned: date,
                    timestamp: time
                }

                var userMedicationNotification = database.ref("notifications/"+medicationAssign+"/"+formId);
                var notif = {
                    type: "form",
                    message: "You have been assigned to a new form!",
                    date: date,
                    timestamp: time,
                    seen: false
                }

                assignMedication.set(medicationForm);
                userMedicationNotification.set(notif);
                
                // -----------REMOVING ASSIGNED FORM & NOTIF FOR CLINICIAN--------------
                var formRef = database.ref("assignedForms/"+ userKey);
                formRef.on('value', (snapshot) => { 
                    snapshot.forEach(function(childSnapshot) {
                        if(childSnapshot.key == formId){
                            database.ref("assignedForms/"+ userKey + "/" + formId).remove();
                            database.ref("notifications/"+ userKey + "/" + formId).remove();
                        }
                    });
                })

                res.status(200).send();
            }
        } else {    // nurse encoding medication section
            var record = {
                timeOut: timeOut,
                status: status,
            };
        
            clinicVisitRef.update(record);

            for(i = 0; i < medicationsArray.length; i++){
                medication = {
                    medicine: medicationsArray[i].medication,
                    purpose: medicationsArray[i].purpose,
                    amount: parseInt(medicationsArray[i].amount),
                    interval: medicationsArray[i].interval,
                    startMed: medicationsArray[i].startMed,
                    endMed: medicationsArray[i].endMed
                };
                database.ref('clinicVisit/' + formId + '/medications').push(medication);
            }

            //if intake array is not empty!
            if(intakeArray != undefined){
                var intakeHistory = {
                    attendingNurse: userName,
                    grade: studentGrade,
                    id: studentId, 
                    medications: "", // array of medications
                    section: studentSection,
                    studentName: studentName,
                    timeIn: timeIn,
                    timeOut: timeOut,
                    timestamp: time,
                    visitDate: visitDate,
                }
            
                var intakeRef = database.ref("intakeHistory");
                var historyKey = intakeRef.push(intakeHistory).key;
                for(i = 0; i < intakeArray.length; i++){
                    history = {
                        medicine: intakeArray[i].medication,
                        medicineName: intakeArray[i].med,
                        amount: parseInt(intakeArray[i].amount),
                        time: intakeArray[i].time
                    };
                    database.ref('intakeHistory/' + historyKey + '/medications').push(history);
                }
            }

            // -----------REMOVING ASSIGNED FORM & NOTIF FOR NURSE--------------
            var formRef = database.ref("assignedForms/"+ userKey);
            formRef.on('value', (snapshot) => { 
                snapshot.forEach(function(childSnapshot) {
                    if(childSnapshot.key == formId){
                        database.ref("assignedForms/"+ userKey + "/" + formId).remove();
                        database.ref("notifications/"+ userKey + "/" + formId).remove();
                    }
                });
            })
            res.status(200).send();
        }
    })
};

exports.getAssignedForms = (req, res) => {
    var user = req;
    var database = firebase.database();
    var formsRef = database.ref("assignedForms/"+user);
    var forms =[];
    var childSnapshotData;
    
    var promise = new Promise((resolve, reject) => {
        formsRef.orderByChild("timestamp").on('value', async (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach(function(childSnapshot){
                    childSnapshotData = childSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
                    forms.push({
                        task: childSnapshotData.task,
                        description: childSnapshotData.description,
                        formId: childSnapshot.key,
                        assignedBy: childSnapshotData.assignedBy,
                        dateAssigned: childSnapshotData.dateAssigned
                    });
                })
                resolve(forms);
            } else {
                resolve(forms);
            }
        })
    })
    return promise;
};

// ------ This function is for editing form-------------
exports.getClinicVisitForm = function(req){
    var formId = req.params.id;
    var database = firebase.database();
    var formRef = database.ref("clinicVisit/"+formId);
    var userRef = database.ref("clinicUsers");
    var temp = [], details;
    var dFname, dLname, mFname, mLname;

    var promise = new Promise((resolve, reject)=>{
        formRef.on('value', async (snapshot) => {
            snapshotData = snapshot.exportVal();
            temp.push({
                formId: formId,
                id: snapshotData.id,
                studentName: snapshotData.studentName,
                grade: snapshotData.grade,
                section: snapshotData.section,
                visitDate: snapshotData.visitDate,
                timeIn: snapshotData.timeIn,
                visitType: snapshotData.visitType,
                nurseKey: snapshotData.nurseKey,
                attendingNurse: snapshotData.nurseName,
                
                weight: snapshotData.weight,
                weightStatus: snapshotData.weightStatus,
                height: snapshotData.height,
                heightStatus: snapshotData.heightStatus,
                bodyTemp: snapshotData.bodyTemp,
                bodyTempStatus: snapshotData.bodyTempStatus,
                systolicBP: snapshotData.systolicBP,
                systolicStatus: snapshotData.systolicStatus,
                diastolicBP: snapshotData.diastolicBP,
                diastolicStatus: snapshotData.diastolicStatus,
                pulseRate: snapshotData.pulseRate,
                pulseRateStatus: snapshotData.pulseRateStatus,
                respirationRate: snapshotData.respirationRate,   
                respRateStatus: snapshotData.respRateStatus,

                visitReason: snapshotData.visitReason,
                impression: snapshotData.impression,
                treatment: snapshotData.treatment,

                diagnosisAssignedKey: snapshotData.diagnosisAssigned,
                diagnosis: snapshotData.diagnosis,

                prescribedBy: "",
                medicationAssignedKey: snapshotData.medicationAssigned,
                status: snapshotData.status,
                notes: snapshotData.notes
            })

            await userRef.child(temp[0].diagnosisAssignedKey).once('value', (diagnosis) => {
                dFname = diagnosis.child('firstName').val();
                dLname = diagnosis.child('lastName').val();
            });

            if(temp[0].medicationAssignedKey != "" && temp[0].medicationAssignedKey != undefined && temp[0].medicationAssignedKey != null){
                await userRef.child(temp[0].medicationAssignedKey).once('value', (medication) => {
                    mFname = medication.child('firstName').val();
                    mLname = medication.child('lastName').val();
                });
            }
        
            details = {
                formId: temp[0].formId,
                id: temp[0].id,
                studentName: temp[0].studentName,
                grade: temp[0].grade,
                section: temp[0].section,
                visitDate: temp[0].visitDate,
                nurseKey: temp[0].nurseKey,
                attendingNurse: temp[0].attendingNurse,
                timeIn: temp[0].timeIn,
                timeOut: temp[0].timeOut,
                visitType: temp[0].visitType,
                weight: temp[0].weight,
                weightStatus: temp[0].weightStatus,
                height: temp[0].height,
                heightStatus: temp[0].heightStatus,
                bodyTemp: temp[0].bodyTemp,
                bodyTempStatus: temp[0].bodyTempStatus,
                systolicBP: temp[0].systolicBP,
                systolicStatus: temp[0].systolicStatus,
                diastolicBP: temp[0].diastolicBP,
                diastolicStatus: temp[0].diastolicStatus,
                pulseRate: temp[0].pulseRate,
                pulseRateStatus: temp[0].pulseRateStatus,
                respirationRate: temp[0].respirationRate,
                respRateStatus: temp[0].respRateStatus,
                visitReason: temp[0].visitReason,
                impression: temp[0].impression,
                treatment: temp[0].treatment,
                treatment: temp[0].treatment,
                diagnosisAssignedKey: temp[0].diagnosisAssignedKey,
                diagnosisAssigned: dFname + " " + dLname,
                diagnosis: temp[0].diagnosis,
                prescribedBy: dFname + " " + dLname,
                medicationAssignedKey: temp[0].medicationAssignedKey,
                medicationAssigned: mFname + " " + mLname,
                diagnosis: temp[0].diagnosis,
                status: temp[0].status,
                notes: temp[0].notes
            }
            resolve(details);
        })
    })
    return promise;
};

//----------------This function is for viewing the form together with the medications
exports.viewClinicVisitForm = function(req){
    var formId = req.params.id;
    var database = firebase.database();
    var formRef = database.ref("clinicVisit/"+formId);
    var userRef = database.ref("clinicUsers");
    var temp = [], medications = [], details;
    var fname, lname, dFname, dLname, mFname, mLname;

    var promise = new Promise((resolve, reject)=>{
        formRef.on('value', async (snapshot) => {
            snapshotData = snapshot.exportVal();
            snapshot.child('medications').forEach(function(meds){
                medications.push({
                    medicine: meds.child('medicine').val(),
                    purpose: meds.child('purpose').val(),
                    amount: meds.child('amount').val(),
                    interval: meds.child('interval').val(),
                    startMed: meds.child('startMed').val(),
                    endMed: meds.child('endMed').val(),
                })
            })
            console.log("medications array inside controlelr");
            console.log(medications);
            temp.push({
                formId: formId,
                id: snapshotData.id,
                studentName: snapshotData.studentName,
                grade: snapshotData.grade,
                section: snapshotData.section,
                visitDate: snapshotData.visitDate,
                timeIn: snapshotData.timeIn,
                visitType: snapshotData.visitType,
                nurseKey: snapshotData.attendingNurse,
                attendingNurse: snapshotData.nurseName,
                
                weight: snapshotData.weight,
                weightStatus: snapshotData.weightStatus,
                height: snapshotData.height,
                heightStatus: snapshotData.heightStatus,
                bodyTemp: snapshotData.bodyTemp,
                bodyTempStatus: snapshotData.bodyTempStatus,
                systolicBP: snapshotData.systolicBP,
                systolicStatus: snapshotData.systolicStatus,
                diastolicBP: snapshotData.diastolicBP,
                diastolicStatus: snapshotData.diastolicStatus,
                pulseRate: snapshotData.pulseRate,
                pulseRateStatus: snapshotData.pulseRateStatus,
                respirationRate: snapshotData.respirationRate,   
                respRateStatus: snapshotData.respRateStatus,

                visitReason: snapshotData.visitReason,
                impression: snapshotData.impression,
                treatment: snapshotData.treatment,

                diagnosisAssignedKey: snapshotData.diagnosisAssigned,
                diagnosis: snapshotData.diagnosis,

                prescribedBy: "",
                medicationAssignedKey: snapshotData.medicationAssigned,
                status: snapshotData.status,
                notes: snapshotData.notes
            })  

            await userRef.child(temp[0].diagnosisAssignedKey).once('value', (diagnosis) => {
                dFname = diagnosis.child('firstName').val();
                dLname = diagnosis.child('lastName').val();
            });
            
            if(temp[0].medicationAssignedKey != "" && temp[0].medicationAssignedKey != undefined && temp[0].medicationAssignedKey != null){
                await userRef.child(temp[0].medicationAssignedKey).once('value', (medication) => {
                    mFname = medication.child('firstName').val();
                    mLname = medication.child('lastName').val();
                });
            }
        
            details = {
                formId: temp[0].formId,
                id: temp[0].id,
                studentName: temp[0].studentName,
                grade: temp[0].grade,
                section: temp[0].section,
                visitDate: temp[0].visitDate,
                nurseKey: temp[0].nurseKey,
                attendingNurse: temp[0].attendingNurse,
                timeIn: temp[0].timeIn,
                timeOut: temp[0].timeOut,
                visitType: temp[0].visitType,
                weight: temp[0].weight,
                weightStatus: temp[0].weightStatus,
                height: temp[0].height,
                heightStatus: temp[0].heightStatus,
                bodyTemp: temp[0].bodyTemp,
                bodyTempStatus: temp[0].bodyTempStatus,
                systolicBP: temp[0].systolicBP,
                systolicStatus: temp[0].systolicStatus,
                diastolicBP: temp[0].diastolicBP,
                diastolicStatus: temp[0].diastolicStatus,
                pulseRate: temp[0].pulseRate,
                pulseRateStatus: temp[0].pulseRateStatus,
                respirationRate: temp[0].respirationRate,
                respRateStatus: temp[0].respRateStatus,
                visitReason: temp[0].visitReason,
                impression: temp[0].impression,
                treatment: temp[0].treatment,
                treatment: temp[0].treatment,
                diagnosisAssignedKey: temp[0].diagnosisAssignedKey,
                diagnosisAssigned: dFname + " " + dLname,
                diagnosis: temp[0].diagnosis,
                prescribedBy: dFname + " " + dLname,
                medicationAssignedKey: temp[0].medicationAssignedKey,
                medicationAssigned: mFname + " " + mLname,
                medications: medications,
                diagnosis: temp[0].diagnosis,
                status: temp[0].status,
                notes: temp[0].notes
            }
            console.log(details);
            resolve(details);
        })
    })
    return promise;
};

exports.getStudentVisits = function(req, res){
    var student = req.query.studentID;
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    var userRef = database.ref("clinicUsers");
    var temp = [], details = [];
    var childSnapshotData, i;

    clinicVisitRef.orderByChild("id").equalTo(student).on('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                temp.push({
                    idNum: childSnapshotData.id,
                    studentName: childSnapshotData.studentName,
                    grade: childSnapshotData.grade,
                    section: childSnapshotData.section,
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
                })
            })

            for(i = 0;  i < temp.length; i++){
                await userRef.child(temp[i].attendingNurse).once('value',(userSnapshot) => {
                    fname = userSnapshot.child('firstName').val();
                    lname = userSnapshot.child('lastName').val();
                    details.push({
                        idNum: temp[i].idNum,
                        studentName: temp[i].studentName,
                        grade: temp[i].grade,
                        section: temp[i].section,
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
            res.status(200).send(details);
        } else {
            console.log("details in controller");
            console.log(details);
            res.status(200).send(details);
        }
    })  
};

exports.getLastVisit = function(req, res){
    var student = req.query.studentID;
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    var userRef = database.ref("clinicUsers");
    var temp = [], details;
    var childSnapshotData;

    clinicVisitRef.orderByChild("id").equalTo(student).on('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                temp.push({
                    idNum: childSnapshotData.id,
                    studentName: childSnapshotData.studentName,
                    grade: childSnapshotData.grade,
                    section: childSnapshotData.section,
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
                })
            })
            
            if(temp.length == 1){   // if once lang siya nagpunta sa clinic dati
                await userRef.child(temp[0].attendingNurse).once('value',(userSnapshot) => {
                    fname = userSnapshot.child('firstName').val();
                    lname = userSnapshot.child('lastName').val();
                    details = {
                        idNum: temp[0].idNum,
                        studentName: temp[0].studentName,
                        grade: temp[0].grade,
                        section: temp[0].section,
                        visitDate: temp[0].visitDate,
                        attendingNurse: fname + " " + lname,
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
                });   
                res.status(200).send(details);
            } else {    // if multiple times siya pumunta sa clinic but getting the lastest visit details only   
                await userRef.child(temp[temp.length-1].attendingNurse).once('value',(userSnapshot) => {
                    fname = userSnapshot.child('firstName').val();
                    lname = userSnapshot.child('lastName').val();
                    details = {
                        idNum: temp[temp.length-1].idNum,
                        studentName: temp[temp.length-1].studentName,
                        grade: temp[temp.length-1].grade,
                        section: temp[temp.length-1].section,
                        visitDate: temp[temp.length-1].visitDate,
                        attendingNurse: fname + " " + lname,
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
                });   
                res.status(200).send(details);
            }
        } else {
            res.status(200).send(details);
        }
    })  
};

// This function is called in clinic-visit-create
exports.getVisitDetails = function(req, res){
    var student = req.query.studentID;
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    var userRef = database.ref("clinicUsers");
    var studentRef = database.ref("studentInfo/"+ student);
    var historyRef = database.ref("intakeHistory");
    var medicineRef = database.ref("studentHealthHistory/"+student+"/allowedMedicines");
    var inventoryRef = database.ref("medicineInventory");
    var temp = [], invTemp = [], visits = [], intakeMedications = [], intakeHistory = [], notAllowed = [], filtered = [];
    var snapshotData, childSnapshotData;
    var studentInfo, lastVisitDetails;

    clinicVisitRef.orderByChild("id").equalTo(student).on('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                visits.push({
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
                    treatment: childSnapshotData.treatment,
                    diagnosis: childSnapshotData.diagnosis,
                    status: childSnapshotData.status,
                    notes: childSnapshotData.notes,
                })
            })
            
            // getting last visit of the student
            if(visits.length == 1){
                lastVisitDetails = {
                    idNum: visits[0].idNum,
                    studentName: visits[0].studentName,
                    grade: visits[0].grade,
                    section: visits[0].section,
                    visitDate: visits[0].visitDate,
                    attendingNurse: visits[0].attendingNurse,
                    timeIn: visits[0].timeIn,
                    timeOut: visits[0].timeOut,
                    weight: visits[0].weight,
                    height: visits[0].height,
                    bodyTemp: visits[0].bodyTemp,
                    systolicBP: visits[0].systolicBP,
                    diastolicBP: visits[0].diastolicBP,
                    pulseRate: visits[0].pulseRate,
                    respirationRate: visits[0].respirationRate,
                    visitReason: visits[0].visitReason,
                    treatment: visits[0].treatment,
                    diagnosis: visits[0].diagnosis,
                    status: visits[0].status,
                    notes: visits[0].notes
                }
            } else {    // if multiple times siya pumunta sa clinic but getting the lastest visit details only   
                lastVisitDetails = {
                    idNum: visits[visits.length-1].idNum,
                    studentName: visits[visits.length-1].studentName,
                    grade: visits[visits.length-1].grade,
                    section: visits[visits.length-1].section,
                    visitDate: visits[visits.length-1].visitDate,
                    attendingNurse: visits[visits.length-1].attendingNurse,
                    timeIn: visits[visits.length-1].timeIn,
                    timeOut: visits[visits.length-1].timeOut,
                    weight: visits[visits.length-1].weight,
                    height: visits[visits.length-1].height,
                    bodyTemp: visits[visits.length-1].bodyTemp,
                    systolicBP: visits[visits.length-1].systolicBP,
                    diastolicBP: visits[visits.length-1].diastolicBP,
                    pulseRate: visits[visits.length-1].pulseRate,
                    respirationRate: visits[visits.length-1].respirationRate,
                    visitReason: visits[visits.length-1].visitReason,
                    treatment: visits[visits.length-1].treatment,
                    diagnosis: visits[visits.length-1].diagnosis,
                    status: visits[visits.length-1].status,
                    notes: visits[visits.length-1].notes
                }  
            }
        } else {
            lastVisitDetails = "";
        }
    })  

    historyRef.orderByChild("id").equalTo(student).on('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                childSnapshot.child("medications").forEach(function(innerChild){
                    innerChildData = innerChild.exportVal();
                    intakeMedications.push({
                        medicine: innerChildData.medicine,
                        amount: innerChildData.amount,
                        time: innerChildData.time
                    })
                })
                
                intakeHistory.push({
                    visitDate: childSnapshotData.visitDate,
                    attendingNurse: childSnapshotData.attendingNurse,
                    timeIn: childSnapshotData.timeIn,
                    timeOut: childSnapshotData.timeOut,
                    medications: intakeMedications
                });
            });
        } else {
            history = [];
        }
    })

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
        } else {
            notAllowed = [];
        }
    })

    // databaseRef.once('value', (snapshot) => {
    //     if(snapshot.hasChild("medicineInventory")){
    //         inventoryRef.on('value',async (childSnapshot) => {
    //             await childSnapshot.forEach(function(innerChildSnapshot){
    //                 childSnapshotData = innerChildSnapshot.exportVal();
    //                 invTemp.push({
    //                     medicine: childSnapshotData.medicine,
    //                     name: childSnapshotData.name,
    //                     dosageForm: childSnapshotData.dosageForm,
    //                     strength: childSnapshotData.strength,
    //                 })
    //             })

    //             await invTemp.forEach(med => {
    //                 var found = false;
    //                 for(i = 0; i < filtered.length; i++){
    //                     if(med.medicine == filtered[i].medicine){   // filters if same medicine name
    //                         found = true;
    //                         break;
    //                     } 
    //                 }
    //                 if(!found){
    //                     filtered.push({
    //                         medicine: med.medicine,
    //                         name: med.name,
    //                         dosageForm: med.dosageForm,
    //                         strength: med.strength
    //                     })
    //                 }    
    //             })
    //         })
    //     } else {
    //         filtered = [];
    //     }
    // })

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
        } else {
            studentInfo = "";
        }
        res.status(200).send({
            studentInfo: studentInfo,
            lastVisitDetails: lastVisitDetails,
            visits: visits,
            intakeHistory: intakeHistory,
            notAllowed: notAllowed,
        });
    })
};

exports.getClinicVisits = function(){
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timestamp");
    var visits =[];
    var childSnapshotData;

    var promise = new Promise((resolve, reject) => {
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("clinicVisit")){
                query.on('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
                        visits.push({
                            formId: innerChildSnapshot.key,
                            studentName: childSnapshotData.studentName,
                            complaint: childSnapshotData.visitReason,
                            timeIn: childSnapshotData.timeIn,
                            timeOut: childSnapshotData.timeOut,
                            status: childSnapshotData.status,
                            visitDate: childSnapshotData.visitDate
                        })         
                    })
                    resolve(visits);
                })
            }
            else {
                resolve(visits);
            }
        })
    })
    return promise;
};

exports.addMedicationIntake = function(req, res){
    var { studentId, studentName , studentGrade, studentSection, 
        visitDate, timeIn, timeOut, nurse, medicationsArray } = req.body;

    var i, key;
    var time = Math.round(+new Date()/1000);

    var database = firebase.database();
    var intakeRef = database.ref("intakeHistory");

    var record = {
        id: studentId, 
        studentName: studentName,
        grade: studentGrade,
        section: studentSection,
        visitDate: visitDate,
        timestamp: time,
        timeIn: timeIn,
        timeOut: timeOut,
        attendingNurse: nurse,
        medications: "", // array of medications
    };

    key = intakeRef.push(record).key;

    for(i = 0; i < medicationsArray.length; i++){
        medication = {
            medicineName: medicationsArray[i].medication,
            medicine: medicationsArray[i].med,
            amount: parseInt(medicationsArray[i].amount),
            time: medicationsArray[i].time
        };
        database.ref('intakeHistory/' + key + '/medications').push(medication);
    }
    
    res.status(200).send();
};

exports.addIncidenceReport = function(req, res){
    var { incidentDate, incidentTime, reportedBy, studentId, studentName , studentGrade, studentSection, 
        doseOmission, doseDelay, ineffectiveDose, drugInteraction, drugAllergy, noStock, expiredStock,
        description, consequences, action, care, notes } = req.body;

    var time = Math.round(+new Date()/1000);

    var database = firebase.database();
    var incidenceRef = database.ref("incidenceReport");

    var record = {
        incidentDate: incidentDate,
        incidentTime: incidentTime,
        reportedBy: reportedBy,
        id: studentId, 
        studentName: studentName,
        grade: studentGrade,
        section: studentSection,
        timestamp: time,
        
        doseOmission: doseOmission,
        doseDelay: doseDelay,
        ineffectiveDose: ineffectiveDose,
        drugInteraction: drugInteraction,
        drugAllergy: drugAllergy,
        noStock: noStock,
        expiredStock: expiredStock,
        
        description: description,
        consequences: consequences,
        action: action,
        care: care,
        notes: notes
    };

    incidenceRef.push(record);
    res.status(200).send();
};

exports.getIncidenceList = function(req, res){
    var database = firebase.database();
    var databaseRef = database.ref();
    var incidenceRef = database.ref("incidenceReport");
    var query = incidenceRef.orderByChild("timestamp");
    var childSnapshotData, reports =[];

    var promise = new Promise((resolve, reject) => {
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("incidenceReport")){
                query.on('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal(); 
                        reports.push({
                            reportId: innerChildSnapshot.key,
                            incidentDate: childSnapshotData.incidentDate,
                            incidentTime: childSnapshotData.incidentTime,
                            reportedBy: childSnapshotData.reportedBy,
                            studentName: childSnapshotData.studentName,
                        })         
                    })
                    console.log(reports);
                    resolve(reports);
                })
            }
            else {
                resolve(reports);
            }
        })
    })
    return promise;
}

exports.viewIncidenceReport = function(req){
    var reportId = req.params.id;
    var database = firebase.database();
    var incidenceRef = database.ref("incidenceReport/"+reportId);
    var details;
    var snapshotData;

    var promise = new Promise((resolve, reject) => {
        incidenceRef.once('value', (snapshot) => {
            snapshotData = snapshot.exportVal();
            details = {
                incidentDate: snapshotData.incidentDate,
                incidentTime: snapshotData.incidentTime,
                reportedBy: snapshotData.reportedBy,
                id: snapshotData.id,
                studentName: snapshotData.studentName,
                grade: snapshotData.grade,
                section: snapshotData.section,

                doseOmission: snapshotData.doseOmission,
                doseDelay: snapshotData.doseDelay,
                ineffectiveDose: snapshotData.ineffectiveDose,
                drugInteraction: snapshotData.drugInteraction,
                drugAllergy: snapshotData.drugAllergy,
                noStock: snapshotData.noStock,
                expiredStock: snapshotData.expiredStock,
                
                description: snapshotData.description,
                consequences: snapshotData.consequences,
                action: snapshotData.action,
                care: snapshotData.care,
                notes: snapshotData.notes
            }
            resolve(details);
        })
    })
    return promise;
};

exports.getAllVisits = function(req,res){
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timestamp");
    var visits =[];
    var childSnapshotData;

    
    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("clinicVisit")){
            query.on('value', (childSnapshot) => {
                childSnapshot.forEach(function(innerChildSnapshot){
                    childSnapshotData = innerChildSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
                    visits.push({
                        formId: innerChildSnapshot.key,
                        studentName: childSnapshotData.studentName,
                        complaint: childSnapshotData.visitReason,
                        timeIn: childSnapshotData.timeIn,
                        timeOut: childSnapshotData.timeOut,
                        status: childSnapshotData.status,
                        visitDate: childSnapshotData.visitDate
                    })         
                })
            })
            res.send (visits);
        }
        else{
            res.send (visits);    
        }
    })
    
};