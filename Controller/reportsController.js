const firebase = require('../firebase');

exports.getTop5MedsUsedMonth = function(req, res){
    var database = firebase.database();
    var databaseRef = database.ref();
    var intakeRef = database.ref("intakeHistory");
    var i, temp = [], filtered = [], top5 = [];
    var g1Count = [], g2Count = [], g3Count = [], g4Count = [], g5Count = [], g6Count = [];
    var pass=[];

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("usedMedicine")){
            intakeRef.once('value', (childSnapshot) => { // year
                childSnapshot.forEach(function(innerChildSnapshot){
                    innerChildSnapshot.child('medications').forEach(function(medications){
                        medications = medications.exportVal();
                        console.log("medications in controller");
                        console.log(medications);
                        temp.push({ // getting all the medications regardless of grade level
                            medicineName: medications.medicineName,
                            grade:innerChildSnapshot.child("grade").exportVal(),
                        })
                    })
                    
                })

                console.log("temp medications");
                console.log(temp);
                
                temp.forEach(medicine => {
                    var found = false;
                    for(i = 0; i < filtered.length; i++){
                        if(medicine.medicineName == filtered[i].medicineName){   // filters if same medicine name and same date
                            found = true;
                            filtered[i].count++;
                            break;
                        } 
                    }
                    if(!found){
                        filtered.push({
                            medicineName: medicine.medicineName,
                            count: 1,
                        })
                    }    
                })
                console.log("filtered intake medicine");
                console.log(filtered);
                var top = filtered[0].medicineName;
                // for(i = 0; i < filtered.length; i++){
                //     if(filtered[i].count >= top){
                //         top = filtered[0].medicineName;
                //         if()
                //         top5.push({

                //         })
                //     }
                // }
                pass.push(temp);
                pass.push(filtered);

                res.status(200).send(pass);
            })
        } else {
            res.status(200).send(pass);
        }
    })
};


//-----------------HEALTH ASSESSMENT REPORT FUNCTIONS-----------------------------
exports.getStudentsNoCurrYearRecord = function(req, res){
    var database = firebase.database();
    var databaseRef = database.ref();
    var healthHistory= database.ref("studentHealthHistory");
    var studentInfoRef = database.ref("studentInfo");
    var tempSyCheck=[], tempList=[];
    var noApeList=[{grade1:[]},{grade2:[]},{grade3:[]},{grade4:[]},{grade5:[]},{grade6:[]}];
    var noAdeList=[{grade1:[]},{grade2:[]},{grade3:[]},{grade4:[]},{grade5:[]},{grade6:[]}];
    var noRecord=[];
    var noApeGrade1= [],noApeGrade2= [],noApeGrade3= [],noApeGrade4= [],noApeGrade5= [],noApeGrade6= [];
    var noAdeGrade1= [],noAdeGrade2= [],noAdeGrade3= [],noAdeGrade4= [],noAdeGrade5= [],noAdeGrade6= [];
    var grade, studentId, checker=false, checker2=false,i,j;

    var currentTime = new Date()
    var month = currentTime.getMonth()+1; //(0-11 so +1 to make it the usual)
    var currYear = currentTime.getFullYear();
    //var month=1;
    //var currYear=2021;
    if(month>=6){
        var sy= currYear +"-"+ (currYear+1) ;
    }
    else{
        var sy= (currYear-1) +"-"+ (currYear) ;
    }

    studentInfoRef.once('value',(studentsList)=>{
        studentsList.forEach(function(studentInfo){
            var sInfo= studentInfo.exportVal();
            var sFullName = sInfo.firstName + " " + sInfo.middleName.substring(0)  +" " + sInfo.lastName
            tempList.push({student:studentInfo.key, studentName:sFullName, grade:sInfo.grade,section:sInfo.section, apeYears:[],adeYears:[]})             
        })
    })

    var promise = new Promise((resolve,reject)=>{
        console.log("STUDENTS WITHOUT APE");
        healthHistory.once('value',(students)=>{
            students.forEach(function(student){
                student.child("ape").forEach(function(year){
                    if(year.exists()){
                        for(i=0;i<tempList.length;i++){
                            if(tempList[i].student == student.key){
                                tempList[i].apeYears.push(year.key);
                            }
                        }
                    }
                })
                student.child("ade").forEach(function(year2){
                    if(year2.exists()){
                        for(i=0;i<tempList.length;i++){
                            if(tempList[i].student == student.key){
                                tempList[i].adeYears.push(year2.key);
                            }
                        }
                    }
                })                

            })
            console.log(tempList.length);
            for(i=0;i<tempList.length;i++){

                //APE
                if(tempList[i].apeYears.length > 0){
                    if(!tempList[i].apeYears[tempList[i].apeYears.length-1] == sy){
                        if(tempList[i].grade=="1"){
                            noApeList[0].grade1.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }
                        else if(tempList[i].grade=="2"){
                            noApeList[1].grade2.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }
                        else if(tempList[i].grade=="3"){
                            noApeList[2].grade3.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }else if(tempList[i].grade=="4"){
                            noApeList[3].grade4.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }else if(tempList[i].grade=="5"){
                            noApeList[4].grade5.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }else if(tempList[i].grade=="6"){
                            noApeList[5].grade6.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }
                    }
                }
                else if(tempList[i].apeYears.length == 0){
                    if(tempList[i].grade=="1"){
                        noApeList[0].grade1.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }
                    else if(tempList[i].grade=="2"){
                        noApeList[1].grade2.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }
                    else if(tempList[i].grade=="3"){
                        noApeList[2].grade3.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }else if(tempList[i].grade=="4"){
                        noApeList[3].grade4.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }else if(tempList[i].grade=="5"){
                        noApeList[4].grade5.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }else if(tempList[i].grade=="6"){
                        noApeList[5].grade6.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }
                }
                //ADE
                if(tempList[i].adeYears.length > 0){
                    if(!tempList[i].adeYears[tempList[i].adeYears.length-1] == sy){
                        if(tempList[i].grade=="1"){
                            noAdeList[0].grade1.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }
                        else if(tempList[i].grade=="2"){
                            noAdeList[1].grade2.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }
                        else if(tempList[i].grade=="3"){
                            noAdeList[2].grade3.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }else if(tempList[i].grade=="4"){
                            noAdeList[3].grade4.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }else if(tempList[i].grade=="5"){
                            noAdeList[4].grade5.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }else if(tempList[i].grade=="6"){
                            noAdeList[5].grade6.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }
                    }
                }
                else if(tempList[i].adeYears.length==0){
                    if(tempList[i].grade=="1"){
                        noAdeList[0].grade1.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }
                    else if(tempList[i].grade=="2"){
                        noAdeList[1].grade2.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }
                    else if(tempList[i].grade=="3"){
                        noAdeList[2].grade3.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }else if(tempList[i].grade=="4"){
                        noAdeList[3].grade4.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }else if(tempList[i].grade=="5"){
                        noAdeList[4].grade5.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }else if(tempList[i].grade=="6"){
                        noAdeList[5].grade6.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                    }
                }
            }
            noRecord.push(noApeList);
            noRecord.push(noAdeList);
            console.log(noRecord);
            resolve(noRecord);
        })
    })
    return promise;
}

// exports.getStudentsNoCurrYearRecord = function(req, res){

// }


//-----------------HEALTH ASSESSMENT REPORT FUNCTIONS-----------------------------