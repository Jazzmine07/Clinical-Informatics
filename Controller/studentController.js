const firebase = require('../firebase');
const bodyParser = require('body-parser');
// const { use } = require('../routes');

var TAG = "studentController.js";

exports.addWeightHeight=function(req,res){
    console.log("ADD WEIGHT HEIGHT");
    var id= req.body.studentId;
    var weight = req.body.weight;
    var height = req.body.height;
    var bmi= req.body.bmi;
    var bmiStatus=req.body.bmiStatus;

    var database = firebase.database();
    var studentInfoRef=database.ref("studentInfo/"+id);
    console.log("ref:"+studentInfoRef);

    // studentInfoRef.child('weight').set(weight);
    // studentInfoRef.child('height').set(height);
    // studentInfoRef.child('bmi').set(bmi);
    // studentInfoRef.child('bmiStatus').set(bmiStatus);

    res.status(200).send();
};

//-------- HEALTH ASSESSMENT-----------
/*
Legends:
- APE --> Annual Physcial Exam
- ADE --> Annual Dental Exam
*/


//This function is used to adds new APE of a student with the current school year as the key
exports.addAPE = function(req, res){
    var clicked=req.body.clicked;
    var schoolYear= req.body.schoolYear;
    var age= req.body.age;
    var grade = req.body.grade;
    var sectionTop=req.body.sectionTop;
    var section= req.body.section;
    var id= req.body.studentId;
    var name = req.body.studentName;
    var apeDate = req.body.visitDate;
    var clinician = req.body.clinician;
    var temp= req.body.bodyTemp;
    var systolic = req.body.systolic;
    var diastolic = req.body.diastolic;
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
    var bmiStatus= req.body.bmiStatus;
    var weightStatus= req.body.weightStatus;
    var heightStatus= req.body.heightStatus;
    var bodyTempStatus= req.body.bodyTempStatus;
    var systolicStatus= req.body.systolicStatus;
    var diastolicStatus= req.body.diastolicStatus;
    var pulseRateStatus= req.body.pulseRateStatus;
    var respRateStatus= req.body.respRateStatus;
    var w=weight;
    var h=weight;
    var b=bmi;
    var bs= bmiStatus;
    
    //console.log(bmiStatus);
    var studentsAccomApe=[];
    var done=false;
    
    console.log("section(1):" + section);

    var database = firebase.database();
    var apeRef = database.ref("studentHealthHistory/"+id+"/ape");
    var schedRef=database.ref("haSchedule/"+schoolYear);
    var studentInfoRef=database.ref("studentInfo/"+id);

    var healthHistory= database.ref("studentHealthHistory");

    var record = {
        schoolYear:schoolYear,
        age:age,
        grade:grade,
        id: id,
        section:section,
        name: name,
        apeDate: apeDate,
        clinician: clinician,
        temp: temp,
        systolic:systolic,
        diastolic:diastolic,
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
        bmiStatus:bmiStatus,
        weightStatus: weightStatus,
        heightStatus: heightStatus,
        bodyTempStatus: bodyTempStatus,
        systolicStatus: systolicStatus,
        diastolicStatus: diastolicStatus,
        pulseRateStatus: pulseRateStatus,
        respRateStatus: respRateStatus
        // normal: normal
    }

    if(clicked=="save"){
        apeRef.child(schoolYear).set(record);
        
        if(!sectionTop==""){
            schedRef.child(sectionTop).once('value', (snapshot) => {
                if(snapshot.exists){
                    console.log("Has schedule")
                    snapshot.forEach(function(childSnapshot){
                        schedRef.child(sectionTop).child("physicalStatus").set("Accomplished");
                        schedRef.child(sectionTop).child("physicalDate").set(apeDate);
                    })
                }
            })
        }

        studentInfoRef.child("weight").set(weight);
        studentInfoRef.child("height").set(height);
        studentInfoRef.child("bmi").set(bmi);
        studentInfoRef.child("bmiStatus").set(bmiStatus);
        studentInfoRef.child("weightStatus").set(weightStatus);
        studentInfoRef.child("heightStatus").set(heightStatus);

        healthHistory.once('value',(students)=>{
            students.forEach(function(student){
                student.child("ape").forEach(function(year){
                    if(year.key==schoolYear){
                        var apeData = year.exportVal();
                        if(apeData.section == section){
                            console.log("ENTERS SECTION");
                            studentsAccomApe.push("1");
                            done=true;
                            console.log("made true");   
                        }
                    }
                })
            })
            if(done==true){
                console.log("TOTAL checked");
                console.log(studentsAccomApe.length);
                schedRef.child(section).child("apeSeen").set(studentsAccomApe.length);
                done=false;
            }
        })
        
        // //for grade 5
        // var grade4= {
        //     schoolYear:"2020-2021",
        //     age:"9",
        //     grade:"4",
        //     id: id,
        //     section:"Harmony",
        //     name: name,
        //     apeDate: "2021-01-06",
        //     clinician: clinician,
        //     temp: temp,
        //     systolic:systolic,
        //     diastolic:diastolic,
        //     pr: pr,
        //     rr: rr,
        //     sf: sf,
        //     weight: "35",
        //     height: "135",
        //     bmi: "19.2",
        //     odVision: odVision,
        //     osVision: osVision,
        //     odGlasses: odGlasses,
        //     osGlasses: osGlasses,
        //     medProb: medProb,
        //     allergies: allergies,
        //     concern: concern,
        //     assess: assess,
        //     bmiStatus:"Normal",
        //     weightStatus: "Normal",
        //     heightStatus: "Normal",
        //     bodyTempStatus: "Normal",
        //     systolicStatus: "Normal",
        //     diastolicStatus: "Normal",
        //     pulseRateStatus: "Normal",
        //     respRateStatus: "Normal"
        //     // normal: normal
        // }
        // var grade3= {
        //     schoolYear:"2019-2020",
        //     age:"8",
        //     grade:"3",
        //     id: id,
        //     section:"Courtesy",
        //     name: name,
        //     apeDate: "2020-01-06",
        //     clinician: clinician,
        //     temp: temp,
        //     systolic:systolic,
        //     diastolic:diastolic,
        //     pr: pr,
        //     rr: rr,
        //     sf: sf,
        //     weight: "30",
        //     height: "130",
        //     bmi: "17.8",
        //     odVision: odVision,
        //     osVision: osVision,
        //     odGlasses: odGlasses,
        //     osGlasses: osGlasses,
        //     medProb: medProb,
        //     allergies: allergies,
        //     concern: concern,
        //     assess: assess,
        //     bmiStatus:"Normal",
        //     weightStatus: "Normal",
        //     heightStatus: "Normal",
        //     bodyTempStatus: "Normal",
        //     systolicStatus: "Normal",
        //     diastolicStatus: "Normal",
        //     pulseRateStatus: "Normal",
        //     respRateStatus: "Normal"
        //     // normal: normal
        // }
        // var grade2= {
        //     schoolYear:"2018-2019",
        //     age:"7",
        //     grade:"2",
        //     id: id,
        //     section:"Simplicity",
        //     name: name,
        //     apeDate: "2019-01-06",
        //     clinician: clinician,
        //     temp: temp,
        //     systolic:systolic,
        //     diastolic:diastolic,
        //     pr: pr,
        //     rr: rr,
        //     sf: sf,
        //     weight: "25",
        //     height: "125",
        //     bmi: "16",
        //     odVision: odVision,
        //     osVision: osVision,
        //     odGlasses: odGlasses,
        //     osGlasses: osGlasses,
        //     medProb: medProb,
        //     allergies: allergies,
        //     concern: concern,
        //     assess: assess,
        //     bmiStatus:"Normal",
        //     weightStatus: "Normal",
        //     heightStatus: "Normal",
        //     bodyTempStatus: "Normal",
        //     systolicStatus: "Normal",
        //     diastolicStatus: "Normal",
        //     pulseRateStatus: "Normal",
        //     respRateStatus: "Normal"
        //     // normal: normal
        // }
        // var grade1= {
        //     schoolYear:"2017-2018",
        //     age:"6",
        //     grade:"1",
        //     id: id,
        //     section:"Truthfulness",
        //     name: name,
        //     apeDate: "2018-01-06",
        //     clinician: clinician,
        //     temp: temp,
        //     systolic:systolic,
        //     diastolic:diastolic,
        //     pr: pr,
        //     rr: rr,
        //     sf: sf,
        //     weight: "20",
        //     height: "120",
        //     bmi: "13.9",
        //     odVision: odVision,
        //     osVision: osVision,
        //     odGlasses: odGlasses,
        //     osGlasses: osGlasses,
        //     medProb: medProb,
        //     allergies: allergies,
        //     concern: concern,
        //     assess: assess,
        //     bmiStatus:"Normal",
        //     weightStatus: "Normal",
        //     heightStatus: "Normal",
        //     bodyTempStatus: "Normal",
        //     systolicStatus: "Normal",
        //     diastolicStatus: "Normal",
        //     pulseRateStatus: "Normal",
        //     respRateStatus: "Normal"
        //     // normal: normal
        // }
        // apeRef.child(grade4.schoolYear).set(grade4);
        // apeRef.child(grade3.schoolYear).set(grade3);
        // apeRef.child(grade2.schoolYear).set(grade2);
        //apeRef.child(grade1.schoolYear).set(grade1);
    }
    
    res.status(200).send();
};

//This function is used to add new ADE of student with the current school year as the key
exports.addADE = function(req, res){
    var clicked=req.body.clicked;
    var schoolYear= req.body.schoolYear;
    var age= req.body.age;
    var sectionTop=req.body.sectionTop;
    var section= req.body.section;
    var id= req.body.studentId;
    var name = req.body.studentName;
    var adeDate = req.body.visitDate;
    var clinician = req.body.clinician;
    var calculus = req.body.calculus;
    var gingiva = req.body.gingiva;
    var pocket = req.body.pocket;
    var anomaly = req.body.anomaly;
    var inputs = req.body.dentalInputs;

    for(k=0;k<inputs.length;k++){
        console.log(k + " " + inputs[k]);
    }

    var studentsAccomAde=[];
    var done=false;  
    

    console.log("Save dental record for " + sectionTop);

    var database = firebase.database();
    var adeRef = database.ref("studentHealthHistory/"+id+"/ade");
    var schedRef=database.ref("haSchedule/"+schoolYear);
    var studentInfoRef=database.ref("studentInfo/"+id);

    var healthHistory= database.ref("studentHealthHistory");

    var record = {
        schoolYear:schoolYear,
        age:age,
        section: section,
        id: id,
        name: name,
        adeDate: adeDate,
        clinician: clinician,
        calculus: calculus,
        gingiva: gingiva,
        pocket: pocket,
        anomaly:anomaly,
        inputs: inputs
        
    }

    console.log("ADE ref:"+adeRef);
    console.log("studentRef"+studentInfoRef);
    console.log("record:");
    

    if(clicked=="save"){
        adeRef.child(schoolYear).set(record);   

        if(!sectionTop==""){
            schedRef.child(sectionTop).once('value', (snapshot) => {
                if(snapshot.exists){
                    console.log("Has schedule")
                    snapshot.forEach(function(childSnapshot){
                        console.log(childSnapshot.exportVal());
                        console.log(childSnapshot.key);
                        schedRef.child(sectionTop).child("dentalStatus").set("Accomplished");
                        schedRef.child(sectionTop).child("dentalDate").set(adeDate);
                    })
                }
            })
        }

        healthHistory.once('value',(students)=>{
            students.forEach(function(student){
                student.child("ade").forEach(function(year){
                    if(year.key==schoolYear){
                        var adeData = year.exportVal();
                        if(adeData.section == section){
                            studentsAccomAde.push("1");
                            done=true; 
                        }
                    }
                })
            })
            if(done==true){
                schedRef.child(section).child("adeSeen").set(studentsAccomAde.length);
                done=false;
            }
        })

    }
    
    res.status(200).send();
};

//This function is used to get the list of students in a specific section
exports.getSectionStudents = function(req, res){
    var schoolYear= req.body.schoolYear;
    var section = req.body.section;
    var studentId= req.body.studentId;
    var students = [];

    var database = firebase.database();
    var studentRef = database.ref("studentInfo");

    if(section != null && (studentId==null||studentId=="")){
        console.log(schoolYear);
        console.log(section);
        //looks for all the students in a specified section
        studentRef.orderByChild("section").equalTo(section).once('value', (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach(function(childSnapshot){
                    
                    students.push(childSnapshot.key);
                })
                console.log("Students in "+ section +":"+students);
            }
            res.send(students);
        });
    }
    else if(studentId !=null && (section==null||section=="")){
        //specified student id in array 
        console.log(schoolYear);
        console.log(studentId);
        students.push(studentId);
        res.send(students);
    }
};

//
exports.getAPEPercentage = function(req, res){
    var schoolYear= req.body.schoolYear;
    var t1PE=0,t2PE=0,t3PE=0,t4PE=0,t5PE=0,t6PE=0,c1PE=0,c2PE=0,c3PE=0,c4PE=0,c5PE=0,c6PE=0;
    var pPE1=0,p2PE=0,p3PE=0,p4PE=0,p5PE=0,p6PE=0;
    
    var c1DE=0,c2DE=0,c3DE=0,c4DE=0,c5DE=0,c6DE=0;
    var pPD1=0,p2DE=0,p3DE=0,p4DE=0,p5DE=0,p6DE=0;
    //t# - total of grade #;
    //c#- total of grade # that got APE
    //p# - percentage of c#/t#

    var database = firebase.database();
    var studentRef = database.ref("studentInfo");
    var healthHistory = database.ref("studentHealthHistory");
    var haSchedRef= database.ref("haSchedule");

    //Commented area is used to find the number of students who got APE already
    // studentRef.on('value', (snapshot) =>{
    //     snapshot.forEach(function(childSnapshot){
    //         // lines 522,532,544,554,564,574 is used to check what grade the student belongs to
    //         // lines 525,536,547,557,567.577 is used to look for the file of the ape of student
    //         // lines 527-528,538-539,549-550,559-560,569-570.579-580 is used to look through all the ape of the student and check if they have for the specified year
    //         if(childSnapshot.child("grade").val()=="1"){
    //             t1=t1+1;
    //             healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
    //                 ss.forEach(function(cs){
    //                     if(cs.key.toString() == schoolYear){
    //                         c1=c1+1;
    //                     }
    //                 })
    //             });
    //         }
    //         else if(childSnapshot.child("grade").val()=="2"){
    //             console.log(childSnapshot.key);
    //             t2=t2+1;
    //             healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
    //                 ss.forEach(function(cs){
    //                     if(cs.key.toString() == schoolYear){
    //                         c2=c2+1;
    //                     }
    //                 })
    //             });

    //         }
    //         else if(childSnapshot.child("grade").val()=="3"){
    //             t3=t3+1;
    //             healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
    //                 ss.forEach(function(cs){
    //                     if(cs.key.toString() == schoolYear){
    //                         c3=c3+1;
    //                     }
    //                 })
    //             });
    //         }
    //         else if(childSnapshot.child("grade").val()=="4"){
    //             t4=t4+1;
    //             healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
    //                 ss.forEach(function(cs){
    //                     if(cs.key.toString() == schoolYear){
    //                         c4=c4+1;
    //                     }
    //                 })
    //             });
    //         }
    //         else if(childSnapshot.child("grade").val()=="5"){
    //             t5=t5+1;
    //             healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
    //                 ss.forEach(function(cs){
    //                     if(cs.key.toString() == schoolYear){
    //                         c5=c5+1;
    //                     }
    //                 })
    //             });
    //         }
    //         else if(childSnapshot.child("grade").val()=="6"){
    //             t6=t6+1;
    //             healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
    //                 ss.forEach(function(cs){
    //                     if(cs.key.toString() == schoolYear){
    //                         c6=c6+1;
    //                     }
    //                 })
    //             });
    //         }
    //     })
    //     //computes for the percentage
    //     p1=c1/t1;
    //     p2=c2/t2;
    //     p3=c3/t3;
    //     p4=c4/t4;
    //     p5=c5/t5;
    //     p6=c6/t6;
    
    //     var data={
    //         p1:p1,
    //         p2:p2,
    //         p3:p3,
    //         p4:p4,
    //         p5:p5,
    //         p6:p6,
    //         t1:t1,
    //         t2:t2,
    //         t3:t3,
    //         t4:t4,
    //         t5:t5,
    //         t6:t6,
    //         c1:c1,
    //         c2:c2,
    //         c3:c3,
    //         c4:c4,
    //         c5:c5,
    //         c6:c6
    //     };
    //     res.send(data);
    // })     
    
    haSchedRef.child(schoolYear).once('value', (snapshot) =>{
        snapshot.forEach(function(childSnapshot){
            var childValues = childSnapshot.exportVal();
            var grade;
            var students=[];
            var numStudents;


            console.log("Sections"+childValues.section);
            if(childValues.section=="Truthfulness"||childValues.section=="Sincerity"||childValues.section=="Honesty"||childValues.section=="Faithfulness"||childValues.section=="Humility"||childValues.section=="Politeness"){
                if(childValues.physicalStatus=="Accomplished"){
                    c1PE=c1PE+1;
                }
                if(childValues.dentalStatus=="Accomplished"){
                    c1DE=c1DE+1;
                }
            }
            else if(childValues.section=="Simplicity"||childValues.section=="Charity"||childValues.section=="Helpfulness"||childValues.section=="Gratefulness"||childValues.section=="Gratitude"||childValues.section=="Meekness"){
                if(childValues.physicalStatus=="Accomplished"){
                    c2PE=c2PE+1;
                }
                if(childValues.dentalStatus=="Accomplished"){
                    c2DE=c2DE+1;
                }
            }
            else if(childValues.section=="Respect"||childValues.section=="Courtesy"||childValues.section=="Trust"||childValues.section=="Kindness"||childValues.section=="Piety"||childValues.section=="Prayerfulness"){
                if(childValues.physicalStatus=="Accomplished"){
                    c3PE=c3PE+1;
                }
                if(childValues.dentalStatus=="Accomplished"){
                    c3DE=c3DE+1;
                }
            }
            else if(childValues.section=="Unity"||childValues.section=="Purity"||childValues.section=="Fidelity"||childValues.section=="Equality"||childValues.section=="Harmony"||childValues.section=="Solidarity"){
                if(childValues.physicalStatus=="Accomplished"){
                    c4PE=c4PE+1;
                }
                if(childValues.dentalStatus=="Accomplished"){
                    c4DE=c4DE+1;
                }
            }         
            else if(childValues.section=="Trustworthiness"||childValues.section=="Reliability"||childValues.section=="Dependability"||childValues.section=="Responsibility"||childValues.section=="Serenity"||childValues.section=="Flexibility"){
                if(childValues.physicalStatus=="Accomplished"){
                    c5PE=c5PE+1;
                }
                if(childValues.dentallStatus=="Accomplished"){
                    c5DE=c5DE+1;
                }
            }
            else if(childValues.section=="Self-Discipline"||childValues.section=="Self-Giving"||childValues.section=="Abnegation"||childValues.section=="Integrity"||childValues.section=="Perseverance"||childValues.section=="Patience"){
                if(childValues.physicalStatus=="Accomplished"){
                    c6PE=c6PE+1;
                }
                if(childValues.dentalStatus=="Accomplished"){
                    c6DE=c6DE+1;
                }
            }
        }) 
        //computes for the percentage
        p1PE=c1PE/6;
        p2PE=c2PE/6;
        p3PE=c3PE/6;
        p4PE=c4PE/6;
        p5PE=c5PE/6;
        p6PE=c6PE/6;
        p1DE=c1DE/6;
        p2DE=c2DE/6;
        p3DE=c3DE/6;
        p4DE=c4DE/6;
        p5DE=c5DE/6;
        p6DE=c6DE/6;
    
        var data={
            p1PE:p1PE,
            p2PE:p2PE,
            p3PE:p3PE,
            p4PE:p4PE,
            p5PE:p5PE,
            p6PE:p6PE,
            c1PE:c1PE,
            c2PE:c2PE,
            c3PE:c3PE,
            c4PE:c4PE,
            c5PE:c5PE,
            c6PE:c6PE,
            p1DE:p1DE,
            p2DE:p2DE,
            p3DE:p3DE,
            p4DE:p4DE,
            p5DE:p5DE,
            p6DE:p6DE,
            c1DE:c1DE,
            c2DE:c2DE,
            c3DE:c3DE,
            c4DE:c4DE,
            c5DE:c5DE,
            c6DE:c6DE
        };
        res.send(data);
    });


}
exports.getADEPercentage = function(req, res){
    var schoolYear= req.body.schoolYear;
    var c1=0,c2=0,c3=0,c4=0,c5=0,c6=0;
    var p1=0,p2=0,p3=0,p4=0,p5=0,p6=0;
    //t# - total of grade #;
    //c#- total of grade # that got APE
    //p# - percentage of c#/t#

    var database = firebase.database();
    var adeSchedRef= database.ref("dentalSchedule");

    
    adeSchedRef.once('value', (snapshot) =>{
        snapshot.forEach(function(childSnapshot){
            var childValues = childSnapshot.exportVal();
            var grade;
            var students=[];
            var numStudents;


            console.log("Sections"+childValues.section);
            if(childValues.section=="Truthfulness"||childValues.section=="Sincerity"||childValues.section=="Honesty"||childValues.section=="Faithfulness"||childValues.section=="Humility"||childValues.section=="Politeness"){
                if(childValues.status=="Accomplished"){
                    c1=c1+1;
                }
            }
            else if(childValues.section=="Simplicity"||childValues.section=="Charity"||childValues.section=="Helpfulness"||childValues.section=="Gratefulness"||childValues.section=="Gratitude"||childValues.section=="Meekness"){
                if(childValues.status=="Accomplished"){
                    c2=c2+1;
                }
            }
            else if(childValues.section=="Respect"||childValues.section=="Courtesy"||childValues.section=="Trust"||childValues.section=="Kindness"||childValues.section=="Piety"||childValues.section=="Prayerfulness"){
                if(childValues.status=="Accomplished"){
                    c3=c3+1;
                }
            }
            else if(childValues.section=="Unity"||childValues.section=="Purity"||childValues.section=="Fidelity"||childValues.section=="Equality"||childValues.section=="Harmony"||childValues.section=="Solidarity"){
                if(childValues.status=="Accomplished"){
                    c4=c4+1;
                }
            }         
            else if(childValues.section=="Trustwortiness"||childValues.section=="Reliability"||childValues.section=="Dependability"||childValues.section=="Responsibility"||childValues.section=="Serenity"||childValues.section=="Flexibility"){
                if(childValues.status=="Accomplished"){
                    c5=c5+1;
                }
            }
            else if(childValues.section=="Self-Discipline"||childValues.section=="Self-Giving"||childValues.section=="Abnegation"||childValues.section=="Integrity"||childValues.section=="Perseverance"||childValues.section=="Patience"){
                if(childValues.status=="Accomplished"){
                    c6=c6+1;
                }
            }
        }) 
        //computes for the percentage
        p1=c1/6;
        p2=c2/6;
        p3=c3/6;
        p4=c4/6;
        p5=c5/6;
        p6=c6/6;
    
        var data={
            p1:p1,
            p2:p2,
            p3:p3,
            p4:p4,
            p5:p5,
            p6:p6,
            c1:c1,
            c2:c2,
            c3:c3,
            c4:c4,
            c5:c5,
            c6:c6
        };
        res.send(data);
    });


}

exports.getSections=function(req,res){
    var database = firebase.database();
    var sectionRef= database.ref("sections");
    var section=[];
    var g1=[],g2=[],g3=[],g4=[],g5=[],g6=[];

    var promise = new Promise((resolve,reject)=>{
        sectionRef.on('value', (snapshot) =>{
            snapshot.forEach(function(childSnapshot){// itering thru grade 12...
                //console.log("key?? :", childSnapshot.key);
                var child = childSnapshot.exportVal();
                section.push({
                    section: child.section
                });
            })
            resolve(section);
        });
    });
    return promise;
}

exports.addSchedule=function(req,res){
    var database = firebase.database();
    var studentRef = database.ref("studentInfo");
    var sectionScheduleRef = database.ref("haSchedule");
    var schedules=[], g1=[],g2=[],g3=[],g4=[],g5=[],g6=[], schoolYear;
    var i;
    var students=[];
    var checker="false";
    //var schedulePE=[], scheduleDE=[],
    //schedulePE = req.body.schedules;
    //scheduleDE = req.body.dentals;
    schedules=req.body.schedules;
    g1=req.body.g1;
    g2=req.body.g2;
    g3=req.body.g3;
    g4=req.body.g4;
    g5=req.body.g5;
    g6=req.body.g6;
    schoolYear=req.body.schoolYear;
    
    // console.log("entered addSchedule function in studentController");
    // console.log(schedules);
    // console.log(g1);
    // console.log(g2);
    // console.log(g3);
    // console.log(g4);
    // console.log(g5);
    // console.log(g6);
    // console.log(schoolYear);

    sectionScheduleRef.once('value',(snapshot)=>{
        snapshot.forEach(function(childSnapshot){
            var child = childSnapshot.exportVal();
            console.log(childSnapshot.key);
            console.log(child);

            if(childSnapshot.key == schoolYear){
                checker="true";
            }            
        })

        if(checker=="true"){
            for(i=0;i<6;i++){
                sectionScheduleRef.child(schoolYear).child(g1[i].section).update(g1[i]);
                sectionScheduleRef.child(schoolYear).child(g2[i].section).update(g2[i]);
                sectionScheduleRef.child(schoolYear).child(g3[i].section).update(g3[i]);
                sectionScheduleRef.child(schoolYear).child(g4[i].section).update(g4[i]);
                sectionScheduleRef.child(schoolYear).child(g5[i].section).update(g5[i]);
                sectionScheduleRef.child(schoolYear).child(g6[i].section).update(g6[i]);
            }
        }
        else{
            for(i=0;i<6;i++){
                sectionScheduleRef.child(schoolYear).child(g1[i].section).set(g1[i]);
                sectionScheduleRef.child(schoolYear).child(g2[i].section).set(g2[i]);
                sectionScheduleRef.child(schoolYear).child(g3[i].section).set(g3[i]);
                sectionScheduleRef.child(schoolYear).child(g4[i].section).set(g4[i]);
                sectionScheduleRef.child(schoolYear).child(g5[i].section).set(g5[i]);
                sectionScheduleRef.child(schoolYear).child(g6[i].section).set(g6[i]);
            }
            
        }
    })

    sectionScheduleRef.child(schoolYear).once('value',(snapshot)=>{
        snapshot.forEach(function(childSnapshot){
            var childValues = childSnapshot.exportVal();
            studentRef.orderByChild("section").equalTo(childValues.section).on('value', (ss) => {
                if(ss.exists()){
                    ss.forEach(function(cs){
                        var values= cs.exportVal();
                        console.log(values.section);
                        students.push({
                            key: cs.key,
                            section:values.section
                        });
                    })
                }
                sectionScheduleRef.child(schoolYear).child(childValues.section).child("numStudents").set(students.length);
                students=[];
            });
            sectionScheduleRef.child(schoolYear).child(childValues.section).child("apeSeen").set("0");
            sectionScheduleRef.child(schoolYear).child(childValues.section).child("adeSeen").set("0");
        })
    })

    res.send();
}

exports.loadPrevDataAPE=function(req,res){
    console.log("LOAD FUNCTION");
    var currSY= req.body.schoolYear;
    var id= req.body.id;
    var start=parseInt(currSY.substr(0,4))-1;
    var end= parseInt(currSY.substr(5,8))-1;
    console.log("Start and End:"+start+" and "+end);
    var prevYear= start+"-"+end;
    
    var ape=[],curr=[],done=false;
    var database = firebase.database();
    var studentInfoRef= database.ref("studentInfo/"+id);
    var studentHealthHistoryRef= database.ref("studentHealthHistory/"+id+"/ape");
    console.log("Previous Year:"+ prevYear);
    var studentInfo;
    //var name,bday,sex;
    
    studentHealthHistoryRef.once('value', (snapshot) =>{
        snapshot.forEach(function(childSnapshot){
            console.log(childSnapshot.key);
            var childValues = childSnapshot.exportVal();
            ape.push({
                sy:childSnapshot.key,
                age:childSnapshot.age,
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
            if(childSnapshot.key==currSY){
                curr[0]={
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
                };
            }
        });
        
        // console.log("id:"+id);
        // studentInfo= loadStudentData(id);
        // console.log("StudentInfo:");
        // console.log(studentInfo);

        var lastApe;
        var i=0;
        if(ape.length==0){
            console.log("empty ape");
            lastApe=0;
            ape.push({
                sy:"",
                age:"",
                dope:"",
                doctor:"",
                systolic:"",
                diastolic:"",
                temp: "",
                bp: "",
                pr:"",
                rr: "",
                sf:"",
                weight: "",
                height: "",
                bmi: "",
                bmiStatus: "",
                od: "",
                os: "",
                odGlasses:"",
                osGlasses: "",
                medProb: "",
                allergies: "",
                complaints: "",
                reco: ""
            });

            curr.push({
                sy:"",
                age:"",
                dope:"",
                doctor:"",
                systolic:"",
                diastolic:"",
                temp: "",
                bp: "",
                pr:"",
                rr: "",
                sf:"",
                weight: "",
                height: "",
                bmi: "",
                bmiStatus: "",
                od: "",
                os: "",
                odGlasses:"",
                osGlasses: "",
                medProb: "",
                allergies: "",
                complaints: "",
                reco: ""
            });
        }
        if(ape.length>=1){
            console.log("hello");
            console.log(ape);
            console.log(curr);

            if(ape.length==1){
                lastApe=0;
                ape.push({
                    sy:"",
                    age:"",
                    dope:"",
                    doctor:"",
                    systolic:"",
                    diastolic:"",
                    temp: "",
                    bp: "",
                    pr:"",
                    rr: "",
                    sf:"",
                    weight: "",
                    height: "",
                    bmi: "",
                    bmiStatus: "",
                    od: "",
                    os: "",
                    odGlasses:"",
                    osGlasses: "",
                    medProb: "",
                    allergies: "",
                    complaints: "",
                    reco: ""
                });
            }
            else{ //size is greater than 1
                while(i<ape.length){
                    if(currSY==ape[i].sy){
                        lastApe= i-1;
                        break;
                    }
                    else{
                        i++;
                    }
                    if(lastApe!=null){
                        break;
                    }
                }
            }

            if(lastApe==null){
                console.log("Enters the last ape");
                lastApe=i-1;
            }
        }
        if(curr.length==0){
            console.log("empty curr");
            curr.push({
                sy:"",
                age:"",
                dope:"",
                doctor:"",
                systolic:"",
                diastolic:"",
                temp: "",
                bp: "",
                pr:"",
                rr: "",
                sf:"",
                weight: "",
                height: "",
                bmi: "",
                bmiStatus: "",
                od: "",
                os: "",
                odGlasses:"",
                osGlasses: "",
                medProb: "",
                allergies: "",
                complaints: "",
                reco: ""
            });
        }
        console.log("HELLO DEATH");     
        console.log(ape[lastApe].complaints);   
        
        var record={
            prevSy:ape[lastApe].sy,
            prevAge:ape[lastApe].age,
            prevTemp:ape[lastApe].temp,
            prevBp:ape[lastApe].bp,
            prevPr:ape[lastApe].pr,
            prevRr:ape[lastApe].rr,
            prevSf:ape[lastApe].sf,
            prevWeight:ape[lastApe].weight,
            prevHeight: ape[lastApe].height,
            prevBmi:ape[lastApe].bmi,
            prevBmiStatus:ape[lastApe].bmiStatus,
            prevOdVision:ape[lastApe].od,
            prevOsVision:ape[lastApe].os,
            prevOdGlasses:ape[lastApe].odGlasses,
            prevOsGlasses:ape[lastApe].osGlasses,
            medProb:ape[lastApe].medProb,
            allergies:ape[lastApe].allergies,
            prevComplaints:ape[lastApe].complaints,
            prevReco:ape[lastApe].reco,
            prevDope:ape[lastApe].dope,
            prevClinician:ape[lastApe].doctor,
            prevSys:ape[lastApe].systolic,
            prevDia:ape[lastApe].diastolic,
                            
            currSy:curr[0].sy,
            currAge:curr[0].age,
            currTemp:curr[0].temp,
            currBp:curr[0].bp,
            currPr:curr[0].pr,
            currRr:curr[0].rr,
            currSf:curr[0].sf,
            currWeight:curr[0].weight,
            currHeight:curr[0].height,
            currBmi:curr[0].bmi,
            currBmiStatus:curr[0].bmiStatus,
            currOdVision:curr[0].od,
            currOsVision:curr[0].os,
            currOdGlasses:curr[0].odGlasses,
            currOsGlasses:curr[0].osGlasses,
            currMedProb:curr[0].medProb,
            currAllergies:curr[0].allergies,
            currComplaints:curr[0].complaints,
            currReco:curr[0].reco,
            currDope:curr[0].dope,
            currClinician:curr[0].doctor,
            currSys:curr[0].systolic,
            currDia:curr[0].diastolic,
        };
        if(record.name==undefined){
            record.name="";
        }
        if(record.birthday==undefined){
            record.birthday="";
        }
        if(record.sex==undefined){
            record.sex="";
        }
        if(record.prevSy==undefined){
            record.prevSy="";
        }
        if(record.prevTemp==undefined){
            record.prevTemp="";
        }
        if(record.prevBp==undefined){
            record.prevBp="";
        }
        if(record.prevPr==undefined){
            record.prevPr="";
        }
        if(record.prevRr==undefined){
            record.prevRr="";
        }
        if(record.prevSf==undefined){
            record.prevSf="";
        }
        if(record.prevWeight==undefined){
            record.prevWeight="";
        }
        if(record.prevHeight==undefined){
            record.prevHeight="";
        }
        if(record.prevBmi==undefined){
            record.prevBmi="";
        }
        if(record.prevBmiStatus==undefined){
            record.prevBmiStatus="";
        }
        if(record.prevOdVision==undefined){
            record.prevOdVision="";
        }
        if(record.prevOsVision==undefined){
            record.prevOsVision="";
        }
        if(record.prevOdGlasses==undefined){
            record.prevOdGlasses="";
        }
        if(record.prevOsGlasses==undefined){
            record.prevOsGlasses="";
        }
        if(record.medProb==undefined){
            record.medProb="";
        }
        if(record.allergies==undefined){
            record.allergies="";
        }
        if(record.prevComplaints==undefined){
            record.prevComplaints="";
        }
        if(record.prevReco==undefined){
            record.prevReco="";
        }
        if(record.prevClinician==undefined){
            record.prevClinician="";
        }
        if(record.prevDope==undefined){
            record.prevDope="";
        }
        if(record.prevSys==undefined){
            record.prevSys="";
        }
        if(record.prevDia==undefined){
            record.prevDia="";
        }
        if(record.currSy==undefined){
            record.currSy="";
        }
        if(record.currTemp==undefined){
            record.currTemp="";
        }
        if(record.currBp==undefined){
            record.currBp="";
        }
        if(record.currPr==undefined){
            record.currPr="";
        }
        if(record.currSf==undefined){
            record.currSf="";
        }
        if(record.currWeight==undefined){
            record.currWeight="";
        }
        if(record.currHeight==undefined){
            record.currHeight="";
        }
        if(record.currBmi==undefined){
            record.currBmi="";
        }
        if(record.currBmiStatus==undefined){
            record.currBmiStatus="";
        }
        if(record.currOdVision==undefined){
            record.currBp="";
        }
        if(record.currOsVision==undefined){
            record.currOsVision="";
        }
        if(record.currOdGlasses==undefined){
            record.currOdGlasses="";
        }
        if(record.currOsGlasses==undefined){
            record.currOsGlasses="";
        }
        if(record.currMedProb==undefined){
            record.currMedProb="";
        }
        if(record.currAllergies==undefined){
            record.currAllergies="";
        }
        if(record.currComplaints==undefined){
            record.currComplaints="";
        }
        if(record.currReco==undefined){
            record.currBp="";
        }
        if(record.currDope==undefined){
            record.currDope="";
        }
        if(record.currClinician==undefined){
            record.currClinician="";
        }
        if(record.currSys==undefined){
            record.currSys="";
        }
        if(record.currDia==undefined){
            record.currDia="";
        }
        console.log(record.currComplaints);

        res.send(record);
    });
    

      
    
    
    
}
//TO EDIT
exports.loadPrevDataADE=function(req,res){
    console.log("LOAD ADE FUNCTION");
    var currSY= req.body.schoolYear;
    var id= req.body.id;
    var start=parseInt(currSY.substr(0,4))-1;
    var end= parseInt(currSY.substr(5,8))-1;
    console.log("Start and End:"+start+" and "+end);
    var prevYear= start+"-"+end;
    
    var ade=[],curr=[],done=false;
    var database = firebase.database();
    var studentInfoRef= database.ref("studentInfo/"+id);
    var studentHealthHistoryRef= database.ref("studentHealthHistory/"+id+"/ade");
    console.log("Previous Year:"+ prevYear);
    var studentInfo;
    //var name,bday,sex;
    
    studentHealthHistoryRef.once('value', (snapshot) =>{
        snapshot.forEach(function(childSnapshot){
            console.log(childSnapshot.key);
            var childValues = childSnapshot.exportVal();
                ade.push({
                    sy:childSnapshot.key,
                    age:childSnapshot.age,
                    dope:childValues.adeDate,
                    doctor:childValues.clinician,
                    calculus:childValues.calculus,
                    anomaly:childValues.anomaly,
                    gingiva:childValues.gingiva,
                    studentId:childValues.id,
                    inputs:childValues.inputs,
                    studentName:childValues.name,
                    pocket:childValues.pocket,
                    schoolYear:childValues.schoolYear                
                });
        });
        

        // studentInfo= loadStudentData(id);
        // console.log("StudentInfo:");
        // console.log(studentInfo);

        var lastAde;
        var i=1;
        if(ade!=null){
            console.log("hello");
            console.log(ade);
            //console.log(curr);
            // while(lastAde==null){
            //     console.log("THIS IS INSIDE LOOP lastAdE");
            //     console.log(ade[ade.length-i].sy);
            //     if(currSY==ade[ade.length-i].sy){
            //         i++;
            //         if(ade.length==1){
            //             lastAde=1;
            //             ade.push({
            //                 sy:"",
            //                 age:"",
            //                 dope:"",
            //                 doctor:"",
            //                 calculus:"",
            //                 anomaly:"",
            //                 gingiva:"",
            //                 studentId:"",
            //                 inputs:"",
            //                 studentName:"",
            //                 pocket:"",
            //                 schoolYear:""      
            //             });
            //             break;
            //         }
            //     }
            //     else{
            //         lastAde=i;
            //             break;
            //     }
            // }
            lastAde=ade.length-1;
        }
        if(ade.length==0){
            console.log("empty ade");
            lastAde=0;
            ade.push({
                sy:"",
                age:"",
                dope:"",
                doctor:"",
                calculus:"",
                anomaly:"",
                gingiva:"",
                studentId:"",
                inputs:"",
                studentName:"",
                pocket:"",
                schoolYear:"" 
            });

        }
        
        console.log(ade);
        //console.log(curr);
        var record={
            // name:studentInfo.name,
            // birthday:studentInfo.bday,
            // sex:studentInfo.sex,

            prevSy:ade[lastAde].sy,
            prevAge:ade[lastAde].age,
            prevDope:ade[lastAde].dope,
            prevDoctor:ade[lastAde].doctor,
            prevCalculus:ade[lastAde].calculus,
            prevAnomaly:ade[lastAde].anomaly,
            prevGingiva:ade[lastAde].gingiva,
            prevStudentId:ade[lastAde].studentId,
            prevInputs:ade[lastAde].inputs,
            prevPocket:ade[lastAde].pocket,
            prevSchoolYear:ade[lastAde].schoolYear, 
            
        };
        if(record.name==undefined){
            record.name="";
        }
        if(record.birthday==undefined){
            record.birthday="";
        }
        if(record.sex==undefined){
            record.sex="";
        }
        if(record.prevSy==undefined){
            record.prevSy="";
        }
        if(record.prevAge==undefined){
            record.prevAgeAge="";
        }
        if(record.prevDope==undefined){
            record.prevDope="";
        }
        if(record.prevDoctor==undefined){
            record.prevDoctor=="";
        }
        if(record.prevCalculus==undefined){
            record.prevCalculus="";
        }
        if(record.prevAnomaly==undefined){
            record.prevAnomaly="";
        }
        if(record.prevGingiva==undefined){
            record.prevGingiva="";
        }
        if(record.prevStudentId==undefined){
            record.prevStudentId="";
        }
        if(record.prevInputs==undefined){
            record.prevInputs=[]
        }
        if(record.prevPocket==undefined){
            record.prevPocket="";
        }
        if(record.prevSchoolYear==undefined){
            record.prevSchoolYear="";
        }
        

        res.send(record);
        });   
}


exports.loadStudentData= function (req,res){
    var name,bday,sex,record;
    var id = req.body.id;
    var database = firebase.database();
    var studentInfoRef= database.ref("studentInfo/"+id);
    console.log("HI"+id);
    console.log("IN loadStudentData:");
   
    studentInfoRef.once('value', (snapshot) =>{
        console.log("WHHHYYY");
        console.log(snapshot.exportVal());
            console.log("DATA Path1: ");
            var childValues = snapshot.exportVal();
            
            console.log(childValues.firstName);
            name=childValues.firstName +" "+ childValues.lastName;
            bday=childValues.birthday;
            sex=childValues.sex;
            record={
                name:name,
                bday:bday,
                sex:sex
            }
            console.log(record);
            res.send(record);  
    })
}

//in health-assessment --> loads the schedule for the year
exports.getAllSched=function(){
    //gets all the schedule created for the APE
    var currentTime = new Date()
    var month = currentTime.getMonth()+1; //(0-11 so +1 to make it the usual)
    var currYear = currentTime.getFullYear();
    var sy;
    //var month=1;
    //var currYear=2021;
    if(month>=6){
        sy= currYear +"-"+ (currYear+1) ;
    }
    else{
        sy= (currYear-1) +"-"+ (currYear) ;
    }

    var database = firebase.database();
    var apeSchedRef= database.ref("apeSchedule");
    var studentRef = database.ref("studentInfo");
    var sectionScheduleRef = database.ref("haSchedule")
    var healthHistory= database.ref("studentHealthHistory");
    var i;
    var schedule=[];
    var studentsAccomApe=[],studentsAccomAde=[];
    var grade, done=false, sec;
    
    var promise = new Promise((resolve,reject)=> {
        sectionScheduleRef.child(sy).once('value', (snapshot) =>{
            snapshot.forEach(function(childSnapshot){
                var childValues = childSnapshot.exportVal();
                
               
                if(childValues.section=="Truthfulness"||childValues.section=="Sincerity"||childValues.section=="Honesty"||childValues.section=="Faithfulness"||childValues.section=="Humility"||childValues.section=="Politeness"){
                    grade="1";
                    sec=childValues.section;
                }
                else if(childValues.section=="Simplicity"||childValues.section=="Charity"||childValues.section=="Helpfulness"||childValues.section=="Gratefulness"||childValues.section=="Gratitude"||childValues.section=="Meekness"){
                    grade="2";
                    sec=childValues.section;
                }
                else if(childValues.section=="Respect"||childValues.section=="Courtesy"||childValues.section=="Trust"||childValues.section=="Kindness"||childValues.section=="Piety"||childValues.section=="Prayerfulness"){
                    grade="3";
                    sec=childValues.section;
                }
                else if(childValues.section=="Unity"||childValues.section=="Purity"||childValues.section=="Fidelity"||childValues.section=="Equality"||childValues.section=="Harmony"||childValues.section=="Solidarity"){
                    grade="4";
                    sec=childValues.section;
                }         
                else if(childValues.section=="Trustworthiness"||childValues.section=="Reliability"||childValues.section=="Dependability"||childValues.section=="Responsibility"||childValues.section=="Serenity"||childValues.section=="Flexibility"){
                    grade="5";
                    sec=childValues.section;
                }
                else if(childValues.section=="Self-Discipline"||childValues.section=="Self-Giving"||childValues.section=="Abnegation"||childValues.section=="Integrity"||childValues.section=="Perseverance"||childValues.section=="Patience"){
                    grade="6";
                    sec=childValues.section;
                }
        
                record={
                    grade:grade,
                    section:childValues.section,
                    numStudents:childValues.numStudents,
                    apeDate:childValues.physicalDate,
                    apeTime:childValues.physicalTime,
                    apeSeen:childValues.apeSeen,
                    adeDate:childValues.dentalDate,
                    adeTime:childValues.dentalTime,
                    adeSeen:childValues.adeSeen,
                }
                //console.log(record);
                schedule.push(record);

            })
            resolve(schedule);
            reject(schedule);
        })
    })

    return promise;
}
//in health-assessment-schedule --> loads the most recent schedule clinic has for health assessments
exports.getAllPrevSched=function(req,res){
    //gets all the schedule created for the APE
    var currentTime = new Date()
    var month = currentTime.getMonth()+1; //(0-11 so +1 to make it the usual)
    var currYear = currentTime.getFullYear();
    var sy;
    //var month=1;
    //var currYear=2021;
    if(month>=6){
        sy= (currYear-1) +"-"+ (currYear) ;  //2021-2022 -> 2020-2021
    }
    else{
        sy= (currYear-2) +"-"+ (currYear-1) ; //2020-2021 -> 2019-2020
    }

    var database = firebase.database();
    var apeSchedRef= database.ref("apeSchedule");
    var studentRef = database.ref("studentInfo");
    var sectionScheduleRef = database.ref("haSchedule")
    var healthHistory= database.ref("studentHealthHistory");
    var i;
    var schedule=[];
    
    sectionScheduleRef.once('value', (snapshot) =>{
        snapshot.forEach(function(childSnapshot){
            childSnapshot.forEach(function(childSnapshot2){
                var childValues = childSnapshot2.exportVal();
                //console.log(snapshot.key); //school year
                //console.log(childSnapshot.key); //section Name
                //console.log(childValues); // schedule details
                var students=[], studentsAccom=[];
                var grade, done=false;
                
                if(childValues.section=="Truthfulness"||childValues.section=="Sincerity"||childValues.section=="Honesty"||childValues.section=="Faithfulness"||childValues.section=="Humility"||childValues.section=="Politeness"){
                    grade="1";
                }
                else if(childValues.section=="Simplicity"||childValues.section=="Charity"||childValues.section=="Helpfulness"||childValues.section=="Gratefulness"||childValues.section=="Gratitude"||childValues.section=="Meekness"){
                    grade="2";
                }
                else if(childValues.section=="Respect"||childValues.section=="Courtesy"||childValues.section=="Trust"||childValues.section=="Kindness"||childValues.section=="Piety"||childValues.section=="Prayerfulness"){
                    grade="3";
                }
                else if(childValues.section=="Unity"||childValues.section=="Purity"||childValues.section=="Fidelity"||childValues.section=="Equality"||childValues.section=="Harmony"||childValues.section=="Solidarity"){
                    grade="4";
                }         
                else if(childValues.section=="Trustworthiness"||childValues.section=="Reliability"||childValues.section=="Dependability"||childValues.section=="Responsibility"||childValues.section=="Serenity"||childValues.section=="Flexibility"){
                    grade="5";
                }
                else if(childValues.section=="Self-Discipline"||childValues.section=="Self-Giving"||childValues.section=="Abnegation"||childValues.section=="Integrity"||childValues.section=="Perseverance"||childValues.section=="Patience"){
                    grade="6";
                }

            
                    record={
                        grade:grade,
                        section:childValues.section,
                        apeDate:childValues.physicalDate,
                        apeTime:childValues.physicalTime,
                        adeDate:childValues.dentalDate,
                        adeTime:childValues.dentalTime,
                    }
                    //console.log(record);
                    schedule.push(record);
            })
            schedule.push(childSnapshot.key);  
  
        })
        console.log(schedule)
        res.send (schedule);
        
    })

}






//computes BMI status of the child
exports.getBmiStatus=function(req,res){
    var database = firebase.database();
    var studentRef = database.ref("studentInfo");

    var id=req.body.id;
    var dob=req.body.dob;
    var yearAge=req.body.age;
    var sex=req.body.sex;
    var visitDate=req.body.dateAPE;
    var bmi=req.body.bmi;
    var monthAge;
    var bmiStatus;

    var bDate = new Date(dob);
    var vDate = new Date(visitDate);
    var bMonth=bDate.getMonth();
    var vMonth=vDate.getMonth();


    if(vMonth>=bMonth){
        monthAge=vMonth-bMonth;
        console.log("1"+bMonth);
        console.log(vMonth);
        console.log(monthAge);
    }
    else if(vMonth<bMonth){
        monthAge=vMonth+12-bMonth;
        console.log("2"+bMonth);
        console.log(vMonth);
        console.log(monthAge);
    }    

    console.log("DATA:");
    console.log(dob);
    console.log(yearAge);
    console.log(sex);
    console.log(visitDate);
    console.log(bmi);
    console.log(monthAge);


    if(sex=="female"|| sex=="Female"){
        if(yearAge=="5"){
            if(bmi<13.1){ 
                bmiStatus="Underweight";
            }
            else{ //bmi>=13.1 (health,over,obese)
                if(monthAge<=2){
                    if(bmi>=13.1 && bmi<16.9){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=16.9 && bmi<=18.1){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.1){
                        bmiStatus="Obese";
                    }
                }
                else if(monthAge==3){
                    if(bmi>=13.1 && bmi<17){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17 && bmi<=18.1){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.1){
                        bmiStatus="Obese";
                    }
                }
                else if(monthAge >=4 && monthAge<=7){
                    if(bmi>=13.1 && bmi<17){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17 && bmi<=18.2){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.2){
                        bmiStatus="Obese";
                    } 
                }
                else if(monthAge >=8 && monthAge<=10){
                    if(bmi>=13.1 && bmi<17){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17 && bmi<=18.3){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.3){
                        bmiStatus="Obese";
                    } 
                }
                else if(monthAge ==11){
                    if(bmi>=13.1 && bmi<17.1){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17.1 && bmi<=18.3){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.3){
                        bmiStatus="Obese";
                    } 
                }

            }
        }
        else if(yearAge=="6"){
            if(bmi<13.1){ 
                bmiStatus="Underweight";
            }
            else{
                if(monthAge<=2){
                    if(bmi>=13.1 && bmi<17.1){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17.1 && bmi<=18.4){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.4){
                        bmiStatus="Obese";
                    } 
                }
                else if(monthAge==3){
                    if(bmi>=13.1 && bmi<17.1){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17.1 && bmi<=18.5){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.5){
                        bmiStatus="Obese";
                    } 
                }
                else if(monthAge==4 || monthAge==5){
                    if(bmi>=13.1 && bmi<17.2){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17.2 && bmi<=18.5){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.5){
                        bmiStatus="Obese";
                    } 
                }
                else if(monthAge==6 || monthAge==7){
                    if(bmi>=13.1 && bmi<17.2){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17.2 && bmi<=18.6){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.6){
                        bmiStatus="Obese";
                    } 
                }
                else if(monthAge==8){
                    if(bmi>=13.1 && bmi<17.3){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17.3 && bmi<=18.6){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.6){
                        bmiStatus="Obese";
                    } 
                }
                else if(monthAge==9 || monthAge==10){
                    if(bmi>=13.1 && bmi<17.3){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17.3 && bmi<=18.7){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.7){
                        bmiStatus="Obese";
                    } 
                }
                else if(monthAge==11){
                    if(bmi>=13.1 && bmi<17.3){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17.3 && bmi<=18.8){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>18.8){
                        bmiStatus="Obese";
                    } 
                }
            }

        }
        else if(yearAge=="7"){
            if(monthAge<=1){
                if(bmi<13.1){
                    bmiStatus="Underweight";
                }
                if(bmi>=13.1 && bmi<17.4){
                    bmiStatus="Normal weight";
                }
                else{
                    if(monthAge==0){
                        if(bmi>=17.4 && bmi<=18.8){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.8){
                            bmiStatus="Obese";
                        } 
                    }
                    else if(monthAge==1){
                        if(bmi>=17.4 && bmi<=18.9){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.9){
                            bmiStatus="Obese";
                        } 
                    }
                }
            }
            else{//monthAge >2
                if(monthAge>=2 && monthAge<=9){
                    if(bmi<13.2){
                        bmiStatus="Underweight";
                    }
                    else{//bmi>13.2
                        if(monthAge==2){
                            if(bmi>=13.2 && bmi<17.4){
                                bmiStatus="Normal weight";
                            }
                            else if(bmi>=17.4 && bmi<=18.9){
                                bmiStatus="Overweight";
                            }
                            else if(bmi>18.9){
                                bmiStatus="Obese";
                            } 
                        }
                        else if(monthAge==3 || monthAge==4){
                            if(bmi>=13.2 && bmi<17.5){
                                bmiStatus="Normal weight";
                            }
                            else if(bmi>=17.5 && bmi<=19){
                                bmiStatus="Overweight";
                            }
                            else if(bmi>19){
                                bmiStatus="Obese";
                            } 
                        }
                        else if(monthAge==5){
                            if(bmi>=13.2 && bmi<17.5){
                                bmiStatus="Normal weight";
                            }
                            else if(bmi>=17.5 && bmi<=19.1){
                                bmiStatus="Overweight";
                            }
                            else if(bmi>19.1){
                                bmiStatus="Obese";
                            } 
                        }
                        else if(monthAge==6){
                            if(bmi>=13.2 && bmi<17.6){
                                bmiStatus="Normal weight";
                            }
                            else if(bmi>=17.6 && bmi<=19.1){
                                bmiStatus="Overweight";
                            }
                            else if(bmi>19.1){
                                bmiStatus="Obese";
                            } 
                        }
                        else if(monthAge==7 || monthAge==8){
                            if(bmi>=13.2 && bmi<17.6){
                                bmiStatus="Normal weight";
                            }
                            else if(bmi>=17.6 && bmi<=19.2){
                                bmiStatus="Overweight";
                            }
                            else if(bmi>19.2){
                                bmiStatus="Obese";
                            } 
                        }
                        else if(monthAge==9){
                            if(bmi>=13.2 && bmi<17.7){
                                bmiStatus="Normal weight";
                            }
                            else if(bmi>=17.7 && bmi<=19.3){
                                bmiStatus="Overweight";
                            }
                            else if(bmi>19.3){
                                bmiStatus="Obese";
                            } 
                        
                        }
                    }                    
                }
                else if(monthAge==10){
                    if(bmi<13.3){
                        bmiStatus="Underweight";
                    }
                    else if(bmi>=13.3 && bmi<17.7){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17.7 && bmi<=19.3){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>19.3){
                        bmiStatus="Obese";
                    } 
                }
                else if(monthAge==11){
                    if(bmi<13.3){
                        bmiStatus="Underweight";
                    }
                    else if(bmi>=13.3 && bmi<17.8){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=17.8 && bmi<=19.4){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>19.4){
                        bmiStatus="Obese";
                    } 
                }    
            }
        }
        else if(yearAge=="8"){
            if(monthAge==0){
                if(bmi<13.3){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.3 && bmi<17.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=17.8 && bmi<=19.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>19.4){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==1){
                if(bmi<13.3){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.3 && bmi<17.9){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=17.9 && bmi<=19.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>19.5){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==2){
                if(bmi<13.3){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.3 && bmi<17.9){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=17.9 && bmi<=19.6){
                    bmiStatus="Overweight";
                }
                else if(bmi>19.6){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==3){
                if(bmi<13.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.4 && bmi<18){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18 && bmi<=19.6){
                    bmiStatus="Overweight";
                }
                else if(bmi>19.6){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==4){
                if(bmi<13.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.4 && bmi<18){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18 && bmi<=19.7){
                    bmiStatus="Overweight";
                }
                else if(bmi>19.7){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==5 || monthAge ==6){
                if(bmi<13.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.4 && bmi<18.1){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.1 && bmi<=19.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>19.8){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==7){
                if(bmi<13.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.4 && bmi<18.2){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.2 && bmi<=19.9){
                    bmiStatus="Overweight";
                }
                else if(bmi>19){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==8){
                if(bmi<13.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.5 && bmi<18.2){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.2 && bmi<=20){
                    bmiStatus="Overweight";
                }
                else if(bmi>20){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==9){
                if(bmi<13.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.5 && bmi<18.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.3 && bmi<=20){
                    bmiStatus="Overweight";
                }
                else if(bmi>20){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==10){
                if(bmi<13.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.5 && bmi<18.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.3 && bmi<=20.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.1){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==11){
                if(bmi<13.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.5 && bmi<18.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.4 && bmi<=20.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.2){
                    bmiStatus="Obese";
                } 
            }   
        }
        else if(yearAge=="9"){
            if(monthAge==0){
                if(bmi<13.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.6 && bmi<18.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.4 && bmi<=20.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.2){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==1){
                if(bmi<13.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.6 && bmi<18.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.5 && bmi<=20.3){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.3){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==2){
                if(bmi<13.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.6 && bmi<18.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.5 && bmi<=20.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.4){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==3){
                if(bmi<13.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.6 && bmi<18.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.6 && bmi<=20.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.5){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==4){
                if(bmi<13.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.7 && bmi<18.7){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.7 && bmi<=20.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.5){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==5){
                if(bmi<13.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.7 && bmi<18.7){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.7 && bmi<=20.6){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.6){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==6){
                if(bmi<13.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.7 && bmi<18.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.8 && bmi<=20.7){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.7){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==7){
                if(bmi<13.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.8 && bmi<18.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.8 && bmi<=20.7){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.7){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==8){
                if(bmi<13.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.8 && bmi<18.9){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.9 && bmi<=20.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.8){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==9){
                if(bmi<13.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.8 && bmi<18.9){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.9 && bmi<=20.9){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.9){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==10){
                if(bmi<13.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.9 && bmi<19){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19 && bmi<=21){
                    bmiStatus="Overweight";
                }
                else if(bmi>21){
                    bmiStatus="Obese";
                } 
            }
            else if(monthAge==11){
                if(bmi<13.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.9 && bmi<19.1){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.1 && bmi<=21.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.1){
                    bmiStatus="Obese";
                } 
            }   
            
        }
        else if(yearAge=="10"){
            if(monthAge==0){
                if(bmi<13.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.9 && bmi<19.1){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.1 && bmi<=21.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.1){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==1){
                if(bmi<14){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14 && bmi<19.2){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.2 && bmi<=21.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.2){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==2){
                if(bmi<14){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14 && bmi<19.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.3 && bmi<=21.3){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.3){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==3){
                if(bmi<14){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14 && bmi<19.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.3 && bmi<=21.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.4){
                    bmiStatus="Obese";
                } 
            }   
            else if(monthAge==4){
                if(bmi<14.1){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.1 && bmi<19.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.4 && bmi<=21.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.5){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==5){
                if(bmi<14.1){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.1 && bmi<19.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.5 && bmi<=21.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.5){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==6){
                if(bmi<14.1){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.1 && bmi<19.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.5 && bmi<=21.6){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.6){
                    bmiStatus="Obese";
                } 
            }     
            else if(monthAge==7){
                if(bmi<14.2){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.2 && bmi<19.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.6 && bmi<=21.7){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.7){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==8){
                if(bmi<14.2){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.2 && bmi<19.7){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.7 && bmi<=21.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.8){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==9){
                if(bmi<14.2){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.2 && bmi<19.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.8 && bmi<=21.9){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.9){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==10){
                if(bmi<14.3){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.3 && bmi<19.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.8 && bmi<=22){
                    bmiStatus="Overweight";
                }
                else if(bmi>22){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==11){
                if(bmi<14.3){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.3 && bmi<19.9){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.9 && bmi<=22.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.1){
                    bmiStatus="Obese";
                } 
            }  
        }
        else if(yearAge=="11"){
            if(monthAge==0 ||monthAge==1){
                if(bmi<14.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.4 && bmi<20){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20 && bmi<=22.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.2){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==2){
                if(bmi<14.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.4 && bmi<20.1){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.1 && bmi<=22.3){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.3){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==3){
                if(bmi<14.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.5 && bmi<20.2){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.2 && bmi<=22.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.4){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==4){
                if(bmi<14.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.5 && bmi<20.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.3 && bmi<=22.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.5){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==5){
                if(bmi<14.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.6 && bmi<20.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.4 && bmi<=22.6){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.6){
                    bmiStatus="Obese";
                } 
            }  
            else if(monthAge==6){
                if(bmi<14.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.6 && bmi<20.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.4 && bmi<=22.7){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.7){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==7){
                if(bmi<14.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.7 && bmi<20.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.5 && bmi<=22.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.8){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==8){
                if(bmi<14.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.7 && bmi<20.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.6 && bmi<=22.9){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.9){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==9){
                if(bmi<14.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.8 && bmi<20.7){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.7 && bmi<=23){
                    bmiStatus="Overweight";
                }
                else if(bmi>23){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==10){
                if(bmi<14.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.8 && bmi<20.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.8 && bmi<=23.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.1){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==11){
                if(bmi<14.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.9 && bmi<20.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.8 && bmi<=23.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.2){
                    bmiStatus="Obese";
                } 
            } 
        }
        else if(yearAge=="12"){
            if(monthAge==0){
                if(bmi<14.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.9 && bmi<20.9){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.9 && bmi<=23.3){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.3){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==1){
                if(bmi<15){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15 && bmi<21){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21 && bmi<=23.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.4){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==2){
                if(bmi<15){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15 && bmi<21.1){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.1 && bmi<=23.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.5){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==3){
                if(bmi<15){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15 && bmi<21.2){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.2 && bmi<=23.6){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.6){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==4){
                if(bmi<15.1){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.1 && bmi<21.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.3 && bmi<=23.7){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.7){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==5){
                if(bmi<15.1){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.1 && bmi<21.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.3 && bmi<=23.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.8){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==6){
                if(bmi<15.2){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.2 && bmi<21.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.4 && bmi<=23.9){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.9){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==7){
                if(bmi<15.2){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.2 && bmi<21.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.5 && bmi<=23.9){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.9){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==8){
                if(bmi<15.3){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.3 && bmi<21.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.6 && bmi<=24){
                    bmiStatus="Overweight";
                }
                else if(bmi>24){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==9){
                if(bmi<15.3){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.3 && bmi<21.7){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.7 && bmi<=24.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>24.1){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==10){
                if(bmi<15.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.4 && bmi<21.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.8 && bmi<=24.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>24.2){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==11){
                if(bmi<15.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.4 && bmi<21.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.8 && bmi<=24.3){
                    bmiStatus="Overweight";
                }
                else if(bmi>24.3){
                    bmiStatus="Obese";
                } 
            } 
            
        }
        else if(yearAge=="13"){
            if(monthAge==0){
                if(bmi<15.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.5 && bmi<21.9){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.9 && bmi<=24.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>24.4){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==1){
                if(bmi<15.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.5 && bmi<22){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22 && bmi<=24.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>24.5){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==2){
                if(bmi<15.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.6 && bmi<22.1){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22.1 && bmi<=24.6){
                    bmiStatus="Overweight";
                }
                else if(bmi>24.6){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==3){
                if(bmi<15.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.6 && bmi<22.2){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22.2 && bmi<=24.7){
                    bmiStatus="Overweight";
                }
                else if(bmi>24.7){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==4){
                if(bmi<15.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.7 && bmi<22.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22.3 && bmi<=24.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>24.8){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==5){
                if(bmi<15.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.7 && bmi<22.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22.3 && bmi<=24.9){
                    bmiStatus="Overweight";
                }
                else if(bmi>24.9){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==6){
                if(bmi<15.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.8 && bmi<22.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22.4 && bmi<=25){
                    bmiStatus="Overweight";
                }
                else if(bmi>25){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==7){
                if(bmi<15.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.8 && bmi<22.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22.5 && bmi<=25.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>25.1){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==8){
                if(bmi<15.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.9 && bmi<22.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22.6 && bmi<=25.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>25.1){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==9){
                if(bmi<15.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.9 && bmi<22.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22.6 && bmi<=25.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>25.2){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==10){
                if(bmi<15.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.9 && bmi<22.7){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22.7 && bmi<=25.3){
                    bmiStatus="Overweight";
                }
                else if(bmi>25.3){
                    bmiStatus="Obese";
                } 
            } 
            else if(monthAge==11){
                if(bmi<16){
                    bmiStatus="Underweight";
                }
                else if(bmi>=16 && bmi<22.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=22.8 && bmi<=25.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>25.4){
                    bmiStatus="Obese";
                } 
            } 
        }
        console.log(bmiStatus);
        res.send(bmiStatus);
    }
    else if(sex=="male"||sex=="Male"){
        if(yearAge=="5"){
            if(bmi<13.4){
                bmiStatus="Underweight";
            }
            else{
                if(monthAge>=0 && monthAge<=7){
                    if(bmi>=13.4 && bmi<16.7){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=16.7 && bmi<=17.7){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>17.7){
                        bmiStatus="Obese";
                    }
                }
                else if(monthAge>=8 && monthAge<=11){
                    if(bmi>=13.4 && bmi<16.8){
                        bmiStatus="Normal weight";
                    }
                    else if(bmi>=16.8 && bmi<=17.8){
                        bmiStatus="Overweight";
                    }
                    else if(bmi>17.8){
                        bmiStatus="Obese";
                    }
                }
            }

        }
        else if(yearAge=="6"){
            if(monthAge>=0 && monthAge<=7){
                if(bmi<13.4){
                    bmiStatus="Underweight";
                }
                else{
                    if(monthAge<=1){//0 and 1
                        if(bmi>=13.4 && bmi<16.8){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=16.8 && bmi<=17.9){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>17.9){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==2 || monthAge==3){
                        if(bmi>=13.4 && bmi<16.9){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=16.9 && bmi<=17.9){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>17.9){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==4 || monthAge==5|| monthAge==6){
                        if(bmi>=13.4 && bmi<16.9){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=16.9 && bmi<=18){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==7){
                        if(bmi>=13.4 && bmi<17){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17 && bmi<=18.1){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.1){
                            bmiStatus="Obese";
                        }
                    }
                }
            }
            else if(monthAge>=8 && monthAge<=11){
                if(bmi<13.5){
                    bmiStatus="Underweight";
                }
                else{
                    if(monthAge==8 || monthAge==9){
                        if(bmi>=13.5 && bmi<17){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17 && bmi<=18.1){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.1){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==10 || monthAge==11){
                        if(bmi>=13.5 && bmi<17.1){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.1 && bmi<=18.2){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.2){
                            bmiStatus="Obese";
                        }
                    }
                }
            }


        }
        else if(yearAge=="7"){
            if(monthAge<=3){
                if(bmi<13.5){
                    bmiStatus="Underweight";
                }
                else{
                    if(monthAge==0 || monthAge==1){
                        if(bmi>=13.5 && bmi<17.1){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.1 && bmi<=18.3){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.3){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==2){
                        if(bmi>=13.5 && bmi<17.2){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.2 && bmi<=18.3){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.3){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==3){
                        if(bmi>=13.5 && bmi<17.2){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.2 && bmi<=18.4){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.4){
                            bmiStatus="Obese";
                        }
                    }
                }
            }
            else if(monthAge>=4 && monthAge<=10){
                if(bmi<13.6){
                    bmiStatus="Underweight";
                }
                else{
                    if(monthAge==4){
                        if(bmi>=13.6 && bmi<17.2){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.2 && bmi<=18.4){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.4){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==5 || monthAge==6){
                        if(bmi>=13.6 && bmi<17.3){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.3 && bmi<=18.5){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.5){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==7){
                        if(bmi>=13.6 && bmi<17.3){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.3 && bmi<=18.6){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.6){
                            bmiStatus="Obese";
                        }
                    } 
                    else if(monthAge==8){
                        if(bmi>=13.6 && bmi<17.4){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.4 && bmi<=18.6){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.6){
                            bmiStatus="Obese";
                        }
                    } 
                    else if(monthAge==9 || monthAge==10){
                        if(bmi>=13.6 && bmi<17.4){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.4 && bmi<=18.7){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.7){
                            bmiStatus="Obese";
                        }
                    } 
                }
            }
            else if(monthAge==11){
                if(bmi<13.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=13.7 && bmi<17.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=17.5 && bmi<=18.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>18.8){
                    bmiStatus="Obese";
                }
            }
            
        }
        else if(yearAge=="8"){
            if(monthAge>=0 && monthAge<=5){
                if(bmi=13.7){
                    bmiStatus="Underweight";
                }
                else{
                    if(monthAge==0){
                        if(bmi>=13.7 && bmi<17.5){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.5 && bmi<=18.8){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.8){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==1){
                        if(bmi>=13.7 && bmi<17.5){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.5 && bmi<=18.9){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.9){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==2){
                        if(bmi>=13.7 && bmi<17.6){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.6 && bmi<=18.9){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>18.9){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==3){
                        if(bmi>=13.7 && bmi<17.6){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.6 && bmi<=19){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==4){
                        if(bmi>=13.7 && bmi<17.7){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.7 && bmi<=19){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==5){
                        if(bmi>=13.7 && bmi<17.7){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.7 && bmi<=19.1){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.1){
                            bmiStatus="Obese";
                        }
                    }
                }
            }
            else if(monthAge>=6 && monthAge<=11){
                if(bmi=13.8){
                    bmiStatus="Underweight";
                }
                else{
                    if(monthAge==6){
                        if(bmi>=13.8 && bmi<17.7){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.7 && bmi<=19.1){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.1){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==7){
                        if(bmi>=13.8 && bmi<17.8){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.8 && bmi<=19.2){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.2){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==8){
                        if(bmi>=13.8 && bmi<17.8){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.8 && bmi<=19.2){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.2){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==9){
                        if(bmi>=13.8 && bmi<17.9){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.9 && bmi<=19.3){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.3){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==10){
                        if(bmi>=13.8 && bmi<17.9){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.9 && bmi<=19.3){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.3){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==11){
                        if(bmi>=13.8 && bmi<17.9){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=17.9 && bmi<=19.4){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.4){
                            bmiStatus="Obese";
                        }
                    }
                }
            }
            
        }
        else if(yearAge=="9"){
            if(monthAge<=4){
                if(bmi<13.9){
                    bmiStatus="Underweight"
                }
                else{
                    if(monthAge<=1){
                        if(bmi>=13.9 && bmi<18){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18 && bmi<=19.5){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.5){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==2 || monthAge==3){
                        if(bmi>=13.9 && bmi<18.1){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.1 && bmi<=19.6){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.6){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==4){
                        if(bmi>=13.9 && bmi<18.2){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.2 && bmi<=19.7){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.7){
                            bmiStatus="Obese";
                        }
                    }
                }
            }
            else if(monthAge>=5 && monthAge<=8){
                if(bmi<14){
                    bmiStatus="Underweight";
                }
                else{
                    if(monthAge==5){
                        if(bmi>=14 && bmi<18.2){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.2 && bmi<=19.8){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.8){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==6){
                        if(bmi>=14 && bmi<18.3){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.3 && bmi<=19.8){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.8){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==7){
                        if(bmi>=14 && bmi<18.3){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.3 && bmi<=19.9){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>19.9){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==8){
                        if(bmi>=14 && bmi<18.4){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.4 && bmi<=20){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>20){
                            bmiStatus="Obese";
                        }
                    }
                }
            }
            else if(monthAge>=9 && monthAge<=11){
                if(bmi<14.1){
                    bmiStatus="Underweight"
                }
                else{
                    if(monthAge==9){
                        if(bmi>=14.1 && bmi<18.4){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.4 && bmi<=20){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>20){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==10 || monthAge==11){
                        if(bmi>=14.1 && bmi<18.5){
                            bmiStatus="Normal weight";
                        }
                        else{
                            if(monthAge==10){
                                if(bmi>=18.5 && bmi<=20.1){
                                    bmiStatus="Overweight";
                                }
                                else if(bmi>20.1){
                                    bmiStatus="Obese";
                                }
                            }
                            else if(monthAge==11){
                                if(bmi>=18.5 && bmi<=20.2){
                                    bmiStatus="Overweight";
                                }
                                else if(bmi>20.2){
                                    bmiStatus="Obese";
                                }
                            }
                        }
                    }
                }
            }
            
        }
        else if(yearAge=="10"){
            if(monthAge==0){
                if(bmi<14.1){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.1 && bmi<18.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=18.6 && bmi<=20.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>20.2){
                    bmiStatus="Obese";
                }

            }
            else if(monthAge>=1 && monthAge<=4){
                if(bmi<14.2){
                    bmiStatus="Underweight";
                }
                else{
                    if(monthAge==1){
                        if(bmi>=14.2 && bmi<18.6){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.6 && bmi<=20.3){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>20.3){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==2 || monthAge==3){
                        if(bmi>=14.2 && bmi<18.7){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.7 && bmi<=20.4){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>20.4){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==4){
                        if(bmi>=14.2 && bmi<18.8){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.8 && bmi<=20.5){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>20.5){
                            bmiStatus="Obese";
                        }
                    }
                }

            }
            else if(monthAge>=5 && monthAge<=8){
                if(bmi<14.3){
                    bmiStatus="Underweight";
                }
                else{
                    if(monthAge==5){
                        if(bmi>=14.3 && bmi<18.8){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.8 && bmi<=20.6){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>20.6){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==6){
                        if(bmi>=14.30 && bmi<18.90){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.90 && bmi<=20.70){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>20.70){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==7 || monthAge==8){
                        if(bmi>=14.3 && bmi<19){
                            bmiStatus="Normal weight";
                        }
                        else{
                            if(monthAge==7){
                                if(bmi>=19 && bmi<=20.7){
                                    bmiStatus="Overweight";
                                }
                                else if(bmi>20.7){
                                    bmiStatus="Obese";
                                }
                            }
                            if(monthAge==8){
                                if(bmi>=19 && bmi<=20.8){
                                    bmiStatus="Overweight";
                                }
                                else if(bmi>20.8){
                                    bmiStatus="Obese";
                                }
                            }
                        }
                    }
                }

            }
            else if(monthAge>=9 && monthAge<=11){
                if(bmi<14.4){
                    bmiStatus="Underweight";
                }
                else{
                    if(monthAge==9 || monthAge==10){
                        if(bmi>=14.4 && bmi<19.1){
                            bmiStatus="Normal weight"
                        }
                        else{
                            if(monthAge==9){
                                if(bmi>=19.1 && bmi<=20.9){
                                    bmiStatus="Overweight";
                                }
                                else if(bmi>20.9){
                                    bmiStatus="Obese";
                                }
                            }
                            else if(monthAge==10){
                                if(bmi>=19.1 && bmi<=21){
                                    bmiStatus="Overweight";
                                }
                                else if(bmi>21){
                                    bmiStatus="Obese";
                                }
                            }
                        }
                    }
                    else if(monthAge==11){
                        if(bmi>=14.4 && bmi<19.2){
                            bmiStatus="Normal weight"
                        }
                        else if(bmi>=19.2 && bmi<=21){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>21){
                            bmiStatus="Obese";
                        }
                    }
                }

            }
            
        }
        else if(yearAge=="11"){
            if(monthAge==0){
                if(bmi<14.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.5 && bmi<19.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.3 && bmi<=21.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.1){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==1){
                if(bmi<14.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.5 && bmi<19.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.3 && bmi<=21.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.2){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==2){
                if(bmi<14.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.5 && bmi<19.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.4 && bmi<=21.3){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.3){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==3){
                if(bmi<14.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.6 && bmi<19.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.4 && bmi<=21.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.4){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==4){
                if(bmi<14.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.6 && bmi<19.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.5 && bmi<=21.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.4){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==5){
                if(bmi<14.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.6 && bmi<19.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.6 && bmi<=21.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.5){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==6){
                if(bmi<14.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.7 && bmi<19.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.6 && bmi<=21.6){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.6){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==7){
                if(bmi<14.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.7 && bmi<19.7){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.7 && bmi<=21.7){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.7){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==8){
                if(bmi<14.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.7 && bmi<19.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.8 && bmi<=21.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.8){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==9){
                if(bmi<14.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.8 && bmi<19.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.8 && bmi<=21.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.8){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==10){
                if(bmi<14.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.8 && bmi<19.9){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=19.9 && bmi<=21.9){
                    bmiStatus="Overweight";
                }
                else if(bmi>21.9){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==11){
                if(bmi<14.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.9 && bmi<20){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20 && bmi<=22){
                    bmiStatus="Overweight";
                }
                else if(bmi>22){
                    bmiStatus="Obese";
                }
            }
        }
        else if(yearAge=="12"){
            if(monthAge==0){
                if(bmi<14.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.9 && bmi<20.1){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.1 && bmi<=22.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.1){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==1){
                if(bmi<14.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=14.9 && bmi<20.1){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.1 && bmi<=22.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.2){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==2){
                if(bmi<15){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15 && bmi<20.2){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.2 && bmi<=22.3){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.3){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==3){
                if(bmi<15){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15 && bmi<20.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.3 && bmi<=22.3){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.3){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==4){
                if(bmi<15.1){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.1 && bmi<20.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.3 && bmi<=22.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.4){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==5){
                if(bmi<15.1){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.1 && bmi<20.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.4 && bmi<=22.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.5){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==6){
                if(bmi<15.1){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.1 && bmi<20.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.5 && bmi<=22.6){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.6){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==7){
                if(bmi<15.2){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.2 && bmi<20.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.6 && bmi<=22.7){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.7){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==8){
                if(bmi<15.2){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.2 && bmi<20.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.6 && bmi<=22.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.8){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==9){
                if(bmi<15.3){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.3 && bmi<20.7){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.7 && bmi<=22.9){
                    bmiStatus="Overweight";
                }
                else if(bmi>22.9){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==10){
                if(bmi<15.3){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.3 && bmi<20.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.8 && bmi<=23){
                    bmiStatus="Overweight";
                }
                else if(bmi>23){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==11){
                if(bmi<15.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.4 && bmi<20.9){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.9 && bmi<=23.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.1){
                    bmiStatus="Obese";
                }
            }
        }
        else if(yearAge=="13"){
            if(monthAge==0){
                if(bmi<15.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.4 && bmi<20.9){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=20.9 && bmi<=23.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.1){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==1){
                if(bmi<15.4){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.4 && bmi<21){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21 && bmi<=23.2){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.2){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==2){
                if(bmi<15.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.5 && bmi<21.1){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.1 && bmi<=23.3){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.3){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==3){
                if(bmi<15.5){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.5 && bmi<21.2){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.2 && bmi<=23.4){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.4){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==4){
                if(bmi<15.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.6 && bmi<21.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.3 && bmi<=23.5){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.5){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==5){
                if(bmi<15.6){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.6 && bmi<21.3){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.3 && bmi<=23.6){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.6){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==6){
                if(bmi<15.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.7 && bmi<21.4){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.4 && bmi<=23.7){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.7){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==7){
                if(bmi<15.7){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.7 && bmi<21.5){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.5 && bmi<=23.8){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.8){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==8){
                if(bmi<15.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.8 && bmi<21.6){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.6 && bmi<=23.9){
                    bmiStatus="Overweight";
                }
                else if(bmi>23.9){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==9){
                if(bmi<15.8){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.8 && bmi<21.7){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.7 && bmi<=24){
                    bmiStatus="Overweight";
                }
                else if(bmi>24){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==10){
                if(bmi<15.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.9 && bmi<21.7){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.7 && bmi<=24){
                    bmiStatus="Overweight";
                }
                else if(bmi>24){
                    bmiStatus="Obese";
                }
            }
            else if(monthAge==11){
                if(bmi<15.9){
                    bmiStatus="Underweight";
                }
                else if(bmi>=15.9 && bmi<21.8){
                    bmiStatus="Normal weight";
                }
                else if(bmi>=21.8 && bmi<=24.1){
                    bmiStatus="Overweight";
                }
                else if(bmi>24.1){
                    bmiStatus="Obese";
                }
            }
        }
        console.log(bmiStatus);
        res.send(bmiStatus);
    }
    // console.log(bmiStatus);
    // res.send(bmiStatus);
}