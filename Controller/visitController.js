const firebase = require('../firebase');
const firebaseStorage = require('firebase/storage');

exports.getDashboard = function(req, res){
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit"); 
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var visitCount = 0, sentClass = 0, hospitalized = 0; sentHome = 0;
    var childSnapshotData, dashboard; 

    var promise = new Promise((resolve, reject) => {
        clinicVisitRef.orderByChild("visitDate").equalTo(date).once('value', (snapshot) => { 
            snapshot.forEach(function(childSnapshot) {
                childSnapshotData = childSnapshot.exportVal();
                visitCount++;

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

exports.getComplaints = function(){
    var database = firebase.database();
    var databaseRef = database.ref();
    var complaintsRef = database.ref("complaintsList");
    var childSnapshotData, complaints = [];

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("complaintsList")){
                complaintsRef.once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        complaints.push({
                            complaint: childSnapshotData.complaint
                        })
                    })
                    console.log("complaints");
                    console.log(complaints);
                    resolve(complaints);
                })
            } else {
                resolve(complaints);
            }
        })
    });
    return promise;
};

exports.getDiagnosis = function(){
    var database = firebase.database();
    var databaseRef = database.ref();
    var diagnosisRef = database.ref("diagnosisList");
    var childSnapshotData, diagnosis = [];

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("diagnosisList")){
                diagnosisRef.once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        diagnosis.push({
                            diagnosis: childSnapshotData.diagnosis
                        })
                    })
                    // console.log("diagnosis");
                    // console.log(diagnosis);
                    resolve(diagnosis);
                })
            } else {
                resolve(diagnosis);
            }
        })
    });
    return promise;
};

exports.addClinicVisit = function(req, res){
    var { studentId, studentName , studentGrade, studentSection, visitDate, timeIn, timeOut, visitType, nurseKey, nurseName,
        weight, height, bmi, bodyTemp,  systolicBP,  diastolicBP, pulseRate, respirationRate, 
        weightStatus, heightStatus, bmiStatus, bodyTempStatus, systolicStatus, diastolicStatus, pulseRateStatus, respRateStatus,
        complaint, impression, treatment, 
        diagnosisAssign, diagnosis, prescribedBy, medicationsArray, intakeArray, notes, status } = req.body;

    var i, formId, complaintsTemp = [];
    var time = Math.round(+new Date()/1000);

    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    var prescriptionRef = database.ref("studentHealthHistory/"+studentId+"/prescriptionHistory");
    var complaintsRef = database.ref("complaintsList");
    
    try {
        var update = {
            height: height,
            heightStatus: heightStatus,
            weight: weight,
            weightStatus: weightStatus,
            bmi: bmi,
            bmiStatus: bmiStatus 
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
            visitType: visitType,
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

        var complaintArray = complaint.split(", ");
        var complaintsPush = [];
        complaintsPush.push("sample");

        complaintsRef.once('value', (complaintList) => {
            if(complaintList.exists()){
                complaintList.forEach(function(complaintsDB){
                    complaintsTemp.push(complaintsDB.child('complaint').val());
                })
                console.log("complaintsTemp");
                console.log(complaintsTemp);
                var found = 1;
                for(var i = 0; i < complaintsTemp.length; i++){ // [Headache]
                    for(var j = 0; j < complaintArray.length; j++){ // [Headche, Flu, Fever]
                        // [Headache]
                        // [Headache]
                        if(complaintsTemp[i].toLowerCase().localeCompare(complaintArray[j].toLowerCase()) == 0){
                            found = 0;
                        }
                        else {    
                            if(!complaintsTemp.includes(complaintArray[j]) && !complaintsPush.includes(complaintArray[j])){
                                console.log("pushing...");
                                console.log(complaintArray[j]);
                                complaintsPush.push(complaintArray[j]);
                            }                          
                        }
                    }
                }
                for(var k = 1; k < complaintsPush.length; k++){
                    complaintsRef.push({
                        complaint: complaintsPush[k]
                    });
                }
            } else{
                for(var j = 0; j < complaintArray.length; j++){
                    complaintsRef.push({
                        complaint: complaintArray[j]
                    });
                }
            }
        })
    
        formId = clinicVisitRef.push(record).key;  
        if(medicationsArray != undefined){
            for(i = 0; i < medicationsArray.length; i++){
                prescription = {
                    medicine: medicationsArray[i].medication,
                    purpose: medicationsArray[i].purpose,
                    amount: medicationsArray[i].amount,
                    interval: medicationsArray[i].interval,
                    startMed: medicationsArray[i].startMed,
                    endMed: medicationsArray[i].endMed,
                    prescribedBy: prescribedBy,
                    status: "From clinic"
                };
                database.ref('clinicVisit/' + formId + '/prescription').push(prescription);
                prescriptionRef.push(prescription);
            }
        }
    
        //if intake array is not empty!
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
            var historyRef = database.ref("studentHealthHistory/"+studentId+"/intakeHistory/");

            for(i = 0; i < intakeArray.length; i++){
                history = {
                    medicineName: intakeArray[i].medication,
                    specificMedicine: intakeArray[i].med,
                    specificAmount: intakeArray[i].amount,
                    time: intakeArray[i].time
                };

                healthHistoryIntake = {
                    specificMedicine: intakeArray[i].med,
                    specificAmount: intakeArray[i].amount,
                    time: intakeArray[i].time,
                    dateTaken: visitDate
                }
                database.ref('intakeHistory/' + historyKey + '/medications').push(history);
                historyRef.push(healthHistoryIntake);
            }

            var parentRef = database.ref("parentInfo");
            parentRef.once('value', (snapshot) => {
                snapshot.forEach(function(parent){
                    parent.child('children').forEach(function(children){
                        if(children.val() == studentId){
                            var parentNotification = database.ref("notifications/"+parent.key+"/"+studentId);
                            var notif = {
                                message: "Your child, " + studentName + ", visited the clinic and was given a medication.",
                                timeIn: timeIn,
                                date: visitDate, 
                            }
                            parentNotification.push(notif);
                        }
                    })
                })
            })
        } else {
            var parentRef = database.ref("parentInfo");
            parentRef.once('value', (snapshot) => {
                snapshot.forEach(function(parent){
                    parent.child('children').forEach(function(children){
                        if(children.val() == studentId){
                            var parentNotification = database.ref("notifications/"+parent.key+"/"+studentId);
                            var notif = {
                                message: "Your child, " + studentName + ", visited the clinic.",
                                timeIn: timeIn,
                                date: visitDate, 
                            }
                            parentNotification.push(notif);
                        }
                    })
                })
            })
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

        //needed as ajax was used to send data
        res.status(200).send();
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.editClinicVisit = function(req, res){
    var { userKey, userName, formId, studentId, studentName, studentGrade, studentSection, 
        visitDate, timeIn, timeOut, diagnosis, 
        medicationAssign, medicationsArray, intakeArray, status, notes } = req.body;
    var i;
    
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit/"+formId);
    var userRef = database.ref("clinicUsers/"+userKey);
    var prescriptionRef = database.ref("studentHealthHistory/"+studentId+"/prescriptionHistory");
    var diagnosisRef = database.ref("diagnosisList");
    var diagnosisTemp = [];
    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = Math.round(+new Date()/1000);

    userRef.once("value", (userSnapshot) => { 
        if(userSnapshot.child("role").val() == "Clinician"){
            console.log("pumasok sa clinician if");
            var record = {
                timeOut: timeOut,
                diagnosis: diagnosis,
                status: status,
                notes: notes,
            };

            clinicVisitRef.update(record);
            diagnosisRef.once('value', (diagnosisList) => {
                if(diagnosisList.exists()){
                    diagnosisList.forEach(function(diagnosisDB){
                        diagnosisTemp.push(diagnosisDB.child('diagnosis').val());
                    })
                    var found = 1;
                    for(var i = 0; i < diagnosisTemp; i++){
                        if(diagnosis.localeCompare() != 0){
                            found = 0;
                        }   
                    }
                    if(found == 1){
                        diagnosisRef.push({
                            diagnosis: diagnosis
                        });
                    }
                } else{
                    diagnosisRef.push({
                        diagnosis: diagnosis
                    });
                }
            })

            if(medicationAssign == ""){ // meaning clinician is the one inputting the medication section
                console.log("pumasok pag wlang medication assigned");

                for(i = 0; i < medicationsArray.length; i++){
                    prescription = {
                        medicine: medicationsArray[i].medication,
                        purpose: medicationsArray[i].purpose,
                        amount: medicationsArray[i].amount,
                        interval: medicationsArray[i].interval,
                        startMed: medicationsArray[i].startMed,
                        endMed: medicationsArray[i].endMed,
                        status: "From clinic"
                    };
                    database.ref('clinicVisit/' + formId + '/prescription').push(prescription);
                    prescriptionRef.push(prescription);
                }

                //if intake array is not empty!
                if(intakeArray != undefined){
                    console.log("intakeArray in visitcontroller");
                    console.log(intakeArray);
                    
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
                    var historyRef = database.ref("studentHealthHistory/"+studentId+"/intakeHistory/");

                    for(i = 0; i < intakeArray.length; i++){
                        history = {
                            medicineName: intakeArray[i].medication,
                            specificMedicine: intakeArray[i].med,
                            specificAmount: intakeArray[i].amount,
                            amount: parseFloat(intakeArray[i].amount),
                            time: intakeArray[i].time
                        };

                        healthHistoryIntake = {
                            specificMedicine: intakeArray[i].med,
                            specificAmount: intakeArray[i].amount,
                            time: intakeArray[i].time,
                            dateTaken: visitDate
                        }
                        database.ref('intakeHistory/' + historyKey + '/medications').push(history);
                        historyRef.push(healthHistoryIntake);
                    }
                }

                // -----------REMOVING ASSIGNED FORM & NOTIF FOR CLINICIAN--------------
                // var formRef = database.ref("assignedForms/"+ userKey);
                // formRef.once('value', (snapshot) => { 
                //     snapshot.forEach(function(childSnapshot) {
                //         if(childSnapshot.key == formId){
                //             database.ref("assignedForms/"+ userKey + "/" + formId).remove();
                //             database.ref("notifications/"+ userKey + "/" + formId).remove();
                //         }
                //     });
                // })
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
                formRef.once('value', (snapshot) => { 
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
            console.log("pumasok sa nurse if");
            var record = {
                timeOut: timeOut,
                status: status,
            };
        
            clinicVisitRef.update(record);

            for(i = 0; i < medicationsArray.length; i++){
                prescription = {
                    medicine: medicationsArray[i].medication,
                    purpose: medicationsArray[i].purpose,
                    amount: medicationsArray[i].amount,
                    interval: medicationsArray[i].interval,
                    startMed: medicationsArray[i].startMed,
                    endMed: medicationsArray[i].endMed,
                    status: "From clinic"
                };
                database.ref('clinicVisit/' + formId + '/prescription').push(prescription);
                prescriptionRef.push(prescription);
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
                var historyRef = database.ref("studentHealthHistory/"+studentId+"/intakeHistory/");

                for(i = 0; i < intakeArray.length; i++){
                    history = {
                        medicineName: intakeArray[i].medication,
                        specificMedicine: intakeArray[i].med,
                        specificAmount: intakeArray[i].amount,
                        amount: parseFloat(intakeArray[i].amount),
                        time: intakeArray[i].time
                    };

                    healthHistoryIntake = {
                        specificMedicine: intakeArray[i].med,
                        specificAmount: intakeArray[i].amount,
                        time: intakeArray[i].time,
                        dateTaken: visitDate
                    }
                    database.ref('intakeHistory/' + historyKey + '/medications').push(history);
                    historyRef.push(healthHistoryIntake);
                }
            }

            // -----------REMOVING ASSIGNED FORM & NOTIF FOR NURSE--------------
            var formRef = database.ref("assignedForms/"+ userKey);
            formRef.once('value', (snapshot) => { 
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
        formsRef.orderByChild("timestamp").once('value', async (snapshot) => {
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
        formRef.once('value', async (snapshot) => {
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

                prescribedBy: snapshotData.prescribedBy,
                medicationAssignedKey: snapshotData.medicationAssigned,
                status: snapshotData.status,
                notes: snapshotData.notes
            })

            if(temp[0].diagnosisAssignedKey != ""){
                await userRef.child(temp[0].diagnosisAssignedKey).once('value', (diagnosis) => {
                    dFname = diagnosis.child('firstName').val();
                    dLname = diagnosis.child('lastName').val();
                });
            }

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
                diagnosisAssignedKey: temp[0].diagnosisAssignedKey,
                diagnosisAssigned: dFname + " " + dLname,
                diagnosis: temp[0].diagnosis,
                prescribedBy: temp[0].prescribedBy,
                medicationAssignedKey: temp[0].medicationAssignedKey,
                medicationAssigned: mFname + " " + mLname,
                status: temp[0].status,
                notes: temp[0].notes
            }
            console.log("details in controller");
            console.log(details);
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
        formRef.once('value', async (snapshot) => {
            snapshotData = snapshot.exportVal();
            snapshot.child('prescription').forEach(function(meds){
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

                prescribedBy: snapshotData.prescribedBy,
                medicationAssignedKey: snapshotData.medicationAssigned,
                status: snapshotData.status,
                notes: snapshotData.notes
            })  

            if(temp[0].diagnosisAssignedKey != ""){
                await userRef.child(temp[0].diagnosisAssignedKey).once('value', (diagnosis) => {
                    dFname = diagnosis.child('firstName').val();
                    dLname = diagnosis.child('lastName').val();
                });
            }
            
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
                prescribedBy: temp[0].prescribedBy,
                medicationAssignedKey: temp[0].medicationAssignedKey,
                medicationAssigned: mFname + " " + mLname,
                medications: medications,
                diagnosis: temp[0].diagnosis,
                status: temp[0].status,
                notes: temp[0].notes
            }
            resolve(details);
        })
    })
    return promise;
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
                query.once('value', (childSnapshot) => {
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

exports.getAllVisits = function(req,res){
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timestamp");
    var visits =[];
    var childSnapshotData;
    
    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("clinicVisit")){
            query.once('value', (childSnapshot) => {
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
                query.once('value', (childSnapshot) => {
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
                    resolve(reports);
                })
            }
            else {
                resolve(reports);
            }
        })
    })
    return promise;
};

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

exports.getIncidenceCount = function(req, res){
    var start = req.query.start;
    var startDate = new Date(start);
    var end = req.query.end;
    var endDate = new Date(end);
    var yearMonthDate = [], newDate;
    
    var database = firebase.database();
    var databaseRef = database.ref();
    var incidenceRef = database.ref("incidenceReport");
    var query = incidenceRef.orderByChild("timestamp");
    var i, childSnapshotData, temp = [], reports =[];
    var omissionCount = 0, delayCount = 0, ineffectiveCount = 0, interactionCount = 0, allergyCount = 0, noStockCount = 0, expiredCount = 0; 

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("incidenceReport")){
            query.once('value', (childSnapshot) => {
                childSnapshot.forEach(function(innerChildSnapshot){
                    childSnapshotData = innerChildSnapshot.exportVal(); 
                    temp.push({
                        incidentDate: childSnapshotData.incidentDate,
                        doseOmission: childSnapshotData.doseOmission,
                        doseDelay: childSnapshotData.doseDelay,
                        ineffectiveDose: childSnapshotData.ineffectiveDose,
                        drugInteraction: childSnapshotData.drugInteraction,
                        drugAllergy: childSnapshotData.drugAllergy,
                        noStock: childSnapshotData.noStock,
                        expiredStock: childSnapshotData.expiredStock,
                    })         
                })

                for(i = 0; i < temp.length; i++){
                    yearMonthDate = temp[i].incidentDate.split("-"); // 2021-01-03    2021 01 03
                    newDate = new Date(yearMonthDate[0], yearMonthDate[1]-1, yearMonthDate[2]);   // year, month, day

                    if(startDate <= newDate && newDate <= endDate){
                        if(temp[i].doseOmission == "true"){
                            omissionCount++;
                        }
                        if(temp[i].doseDelay == "true"){
                            delayCount++;
                        }
                        if(temp[i].ineffectiveDose == "true"){
                            ineffectiveCount++;
                        }
                        if(temp[i].drugInteraction == "true"){
                            interactionCount++;
                        }
                        if(temp[i].drugAllergy == "true"){
                            allergyCount++;
                        }
                        if(temp[i].noStock == "true"){
                            noStockCount++;
                        }
                        if(temp[i].expiredStock == "true"){
                            expiredCount++;
                        }
                    }
                }

                res.status(200).send({
                    omissionCount: omissionCount,
                    delayCount: delayCount,
                    ineffectiveCount: ineffectiveCount,
                    interactionCount: interactionCount,
                    allergyCount: allergyCount,
                    noStockCount: noStockCount,
                    expiredCount: expiredCount
                });
            })
        }
        else {
            res.status(200).send({
                omissionCount: omissionCount,
                delayCount: delayCount,
                ineffectiveCount: ineffectiveCount,
                interactionCount: interactionCount,
                allergyCount: allergyCount,
                noStockCount: noStockCount,
                expiredCount: expiredCount
            });
        }
    })
};

exports.addReferral = function(req, res){
    var { studentId, studentName , studentGrade, studentSection, birthday, gender, age,
        specialty, physician, reason, diagnosis, icd10, urgent, specialist, testing,
        provider, title, position, signature, signatureFileName, fileType } = req.body;
        console.log("studentId in controller");
        console.log(studentId);
        console.log("position in controller");
        console.log(position);
        console.log("signature in controller");
        console.log(signature);
        console.log("signatureFileName in controller");
        console.log(signatureFileName);
        console.log("fileType in controller");
        console.log(fileType);
    var storageRef = firebase.storage().ref();
    var metadata = {
        contentType: fileType,
    };
    var uploadTask = storageRef.child('files/signatures/'+signatureFileName).put(signature, metadata);
    var fileUrl;
    var database = firebase.database();
    var referralRef = database.ref("referralForms");

    console.log("pumasok sa controller");

    uploadTask.snapshot.ref.getDownloadURL().then(function(url){
        fileUrl = url;
    })
    console.log("fileUrl in controller");
    console.log(fileUrl);
    // uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
    // .then(url => {
    //     console.log('File available at', url);
    // });

    var record = {
        studentId: studentId,
        studentName: studentName,
        grade: studentGrade,
        section: studentSection,
        birthday: birthday,
        gender: gender,
        age: age,
        
        specialty: specialty,
        physician: physician,
        reason: reason,
        diagnosis: diagnosis,
        icd10: icd10,
        urgent: urgent,
        specialist: specialist,
        testing: testing,
        
        provider: provider,
        title: title,
        position: position,
        signature: fileUrl
    };

    referralRef.push(record);
    res.status(200).send();
};