const firebase = require('../firebase');

//----------------- CLINIC VISIT REPORT FUNCTIONS-----------------------------

//This function is used to get the top 5 medicines used
exports.getTop5MedsUsedMonth = function(req, res){
    console.log("ENTERS getTop5MedsUsedMonth function");
    var database = firebase.database();
    var databaseRef = database.ref();
    var intakeRef = database.ref("intakeHistory");
    var i, j, temp = [], filtered = [], top5 = [];
    var g1Count = [], g2Count = [], g3Count = [], g4Count = [], g5Count = [], g6Count = [];
    var pass=[];
    var start=req.query.start;
    var end=req.query.end;
    var startDate=[],endDate=[]
    startDate = start.split("-");
    endDate = end.split("-");
    
    console.log("DATES");
    console.log(startDate)
    console.log(endDate);
    var dataDateSplit=[];
    if(startDate[2][0]==0){
        var startDay=startDate[2][1];
    }
    else{
        var startDay=startDate[2];
    }
    if(endDate[2][0]==0){
        var endDay=endDate[2][1];
    }
    else{
        var endDay=endDate[2];
    }

    console.log("DEATH AWAITS");

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("intakeHistory")){
            intakeRef.once('value', async (childSnapshot) => { // year
                await childSnapshot.forEach(function(innerChildSnapshot){
                    innerChildSnapshot.child('medications').forEach(function(medications){
                        var date = innerChildSnapshot.child("visitDate").exportVal();
                        
                        dataDateSplit= date.split("-");
                        var day="";
                        if(dataDateSplit[2][0]==0){
                            day=dataDateSplit[2][1];
                        }
                        else{
                            day=dataDateSplit[2];
                        }

                        medications = medications.exportVal();



                        //year, month,day
                        if(startDate[0] < dataDateSplit[0]){
                            if(dataDateSplit[0] < endDate[0]){
                                temp.push({ // getting all the medications regardless of grade level
                                    medicineName: medications.medicineName,
                                    grade:innerChildSnapshot.child("grade").exportVal(),
                                    visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                                    section:innerChildSnapshot.child("section").exportVal(),
                                })
                            }
                            else if(dataDateSplit[0] == endDate[0]){
                                if(dataDateSplit[1] < endDate[1]){
                                    temp.push({ // getting all the medications regardless of grade level
                                        medicineName: medications.medicineName,
                                        grade:innerChildSnapshot.child("grade").exportVal(),
                                        visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                                        section:innerChildSnapshot.child("section").exportVal(),
                                    })
                                }
                                else if(dataDateSplit[1] == endDate[1]){
                                    if(dataDateSplit[1] <= endDate[1]){
                                        temp.push({ // getting all the medications regardless of grade level
                                            medicineName: medications.medicineName,
                                            grade:innerChildSnapshot.child("grade").exportVal(),
                                            visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                                            section:innerChildSnapshot.child("section").exportVal(),
                                        })
                                    }   
                                }
                            }
                        }
                        else if(startDate[0] == dataDateSplit[0]){
                            if(dataDateSplit[0] < endDate[0]){
                                if(startDate[1] < dataDateSplit[1]){
                                    temp.push({ // getting all the medications regardless of grade level
                                        medicineName: medications.medicineName,
                                        grade:innerChildSnapshot.child("grade").exportVal(),
                                        visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                                        section:innerChildSnapshot.child("section").exportVal(),
                                    })
                                }
                                else if(startDate[1] == dataDateSplit[1]){
                                    if(startDate[1] <= dataDateSplit[1]){
                                        temp.push({ // getting all the medications regardless of grade level
                                            medicineName: medications.medicineName,
                                            grade:innerChildSnapshot.child("grade").exportVal(),
                                            visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                                            section:innerChildSnapshot.child("section").exportVal(),
                                        })
                                    }
                                }
                            }
                            else if(dataDateSplit[0] == endDate[0]){
                                if(startDate[1] < dataDateSplit[1]){
                                    if(dataDateSplit[1] < endDate[1]){
                                        temp.push({ // getting all the medications regardless of grade level
                                            medicineName: medications.medicineName,
                                            grade:innerChildSnapshot.child("grade").exportVal(),
                                            visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                                            section:innerChildSnapshot.child("section").exportVal(),
                                        })
                                    }
                                    else if(dataDateSplit[1] == endDate[1]){
                                        if(dataDateSplit[2] <= endDate[2]){
                                            temp.push({ // getting all the medications regardless of grade level
                                                medicineName: medications.medicineName,
                                                grade:innerChildSnapshot.child("grade").exportVal(),
                                                visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                                                section:innerChildSnapshot.child("section").exportVal(),
                                            })
                                        }
                                    }
                                }
                                else if(startDate[1] == dataDateSplit[1]){
                                    if(dataDateSplit[1] < endDate[1]){
                                        if(startDate[2] <= dataDateSplit[2]){
                                            temp.push({ // getting all the medications regardless of grade level
                                                medicineName: medications.medicineName,
                                                grade:innerChildSnapshot.child("grade").exportVal(),
                                                visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                                                section:innerChildSnapshot.child("section").exportVal(),
                                            })
                                        }
                                    }
                                    else if(dataDateSplit[1] == endDate[1]){
                                        if(startDate[2] < dataDateSplit[2]){
                                            if(dataDateSplit[2] <= endDate[2]){
                                                temp.push({ // getting all the medications regardless of grade level
                                                    medicineName: medications.medicineName,
                                                    grade:innerChildSnapshot.child("grade").exportVal(),
                                                    visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                                                    section:innerChildSnapshot.child("section").exportVal(),
                                                })
                                            }
                                        }
                                        else if(startDate[2] == dataDateSplit[2]){
                                            if(dataDateSplit[2] <= endDate[2]){
                                                temp.push({ // getting all the medications regardless of grade level
                                                    medicineName: medications.medicineName,
                                                    grade:innerChildSnapshot.child("grade").exportVal(),
                                                    visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                                                    section:innerChildSnapshot.child("section").exportVal(),
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        






                        // if( (dataDateSplit[0]>=startDate[0] && dataDateSplit[0]<=endDate[0])){
                        //     temp.push({ // getting all the medications regardless of grade level
                        //         medicineName: medications.medicineName,
                        //         grade:innerChildSnapshot.child("grade").exportVal(),
                        //         visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                        //         section:innerChildSnapshot.child("section").exportVal(),
                        //     })
                        // }
                        // else{
                        //     if((dataDateSplit[1]>=startDate[1] && dataDateSplit[1]<=endDate[1])){
                        //         temp.push({ // getting all the medications regardless of grade level
                        //             medicineName: medications.medicineName,
                        //             grade:innerChildSnapshot.child("grade").exportVal(),
                        //             visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                        //             section: innerChildSnapshot.child("section").exportVal(),
                        //         })
                        //     }
                        //     else{
                        //         if((day>=startDay && day<=endDay) ){
                        //             temp.push({ // getting all the medications regardless of grade level
                        //                 medicineName: medications.medicineName,
                        //                 grade:innerChildSnapshot.child("grade").exportVal(),
                        //                 visitDate:innerChildSnapshot.child("visitDate").exportVal(),
                        //                 section: innerChildSnapshot.child("section").exportVal(),
                        //             })
                        //         }
                        //     }
                        // }

                    })
                    
                })

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
                //var top = filtered[0].medicineName;
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

//-----------------END OF CLINIC VISIT REPORT FUNCTIONS-----------------------------



//-----------------HEALTH ASSESSMENT REPORT FUNCTIONS-----------------------------

// This function is used to get the id numbers of the students without Annual Physical and Dental Exams
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
    console.log("SCHOOL YEAR:");
    console.log(sy);

    studentInfoRef.once('value',(studentsList)=>{
        studentsList.forEach(function(studentInfo){
            var sInfo= studentInfo.exportVal();
            var sFullName = sInfo.firstName + " " + sInfo.middleName.substring(0)  +" " + sInfo.lastName
            tempList.push({student:studentInfo.key, studentName:sFullName, grade:sInfo.grade,section:sInfo.section, apeYears:[],adeYears:[]})             
        })
    })

    var promise = new Promise((resolve,reject)=>{

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
            console.log(sy);
            for(i=0;i<tempList.length;i++){
                //APE
                if( tempList[i].apeYears.length > 0 ){
                    if(tempList[i].apeYears[tempList[i].apeYears.length - 1] != sy){
                        if(tempList[i].grade == "1"){
                            noApeList[0].grade1.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }
                        else if(tempList[i].grade == "2"){
                            noApeList[1].grade2.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }
                        else if(tempList[i].grade == "3"){
                            noApeList[2].grade3.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }else if(tempList[i].grade == "4"){
                            noApeList[3].grade4.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }else if(tempList[i].grade == "5"){
                            noApeList[4].grade5.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }else if(tempList[i].grade == "6"){
                            noApeList[5].grade6.push({id:tempList[i].student,name:tempList[i].studentName, grade:tempList[i].grade, section:tempList[i].section});
                        }
                    }
                }
                else if( tempList[i].apeYears.length == 0){
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
                    if(tempList[i].adeYears[tempList[i].adeYears.length-1] != sy){
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
                else{
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
            noRecord.push(sy);
            console.log(noRecord);
            resolve(noRecord);
        })
    })
    return promise;
}

//-----------------END OF HEALTH ASSESSMENT REPORT FUNCTIONS-----------------------------