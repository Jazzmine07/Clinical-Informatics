const firebase = require('../firebase');
const bodyParser = require('body-parser');
// const { use } = require('../routes');

var TAG = "studentController.js";

exports.addAPE = function(req, res){
    //adds new APE of student with the current school year as the key
    var schoolYear= req.body.schoolYear;
    var age= req.body.age;
    var sectionTop= req.body.section;
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
    var bmiStatus= req.body.bmiStatus;
    console.log(bmiStatus);

    console.log("section(1):" + sectionTop);

    var database = firebase.database();
    var apeRef = database.ref("studentHealthHistory/"+id+"/ape");
    var schedRef=database.ref("apeSchedule");

    if(!sectionTop ==undefined && !sectionTop == null){
        schedRef.orderByChild("section").equalTo(sectionTop).on('value', (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach(function(childSnapshot){
                    childSnapshot.ref.remove();
                    console.log("deleted");
                })
            }
        })
    }

    var record = {
        schoolYear:schoolYear,
        age:age,
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
        bmiStatus:bmiStatus
        // normal: normal
    }


    console.log(schoolYear);
    apeRef.child(schoolYear).set(record);
    // key = apeRef.push(record).key;
    
    res.send({
        success: true,
        success_msg: "Record added!"
    });
}

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
    else if(studentId !=null && (section==null||section=="")){
        //specified student id in array 
        console.log(schoolYear);
        console.log(studentId);
        students.push(studentId);
        res.send(students);
    }
    
}

exports.getAPEPercentage = function(req, res){
    var schoolYear= req.body.schoolYear;
    var t1=0,t2=0,t3=0,t4=0,t5=0,t6=0,c1=0,c2=0,c3=0,c4=0,c5=0,c6=0;
    var p1=0,p2=0,p3=0,p4=0,p5=0,p6=0;
    //t# - total of grade #;
    //c#- total of grade # that got APE
    //p# - percentage of c#/t#

    var database = firebase.database();
    var studentRef = database.ref("studentInfo");
    var healthHistory = database.ref("studentHealthHistory");

    studentRef.on('value', (snapshot) =>{
        snapshot.forEach(function(childSnapshot){
            // lines 522,532,544,554,564,574 is used to check what grade the student belongs to
            // lines 525,536,547,557,567.577 is used to look for the file of the ape of student
            // lines 527-528,538-539,549-550,559-560,569-570.579-580 is used to look through all the ape of the student and check if they have for the specified year
            if(childSnapshot.child("grade").val()=="1"){
                t1=t1+1;
                healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
                    ss.forEach(function(cs){
                        if(cs.key.toString() == schoolYear){
                            c1=c1+1;
                        }
                    })
                });
            }
            else if(childSnapshot.child("grade").val()=="2"){
                console.log(childSnapshot.key);
                t2=t2+1;
                healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
                    ss.forEach(function(cs){
                        if(cs.key.toString() == schoolYear){
                            c2=c2+1;
                        }
                    })
                });

            }
            else if(childSnapshot.child("grade").val()=="3"){
                t3=t3+1;
                healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
                    ss.forEach(function(cs){
                        if(cs.key.toString() == schoolYear){
                            c3=c3+1;
                        }
                    })
                });
            }
            else if(childSnapshot.child("grade").val()=="4"){
                t4=t4+1;
                healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
                    ss.forEach(function(cs){
                        if(cs.key.toString() == schoolYear){
                            c4=c4+1;
                        }
                    })
                });
            }
            else if(childSnapshot.child("grade").val()=="5"){
                t5=t5+1;
                healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
                    ss.forEach(function(cs){
                        if(cs.key.toString() == schoolYear){
                            c5=c5+1;
                        }
                    })
                });
            }
            else if(childSnapshot.child("grade").val()=="6"){
                t6=t6+1;
                healthHistory.child(childSnapshot.key).child("ape").on('value',(ss)=>{
                    ss.forEach(function(cs){
                        if(cs.key.toString() == schoolYear){
                            c6=c6+1;
                        }
                    })
                });
            }
        })
        //computes for the percentage
        p1=c1/t1;
        p2=c2/t2;
        p3=c3/t3;
        p4=c4/t4;
        p5=c5/t5;
        p6=c6/t6;
    
        var data={
            p1:p1,
            p2:p2,
            p3:p3,
            p4:p4,
            p5:p5,
            p6:p6,
            t1:t1,
            t2:t2,
            t3:t3,
            t4:t4,
            t5:t5,
            t6:t6,
            c1:c1,
            c2:c2,
            c3:c3,
            c4:c4,
            c5:c5,
            c6:c6
        };
        res.send(data);
    })      
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
            console.log(section);
            resolve(section);
        });
    });
    return promise;
}

exports.addSchedule=function(req,res){
    var database = firebase.database();
    var schedRef= database.ref("apeSchedule");
    var schedule=[];
    schedule = req.body.schedules;
    var i;
    

    for(i=0;i<schedule.length;i++){
        var currSec= schedule[i].section;
        var count=0;
        schedRef.on('value', (snapshot) =>{
            snapshot.forEach(function(childSnapshot){
                var child = childSnapshot.exportVal();
                // console.log("Child:"+child.section);
                //console.log("Section: "+ currSec);
                if(child.section == currSec){
                    console.log("Has a schedule already");
                    count=count+1;
                }
            }) 
            console.log("counter:"+count);
            if(count==0){
                console.log("pushed");
                schedRef.push(schedule[i]);
            }
            else{
                console.log("no repeat"); //if already has schedule do nothing? 
            }
        });
    }
    res.send("hi");
}

exports.loadPrevData=function(req,res){
    var currSY= req.body.schoolYear;
    var id= req.body.id;
    var start=parseInt(currSY.substr(0,4))-1;
    var end= parseInt(currSY.substr(5,8))-1;
    console.log("Start and End:"+start+" and "+end);
    var prevYear= start+"-"+end;
    
    var database = firebase.database();
    var studentInfoRef= database.ref("studentInfo/"+id);
    var studentHealthHistoryRef= database.ref("studentHealthHistory/"+id+"/ape");
    console.log("Previous Year:"+ prevYear);
    var name,bday,sex;
    var temp="",bp="",pr="",rr="",sf="",weight="",height="",bmi="",bmiStatus="",od="",os="",odGlasses="",osGlasses="";
    var medProb="",allergies="",complaints="",reco="";
    
    console.log("Path1: " + studentInfoRef);
    console.log("Path2: " + studentHealthHistoryRef);

    studentInfoRef.on('value', (snapshot) =>{
            var childValues = snapshot.exportVal();
            console.log("DATA Path1: " + childValues);
            name=childValues.firstName +" "+ childValues.lastName;
            bday=childValues.birthday;
            sex=childValues.sex;
            
            studentHealthHistoryRef.on('value', (snapshot) =>{
                snapshot.forEach(function(childSnapshot){
                    console.log(childSnapshot.key);
                    console.log(prevYear);
                    if(childSnapshot.key==prevYear){
                        var childValues = childSnapshot.exportVal();
                        temp = childValues.temp;
                        bp= childValues.bp;
                        pr= childValues.pr;
                        rr= childValues.rr;
                        sf=childValues.sf;
                        weight = childValues.weight;
                        height= childValues.height;
                        bmi = childValues.bmi;
                        bmiStatus = childValues.bmiStatus;
                        od= childValues.odVision;
                        os= childValues.osVision;
                        odGlasses = childValues.odGlasses;
                        osGlasses= childValues.osGlasses;
                        medProb= childValues.medProb;
                        allergies= childValues.allergies;
                        complaints= childValues.concern;
                        reco= childValues.assess;
                    }
                });
            });
        });
    
    console.log("DATA from studentInfo: " + name + ","+bday+","+sex);
    console.log(temp);
    var data={
        name:name,
        birthday:bday,
        sex:sex,
        temp:temp,
        bp:bp,
        pr:pr,
        rr:rr,
        sf:sf,
        weight:weight,
        height: height,
        bmi:bmi,
        bmiStatus:bmiStatus,
        odVision:od,
        osVision:os,
        odGlasses:odGlasses,
        osGlasses:osGlasses,
        medProb:medProb,
        allergies:allergies,
        complaints:complaints,
        reco:reco
    };
    console.log("Inside"+data.name);
    console.log("Inside"+data.temp);
    res.send(data);
    
}
//function gets the APE schedules 
exports.getAllApeSched=function(){
    //gets all the schedule created for the APE
    var database = firebase.database();
    var schedRef= database.ref("apeSchedule");
    var studentRef = database.ref("studentInfo");
    var schedule=[];
    
    var promise = new Promise((resolve,reject)=>{
        schedRef.once('value', (snapshot) =>{
            snapshot.forEach(function(childSnapshot){
                var childValues = childSnapshot.exportVal();
                var grade;
                var students=[];
                var numStudents;
                console.log("Sections"+childValues.section);
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
                else if(childValues.section=="Trustwortiness"||childValues.section=="Reliability"||childValues.section=="Dependability"||childValues.section=="Responsibility"||childValues.section=="Serenity"||childValues.section=="Flexibility"){
                    grade="5";
                }
                else if(childValues.section=="Self-Discipline"||childValues.section=="Self-Giving"||childValues.section=="Abnegation"||childValues.section=="Integrity"||childValues.section=="Perseverance"||childValues.section=="Patience"){
                    grade="6";
                }
    
                studentRef.orderByChild("section").equalTo(childValues.section).on('value', (ss) => {
                    if(ss.exists()){
                        ss.forEach(function(cs){
                            // console.log("looking for section:" + childValues.section);
                            // console.log("Key: "+cs.key);
                            // console.log("Section: "+cs.child("section").val());
                            // console.log("Id Number: "+cs.child("idNum").val());
                            students.push(cs.key);
                        })
                        console.log("Students in "+ childValues.section +":"+students.length);
                    }
                });
    
                record={
                    grade:grade,
                    section:childValues.section,
                    numStudents:students.length,
                    examDate:childValues.date,
                    time:childValues.time
                }
                //console.log(record);
                schedule.push(record);
    
            }) 
            console.log("Schedule size:" + schedule.length);
            resolve(schedule);
            reject(schedule);
        });
    })
    return promise;
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
                        if(bmi>=14.3 && bmi<18.9){
                            bmiStatus="Normal weight";
                        }
                        else if(bmi>=18.9 && bmi<=20.7){
                            bmiStatus="Overweight";
                        }
                        else if(bmi>20.7){
                            bmiStatus="Obese";
                        }
                    }
                    else if(monthAge==7 || monthAge==8){
                        if(bmi>=14.3 && bmi<19){
                            bmiStatus="Normal weight";
                        }
                        else{
                            if(monthAge==10){
                                if(bmi>=19 && bmi<=20.7){
                                    bmiStatus="Overweight";
                                }
                                else if(bmi>20.7){
                                    bmiStatus="Obese";
                                }
                            }
                            if(monthAge==11){
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
}