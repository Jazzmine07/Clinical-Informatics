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
                console.log
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

exports.addClinicVisit = function(req, res){
    var { studentId, studentName , studentGrade, studentSection, visitDate, timeIn, timeOut, clinicType, nurse, 
        weight, weightStatus, height, heightStatus, bodyTemp, bodyTempStatus, systolicBP, systolicStatus, diastolicBP, diastolicStatus, 
        pulseRate, pulseRateStatus, respirationRate, respRateStatus, complaint, impression, treatment,
        diagnosisAssign, diagnosis, prescribedBy, medicationsArray, intakeArray, notes, status } = req.body;

    var i, key;
    var time = Math.round(+new Date()/1000);

    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    var studentRef = database.ref("studentInfo/"+ studentId);

    var record = {
        id: studentId, 
        studentName: studentName,
        grade: studentGrade,
        section: studentSection,
        visitDate: visitDate,
        timestamp: time,
        timeIn: timeIn,
        timeout: timeOut,
        clinicType: clinicType,
        attendingNurse: nurse,

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

        //medicationAssigned: medicationAssign,
        prescribedBy: prescribedBy,
        medications: "", // array of medications

        status: status,
        notes: notes,
    };

    key = clinicVisitRef.push(record).key;
    studentRef.child('weight').set(weight);
    studentRef.child('height').set(height);

    for(i = 0; i < medicationsArray.length; i++){
        medication = {
            medicine: medicationsArray[i].medication,
            purpose: medicationsArray[i].purpose,
            amount: parseInt(medicationsArray[i].amount),
            interval: medicationsArray[i].interval,
            startMed: medicationsArray[i].startMed,
            endMed: medicationsArray[i].endMed
        };
        database.ref('clinicVisit/' + key + '/medication').push(medication);
    }

    // if intake array is not empty!
    if(intakeArray.length != 0){
        var intakeHistory = {
            id: studentId, 
            studentName: studentName,
            grade: studentGrade,
            section: studentSection,
            visitDate: visitDate,
            timestamp: time,
            timeIn: timeIn,
            timeout: timeOut,
            attendingNurse: nurse,
            medications: "", // array of medications
        }
    
        var intakeRef = database.ref("intakeHistory");
        var historyKey = intakeRef.push(intakeHistory).key;

        for(i = 0; i < intakeArray.length; i++){
            history = {
                medicine: medicationsArray[i].medication,
                amount: parseInt(medicationsArray[i].amount),
                time: medicationsArray[i].time
            };
            database.ref('intakeHistory/' + historyKey + '/medications').push(history);
        }
    }

    var assignDiagnosis = database.ref("assignedForms/"+diagnosisAssign);
    var diagnosisForm = {
        task: "Clinic Visit",
        description: "Diagnosis & Prescription",
        formId: key,
        assignedBy: nurse,
        dateAssigned: visitDate,
        timestamp: time
    }

    var userDiagnosisNotification = database.ref("notifications/"+diagnosisAssign+"/"+key);
    var notif = {
        type: "form",
        formId: key,
        message: "You have been assigned to a new form!",
        date: visitDate,
        timestamp: time,
        seen: false
    }

    assignDiagnosis.push(diagnosisForm);
    userDiagnosisNotification.push(notif);
   
    // needed as ajax was used to send data
    res.status(200).send();
};

exports.editClinicVisit = function(req, res){
    var { userKey , formId, 
        studentId, studentName , studentGrade, studentSection, visitDate, timeStamp, timeIn, timeOut, nurse, 
        bodyTemp, systolicBP, diastolicBP, pulseRate, respirationRate, complaint, treatment,
        medicationAssigned, prescribedBy, medicationList, purposeList, amountList, intervalList, startMedList, endMedList,
        diagnosisAssigned, diagnosis, notes, status } = req.body;
    var i,formKey;
    
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit/"+formId);
    var record = {
        id: studentId, 
        studentName: studentName,
        grade: studentGrade,
        section: studentSection,
        visitDate: visitDate,
        timestamp: timeStamp,
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
        diagnosisAssigned: diagnosisAssigned,
        diagnosis: diagnosis,
        ////medicationAssigned: medicationAssigned,
        //medicationPrescribed: prescribedBy,
        medication: "", // array of medications
        status: status,
        notes: notes,
    };

    clinicVisitRef.set(record);

    // for(i = 0; i < medicationList.length; i++){
    //     // left side is the field name in firebase
    //     medication = {
    //         medicines: medicationList[i],
    //         purpose: purposeList[i],
    //         amount: amountList[i],
    //         interval: intervalList[i]
    //         startDate: startMedList[i],
    //         endDate: endMedList[i]
    //     };
    //     //database.ref('clinicVisit/"+ formId + '/medication').update(medication);
    // }

    //var assignMedication = database.ref("assignedForms/"+medicationAssign);
    // var medicationForm = {
    //     task: "Clinic Visit",
    //     description: "Encode Medication",
    //     formId: key,
    //     assignedBy: clinician,
    //     dateAssigned: visitDate,
    //     timestamp: time
    // }
    //assignMedication.push(medicationForm);
    
    var formRef = database.ref("assignedForms/"+ userKey);
    formRef.orderByChild("formId").equalTo(formId).on('value', (snapshot) => { 
        snapshot.forEach(function(childSnapshot) {
            formKey = childSnapshot.key;
        });
    })

    database.ref("assignedForms/"+ userKey + "/" + formKey).remove();
    database.ref("notifications/"+ userKey + "/" + formId).remove();
    
    res.status(200).send();
};

exports.getStudentVisits = function(req, res){
    var student = req.body.studentID;
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
            res.status(200).send(details);
        }
    })  
};

// exports.getLastVisit = function(req, res){
//     var student = req.body.studentID;
//     var database = firebase.database();
//     var clinicVisitRef = database.ref("clinicVisit");
//     var userRef = database.ref("clinicUsers");
//     var temp = [], details;
//     var childSnapshotData;

//     clinicVisitRef.orderByChild("id").equalTo(student).on('value', async (snapshot) => {
//         if(snapshot.exists()){
//             snapshot.forEach(function(childSnapshot){
//                 childSnapshotData = childSnapshot.exportVal();
//                 temp.push({
//                     idNum: childSnapshotData.id,
//                     studentName: childSnapshotData.studentName,
//                     grade: childSnapshotData.grade,
//                     section: childSnapshotData.section,
//                     visitDate: childSnapshotData.visitDate,
//                     attendingNurse: childSnapshotData.attendingNurse,
//                     timeIn: childSnapshotData.timeIn,
//                     timeOut: childSnapshotData.timeOut,
//                     weight: childSnapshotData.weight,
//                     height: childSnapshotData.height,
//                     bodyTemp: childSnapshotData.bodyTemp,
//                     systolicBP: childSnapshotData.systolicBP,
//                     diastolicBP: childSnapshotData.diastolicBP,
//                     pulseRate: childSnapshotData.pulseRate,
//                     respirationRate: childSnapshotData.respirationRate,
//                     visitReason: childSnapshotData.visitReason,
//                     treatment: childSnapshotData.treatment,
//                     diagnosis: childSnapshotData.diagnosis,
//                     status: childSnapshotData.status,
//                     notes: childSnapshotData.notes,
//                 })
//             })
            
//             if(temp.length == 1){   // if once lang siya nagpunta sa clinic dati
//                 await userRef.child(temp[0].attendingNurse).once('value',(userSnapshot) => {
//                     fname = userSnapshot.child('firstName').val();
//                     lname = userSnapshot.child('lastName').val();
//                     details = {
//                         idNum: temp[0].idNum,
//                         studentName: temp[0].studentName,
//                         grade: temp[0].grade,
//                         section: temp[0].section,
//                         visitDate: temp[0].visitDate,
//                         attendingNurse: fname + " " + lname,
//                         timeIn: temp[0].timeIn,
//                         timeOut: temp[0].timeOut,
//                         weight: temp[0].weight,
//                         height: temp[0].height,
//                         bodyTemp: temp[0].bodyTemp,
//                         systolicBP: temp[0].systolicBP,
//                         diastolicBP: temp[0].diastolicBP,
//                         pulseRate: temp[0].pulseRate,
//                         respirationRate: temp[0].respirationRate,
//                         visitReason: temp[0].visitReason,
//                         treatment: temp[0].treatment,
//                         diagnosis: temp[0].diagnosis,
//                         status: temp[0].status,
//                         notes: temp[0].notes
//                     }
//                 });   
//                 res.status(200).send(details);
//             } else {    // if multiple times siya pumunta sa clinic but getting the lastest visit details only   
//                 await userRef.child(temp[temp.length-1].attendingNurse).once('value',(userSnapshot) => {
//                     fname = userSnapshot.child('firstName').val();
//                     lname = userSnapshot.child('lastName').val();
//                     details = {
//                         idNum: temp[temp.length-1].idNum,
//                         studentName: temp[temp.length-1].studentName,
//                         grade: temp[temp.length-1].grade,
//                         section: temp[temp.length-1].section,
//                         visitDate: temp[temp.length-1].visitDate,
//                         attendingNurse: fname + " " + lname,
//                         timeIn: temp[temp.length-1].timeIn,
//                         timeOut: temp[temp.length-1].timeOut,
//                         weight: temp[temp.length-1].weight,
//                         height: temp[temp.length-1].height,
//                         bodyTemp: temp[temp.length-1].bodyTemp,
//                         systolicBP: temp[temp.length-1].systolicBP,
//                         diastolicBP: temp[temp.length-1].diastolicBP,
//                         pulseRate: temp[temp.length-1].pulseRate,
//                         respirationRate: temp[temp.length-1].respirationRate,
//                         visitReason: temp[temp.length-1].visitReason,
//                         treatment: temp[temp.length-1].treatment,
//                         diagnosis: temp[temp.length-1].diagnosis,
//                         status: temp[temp.length-1].status,
//                         notes: temp[temp.length-1].notes
//                     }
//                 });   
//                 res.status(200).send(details);
//             }
//         } else {
//             res.status(200).send(details);
//         }
//     })  
// };

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
                temp.push({
                    idNum: childSnapshotData.id,
                    studentName: childSnapshotData.studentName,
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

            // getting all the clinic visits of the student
            for(i = 0; i < temp.length; i++){
                userRef.child(temp[i].attendingNurse).once('value',(userSnapshot) => {
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

            // getting last visit of the student
            if(temp.length == 1){
                await userRef.child(temp[0].attendingNurse).once('value',(userSnapshot) => {
                    fname = userSnapshot.child('firstName').val();
                    lname = userSnapshot.child('lastName').val();
                    lastVisitDetails = {
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
            } else {    // if multiple times siya pumunta sa clinic but getting the lastest visit details only   
                await userRef.child(temp[temp.length-1].attendingNurse).once('value',(userSnapshot) => {
                    fname = userSnapshot.child('firstName').val();
                    lname = userSnapshot.child('lastName').val();
                    lastVisitDetails = {
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
            }
        } else {
            lastVisitDetails = [];
        }
    })  

    historyRef.orderByChild("id").equalTo(student).on('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                childSnapshot.child("medications").forEach(function(innerChild){
                    innerChildData = innerChild.exportVal();
                    console.log("innerchild");
                    console.log(innerChildData);
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
                    childSnapshot.forEach(function(innerChildSnapshot){                  // Getting primary keys of users
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

exports.getAssignedForms = (req, res) => {
    var user = req;
    var database = firebase.database();
    var formsRef = database.ref("assignedForms/"+user);
    var userRef = database.ref("clinicUsers");
    var fname, lname, i;
    var temp =[], forms =[];
    var childSnapshotData;
    
    var promise = new Promise((resolve, reject) => {
        formsRef.orderByChild("timestamp").on('value', async (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach(function(childSnapshot){
                    childSnapshotData = childSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
                    temp.push({
                        task: childSnapshotData.task,
                        description: childSnapshotData.description,
                        formId: childSnapshotData.formId,
                        assignedBy: childSnapshotData.assignedBy,
                        dateAssigned: childSnapshotData.dateAssigned
                    });
                })

                for(i = 0; i < temp.length; i++){
                    await userRef.child(temp[i].assignedBy).once('value',(userSnapshot) => {
                        fname = userSnapshot.child('firstName').val();
                        lname = userSnapshot.child('lastName').val();
                    });  
                    forms.push({
                        task: temp[i].task,
                        description: temp[i].description,
                        formId: temp[i].formId,
                        assignedBy: fname + " " + lname,
                        dateAssigned: temp[i].dateAssigned
                    });
                }
                resolve(forms);
            } else {
                resolve(forms);
            }
        })
    })
    return promise;
};

exports.getClinicVisitForm = function(req){
    var formId = req.params.id;
    var database = firebase.database();
    var formRef = database.ref("clinicVisit/"+formId);
    var userRef = database.ref("clinicUsers");
    var medication = [], temp = [], details;
    var childSnapshotData, fname, lname, dFname, dLname, mFname, mLname;
    var medicationAssigned, diagnosisAssigned, bothAssigned;

    var promise = new Promise((resolve, reject)=>{
        formRef.on('value', async (snapshot) => {
            snapshotData = snapshot.exportVal();
            // snapshot.child("medication").on('value', (childSnapshot) => {
            //     childSnapshot.forEach(function(data){
            //         childSnapshotData = data.exportVal();
            //         medication = {
            //             medicines: childSnapshotData.medicines,
            //             purpose: childSnapshotData.purpose,
            //             amount: childSnapshotData.amount,
            //             interval: childSnapshotData.interval,
            //             startDate: childSnapshotData.startDate,
            //             endDate: childSnapshotData.endDate,
            //         }
            //     })
            // })
            temp.push({
                formId: formId,
                id: snapshotData.id,
                studentName: snapshotData.studentName,
                grade: snapshotData.grade,
                section: snapshotData.section,
                visitDate: snapshotData.visitDate,
                timeIn: snapshotData.timeIn,
                timeOut: snapshotData.timeOut,
                clinicType: snapshotData.clinicType,
                nurseKey: snapshotData.attendingNurse,
                attendingNurse: "",
                
                weight: snapshotData.weight,
                weightStatus: snapshotData.weightStatus,
                height: snapshotData.height,
                heightStatus: snapshotData.heightStatus,
                bodyTemp: snapshotData.bodyTemp,
                systolicBP: snapshotData.systolicBP,
                diastolicBP: snapshotData.diastolicBP,
                pulseRate: snapshotData.pulseRate,
                respirationRate: snapshotData.respirationRate,

                visitReason: snapshotData.visitReason,
                impression: snapshotData.impression,
                treatment: snapshotData.treatment,

                diagnosisAssignedKey: snapshotData.diagnosisAssigned,
                diagnosis: snapshotData.diagnosis,

                prescribedBy: snapshotData.prescribedBy,
                status: snapshotData.status,
                notes: snapshotData.notes
            })

            if(temp.length == 1){   // if once lang siya nagpunta sa clinic dati
                await userRef.child(temp[0].nurseKey).once('value',(userSnapshot) => {
                    fname = userSnapshot.child('firstName').val();
                    lname = userSnapshot.child('lastName').val();
                });   
                await userRef.child(temp[0].diagnosisAssignedKey).once('value', (diagnosis) => {
                    dFname = diagnosis.child('firstName').val();
                    dLname = diagnosis.child('lastName').val();
                });

                details = {
                    formId: temp[0].formId,
                    id: temp[0].id,
                    studentName: temp[0].studentName,
                    grade: temp[0].grade,
                    section: temp[0].section,
                    visitDate: temp[0].visitDate,
                    nurseKey: temp[0].nurseKey,
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
                    diagnosisAssignedKey: temp[0].diagnosisAssignedKey,
                    diagnosisAssigned: dFname + " " + dLname,
                    diagnosis: temp[0].diagnosis,
                    status: temp[0].status,
                    notes: temp[0].notes
                }
                resolve(details);
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
        timeout: timeOut,
        attendingNurse: nurse,
        medications: "", // array of medications
    };

    key = intakeRef.push(record).key;

    for(i = 0; i < medicationsArray.length; i++){
        medication = {
            medicine: medicationsArray[i].medication,
            amount: parseInt(medicationsArray[i].amount),
            time: medicationsArray[i].time
        };
        database.ref('intakeHistory/' + key + '/medications').push(medication);
    }
    
    res.status(200).send();
};

