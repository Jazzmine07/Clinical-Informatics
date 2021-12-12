const firebase = require('../firebase');

exports.getStudent = function(req, res){
    var id = req.body.studentID;
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
    var { studentId, studentName , studentGrade, studentSection, visitDate, timeIn, timeOut, nurse, 
        bodyTemp, systolicBP, diastolicBP, pulseRate, respirationRate, complaint, treatment,
        medicationAssign, prescribedBy, medicineList, purposeList, amountList, intervalList, startMedList, endMedList,
        diagnosisAssign, diagnosis, notes, status } = req.body;

    var i, key;
    var time = Math.round(+new Date()/1000);

    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");

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
        bodyTemp: bodyTemp,
        bloodPressure: bloodPressure,
        systolicBP: systolicBP,
        diastolicBP: diastolicBP,
        pulseRate: pulseRate,
        respirationRate: respirationRate,   

        visitReason: complaint,
        treatment: treatment,

        medicationAssigned: medicationAssign,
        // medicationPrescribed: prescribedBy,
        medication: "", // array of medications

        diagnosisAssigned: diagnosisAssign,
        diagnosis: diagnosis,
        status: status,
        notes: notes,
    };

    key = clinicVisitRef.push(record).key;

    // for(i = 0; i < medicineList.length; i++){
    //     // left side is the field name in firebase
    //     medication = {
    //         medicines: medicineList[i],
    //         purpose: purposeList[i],
    //         amount: amountList[i],
    //         interval: intervalList[i],
    //         startDate: startMedList[i],
    //         endDate: endMedList[i]
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
        timestamp: time
    }

    var diagnosisForm = {
        task: "Clinic Visit",
        description: "Diagnosis",
        formId: key,
        assignedBy: nurse,
        dateAssigned: visitDate,
        timestamp: time
    }

    var assignBoth = {
        task: "Clinic Visit",
        description: "Diagnosis & Medication",
        formId: key,
        assignedBy: nurse,
        dateAssigned: visitDate,
        timestamp: time
    }

    var userMedNotification = database.ref("notifications/"+medicationAssign+"/"+key);
    var userDiagnosisNotification = database.ref("notifications/"+diagnosisAssign+"/"+key);

    var notif = {
        type: "form",
        formId: key,
        message: "You have been assigned to a new form!",
        date: visitDate,
        timestamp: time,
        seen: false
    }

    if(medicationAssign == diagnosisAssign){
        assignMedication.push(assignBoth);
        userMedNotification.set(notif);
    } else {
        assignMedication.push(medicationForm);
        assignDiagnosis.push(diagnosisForm);
        userMedNotification.set(notif);
        userDiagnosisNotification.set(notif);
    }
    
    // needed as ajax was used to send data
    res.status(200).send();
}

exports.editClinicVisit = function(req, res){
    var { userKey , formId, 
        studentId, studentName , studentGrade, studentSection, visitDate, timeStamp, timeIn, timeOut, nurse, 
        bodyTemp, systolicBP, diastolicBP, pulseRate, respirationRate, complaint, treatment,
        medicationAssign, prescribedBy, medicationList, purposeList, amountList, intervalList, startMedList, endMedList,
        diagnosisAssign, diagnosis, notes, status } = req.body;
    var i, formKey, notifKey;
    
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

        medicationAssigned: medicationAssign,
        //medicationPrescribed: prescribedBy,
        medication: "", // array of medications

        diagnosisAssigned: diagnosisAssign,
        diagnosis: diagnosis,
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

    var formRef = database.ref("assignedForms/"+ userKey);
    formRef.orderByChild("formId").equalTo(formId).on('value', (snapshot) => { 
        snapshot.forEach(function(childSnapshot) {
            formKey = childSnapshot.key;
        });
    })
    
    database.ref("assignedForms/"+ userKey + "/" + formKey).remove();
    database.ref("notifications/"+ userKey + "/" + formId).remove();
    
    res.redirect('/clinic-visit');
}

exports.getLastVisit = function(req, res){
    var student = req.body.studentID;
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");
    var userRef = database.ref("clinicUsers");
    var temp = [], details;
    var childSnapshotData, i;

    clinicVisitRef.orderByChild("id").equalTo(student).on('value', async (snapshot) => {
        if(snapshot.exists()){
            snapshot.forEach(function(childSnapshot){
                childSnapshotData = childSnapshot.exportVal();
                console.log("childSnapshotData");
                console.log(childSnapshotData);
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
                    diagnosis: childSnapshotData.diagnosis
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
                        diagnosis: temp[0].diagnosis
                    }
                });   
                res.send(details);
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
                        diagnosis: temp[temp.length-1].diagnosis
                    }
                });   
                console.log()
                res.send(details);
            }
        }
    })  
}

exports.getClinicVisits = function(){
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timestamp");
    var visits =[];
    var childSnapshotData;

    var promise = new Promise((resolve,reject) => {
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("clinicVisit")){
                query.on('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){                  // Getting primary keys of users
                        childSnapshotData = innerChildSnapshot.exportVal();  // Exports the entire contents of the DataSnapshot as a JavaScript object.
                        
                        visits.push({ // contains all data (not grouped by date)
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
}

exports.getAssignedForms = (req, res) => {
    var user = req;
    console.log("user sa controller");
    console.log(user);
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
                        forms.push({
                            task: temp[i].task,
                            description: temp[i].description,
                            formId: temp[i].formId,
                            assignedBy: fname + " " + lname,
                            dateAssigned: temp[i].dateAssigned
                        });
                    });  
                }
                resolve(forms);
            } else {
                resolve(forms);
            }
        })
    })
    return promise;
}

exports.getClinicVisitForm = function(){
    var formId = req.params.id;
    var database = firebase.database();
    var formRef = database.ref("clinicVisit/"+formId);
    var medication = [], details = [];
    var childSnapshotData, nurse, fname, lname;
    var medicationAssigned, diagnosisAssigned, bothAssigned;

    var promise = new Promise((resolve,reject)=>{
        formRef.on('value', (snapshot) => {
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
            nurse = snapshot.child("attendingNurse").val();
            database.ref("clinicUsers/"+nurse).on('value', (userSnapshot) => {
                fname = userSnapshot.child('firstName').val();
                lname = userSnapshot.child('lastName').val();
            })
            
            details = {
                formId: formId,
                idNum: snapshot.child("id").val(),
                studentName: snapshot.child("studentName").val(),
                studentGrade: snapshot.child("grade").val(),
                studentSection: snapshot.child("section").val(),
                visitDate: snapshot.child("visitDate").val(),
                timeIn: snapshot.child("timeIn").val(),
                timeOut: snapshot.child("timeOut").val(),
                nurseKey: nurse,
                attendingNurse: fname + " " + lname,
                bodyTemp: snapshot.child("bodyTemp").val(),
                bloodPressure: snapshot.child("bloodPressure").val(),
                pulseRate: snapshot.child("pulseRate").val(),
                respirationRate: snapshot.child("respirationRate").val(),
                visitReason: snapshot.child("visitReason").val(),
                treatment: snapshot.child("treatment").val(),
    
                //medicationPrescribed: snapshot.child("medicationPrescribed").val(),
                //medication: medication,
                diagnosis: snapshot.child("diagnosis").val(),
                status: snapshot.child("status").val(),
                notes: snapshot.child("notes").val(),
    
            }
            resolve(details);
        })
    })
    return promise;
}