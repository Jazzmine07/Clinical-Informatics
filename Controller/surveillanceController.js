const firebase = require('../firebase');

//HERE ARE THE FUNCTIONS FOR DISEASE SURVEILLANCE
//function returns an array that contains the clinic visit(visitDate, id, diagnosis)
exports.getDiseaseSurveillanceData=function(){
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timeStamp");
    var temp=[];
    var childSnapshotData;
    

    var promise = new Promise((resolve,reject) => {
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("clinicVisit")){
                query.on('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){ // Getting primary keys of users
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            diagnosis:childSnapshotData.diagnosis,
                            visitDate:childSnapshotData.visitDate,
                            id:childSnapshotData.id
                        })
                    })
                    
                })
            }
            console.log("temp array");
            console.log(temp);
            resolve (temp);
        })
    })
    return promise;
}
//function returns strings of top diagnosis for week and month - dependent on current date
exports.getTopDisease=function(vcArray){

    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timeStamp");
    var temp=vcArray, strings=[];
    var vcWeek=[], weekTopDisease=[], stringWeekTopDisease=""; // variables for top disease week
    var vcMonth=[], monthTopDisease=[], stringMonthTopDisease=""; // variables for top disease month
    var childSnapshotData;
    var parts, dbDate,alreadyAdded;
    var currDate =  new Date();
    var today = new Date();
    var weekAgo=new Date(today.setDate(today.getDate() - 7));
    var i,j,vCount;


    //getting only the clinic visits current week
    for(i=0;i<temp.length;i++){
        parts =temp[i].visitDate.split('-'); // January - 0, February - 1, etc.
        dbDate = new Date(parts[0], parts[1] - 1, parts[2]); //date gotten from Db
        alreadyAdded=0;
        if(dbDate<=currDate && dbDate>=weekAgo){
            if(vcWeek==null){ //if empty auto add
                if(temp[i].diagnosis!=""){
                    vcWeek.push({
                        concern: temp[i].diagnosis,
                        count:1
                    })
                }
            }
            else{ //if not empty
                for(j=0;j<vcWeek.length;j++){ //this whole thing is used to check if it has a count
                    if(vcWeek[j].concern.toLowerCase()==temp[i].diagnosis.toLowerCase()){ 
                        vcWeek[j].count=vcWeek[j].count+1;
                        alreadyAdded=1;
                    }
                }
                if(alreadyAdded!=1){
                    if(temp[i].diagnosis!=""){
                        vcWeek.push({
                            concern: temp[i].diagnosis,
                            count:1
                        })
                    }
                }
            }
        }
    }
    //getting only the clinic visits current month
    for(i=0;i<temp.length;i++){
        parts =temp[i].visitDate.split('-'); // January - 0, February - 1, etc.
        dbDate = new Date(parts[0], parts[1] - 1, parts[2]); //date gotten from Db
        alreadyAdded=0;
        if(dbDate.getMonth()==currDate.getMonth() && dbDate.getFullYear()==currDate.getFullYear()){
            if(vcMonth==null){ //if empty auto add
                if(temp[i].diagnosis!=""){
                    vcMonth.push({
                        concern: temp[i].diagnosis,
                        count:1
                    })
                }
            }
            else{ //if not empty
                for(j=0;j<vcMonth.length;j++){ //this whole thing is used to check if it has a count
                    if(vcMonth[j].concern.toLowerCase()==temp[i].diagnosis.toLowerCase()){ 
                        vcMonth[j].count=vcMonth[j].count+1;
                        alreadyAdded=1;
                    }
                }
                if(alreadyAdded!=1){
                    if(temp[i].diagnosis!=""){
                        vcMonth.push({
                            concern: temp[i].diagnosis,
                            count:1
                        })
                    }
                }
            }
        }

    }

    //finding top Disease/s for the week
    if(vcWeek.length>=0){
        for(i=0;i<vcWeek.length;i++){
            vCount=vcWeek[i].count;
            if(weekTopDisease.length>0){                        
                if(weekTopDisease.length>1){
                    if(vCount>weekTopDisease[0].count){
                        while(weekTopDisease.length > 0) {
                            weekTopDisease.pop();
                        }
                        console.log(vcWeek[i].concern);
                        weekTopDisease.push({
                            concern:vcWeek[i].concern,
                            count:vcWeek[i].count
                        });
                    }
                    else if(vCount==weekTopDisease[0].count){
                        console.log(vcWeek[i].concern);
                        weekTopDisease.push({
                            concern:vcWeek[i].concern,
                            count:vcWeek[i].count
                        });
                    }
                }
                else{ //has only 1 at the moment
                    if(vCount > weekTopDisease[0].count){
                        while(weekTopDisease.length > 0) {
                            weekTopDisease.pop();
                        }
                        console.log(vcWeek[i].concern);
                        weekTopDisease.push({
                            concern:vcWeek[i].concern,
                            count:vcWeek[i].count
                        });
                    }
                    else if(vCount==weekTopDisease[0].count){
                        weekTopDisease.push({
                            concern:vcWeek[i].concern,
                            count:vcWeek[i].count
                        });
                    }
                }
            }
            else{
                weekTopDisease.push({
                    concern:vcWeek[i].concern,
                    count:vcWeek[i].count
                });
            }
        }
    }
    //finding top Disease/s for the month
    if(vcMonth.length>=0){
        for(i=0;i<vcMonth.length;i++){
            vCount=vcMonth[i].count;
            if(monthTopDisease.length>0){                        
                if(monthTopDisease.length>1){
                    if(vCount>monthTopDisease[0].count){
                        while(monthTopDisease.length > 0) {
                            monthTopDisease.pop();
                        }
                        monthTopDisease.push(vcMonth[i]);
                    }
                    else if(vCount==monthTopDisease[0].count){
                        monthTopDisease.push(vcMonth[i]);
                    }
                }
                else{ //has only 1 at the moment
                    if(vCount > monthTopDisease[0].count){
                        while(monthTopDisease.length > 0) {
                            monthTopDisease.pop();
                        }
                        monthTopDisease.push(vcMonth[i]);
                    }
                    else if(vCount==monthTopDisease[0].count){
                        monthTopDisease.push(vcMonth[i]);
                    }
                }
            }
            else{
                monthTopDisease.push(vcMonth[i]);
            }
        }
    }

    //appending all top disease of the week
    if(weekTopDisease!=null){
        for(i=0;i<weekTopDisease.length;i++){
            stringWeekTopDisease =stringWeekTopDisease +weekTopDisease[i].concern;
            if(i!=weekTopDisease.length-1){
                stringWeekTopDisease=stringWeekTopDisease+",";
            }
        }
    }
    //appending all top disease of the month
    if(monthTopDisease!=null){
        for(i=0;i<monthTopDisease.length;i++){
            stringMonthTopDisease =stringMonthTopDisease +monthTopDisease[i].concern;
            if(i!=weekTopDisease.length-1){
                stringMonthTopDisease=stringMonthTopDisease+",";
            }
        }
    }     
    
    strings.push(stringWeekTopDisease);
    strings.push(weekTopDisease[0].count);
    strings.push(stringMonthTopDisease);
    strings.push(monthTopDisease[0].count)
    console.log("STRINGS of top disease");
    console.log(strings);
        
    return strings;

}
//function is used to get data for chart which is dependent on disease and date range
exports.getDiseaseDemographics=function(req,res){
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var studentInfoRef = database.ref("studentInfo");
    var query = clinicVisitRef.orderByChild("timeStamp");

    var temp=[],temp2=[],temp3=[];
    var childSnapshotData, csData;
    var i,j,alreadyAdded;
    var studentInfo=[],sex, grade;
    var disease= req.body.disease;
    console.log("DISEASE from frontend:"+disease);
    var start=req.body.startDate;
    var end=req.body.endDate;
    var chartData=[{
        Truthfulness:0,Sincerity:0, Honesty:0, Faithfulness:0, Humility:0, Politeness:0, 
        Simplicity:0, Charity:0, Helpfulness:0, Gratefulness:0, Gratitude:0, Meekness:0, 
        Courtesy:0, Respect:0, Trust:0, Kindness:0, Piety:0, Prayerfullness:0, 
        Fidelity:0, Equality:0, Harmony:0, Unity:0, Piety:0, Solidarity:0, 
        Trustworthiness:0,Reliability:0, Dependability:0, Responsibility:0, Serenity:0, Flexibility:0, 
        SelfDiscipline:0, SelfGiving:0, Abnegation:0, Integrity:0, Patience:0, Perseverance:0
    }];

    var startSplit,endSplit, startDate,endDate;
    
    databaseRef.once('value', (snapshot) => {
        //this gets the clinicVisit data into the temp array
        if(snapshot.hasChild("clinicVisit")){
            query.on('value', (childSnapshot) => {
                childSnapshot.forEach(function(innerChildSnapshot){ // Getting primary keys of users
                    childSnapshotData = innerChildSnapshot.exportVal();
                    temp.push({
                        diagnosis:childSnapshotData.diagnosis,
                        visitDate:childSnapshotData.visitDate,
                        id:childSnapshotData.id
                    })
                })
                
            })
        }
        //temp where data is filtered by date
        for(i=0;i<temp.length;i++){
            parts=temp[i].visitDate.split('-');
            startSplit= start.split('-');
            endSplit = end.split('-');
            dbDate = new Date(parts[0], parts[1] - 1, parts[2]); //date gotten from Db
            startDate = new Date(startSplit[0], startSplit[1] - 1, startSplit[2]);
            endDate = new Date(endSplit[0], endSplit[1] - 1, endSplit[2]);

            if(dbDate<=endDate && dbDate>=startDate){
                temp2.push(temp[i]);
            }
    
        }
        //temp2 which is date filtered is further filtered by disease chosen
        for(i=0;i<temp2.length;i++){
            if(temp2[i].diagnosis.toLowerCase()==disease.toLowerCase()){
                temp3.push(temp2[i]);
            }
        }

        //get data from studentInfo based on temp3
        if(snapshot.hasChild("studentInfo")){
            for(i=0;i<temp3.length;i++){               
                studentInfoRef.child(temp3[i].id).on('value', (childSnapshot) => {
                    alreadyAdded=0;
                    if(studentInfo.length<=0){
                        alreadyAdded=1;
                        studentInfo.push({
                            id:childSnapshot.key,
                            sex:childSnapshot.child("sex").val(),
                            grade:childSnapshot.child("grade").val(),
                            section:childSnapshot.child("section").val()
                        })
                    }
                    else{
                        for(j=0;j<studentInfo.length;j++){
                            if(childSnapshot.key==studentInfo[j].id){
                                alreadyAdded=1;
                            }
                            else{
                                if(alreadyAdded==0){
                                    studentInfo.push({
                                        id:childSnapshot.key,
                                        sex:childSnapshot.child("sex").val(),
                                        grade:childSnapshot.child("grade").val(),
                                        section:childSnapshot.child("section").val()
                                    })  
                                    alreadyAdded=1;
                                }
                            }
                        }
                    } 
                                       
                })
            }
        }


        //ADD Grade 3-6 pa
        //combining to get chart data
        for(i=0;i<temp3.length;i++){
            for(j=0;j<studentInfo.length;j++){
                if(temp3[i].id==studentInfo[j].id){
                    if(studentInfo[j].section=="Truthfulness"){
                        chartData[0].Truthfulness=chartData[0].Truthfulness+1;
                    }
                    else if(studentInfo[j].section=="Sincerity"){
                        chartData[0].Sincerity=chartData[0].Sincerity+1;
                    }
                    else if(studentInfo[j].section=="Honesty"){
                        chartData[0].Honesty=chartData[0].Honesty+1;
                    }
                    else if(studentInfo[j].section=="Faithfulness"){
                        chartData[0].Faithfulness=chartData[0].Faithfulness+1;
                    }
                    else if(studentInfo[j].section=="Humility"){
                        chartData[0].Humility=chartData[0].Humility+1;
                    }
                    else if(studentInfo[j].section=="Politeness"){
                        chartData[0].Politeness=chartData[0].Politeness+1;
                    }
                    if(studentInfo[j].section=="Simplicity"){
                        chartData[0].Simplicity=chartData[0].Simplicity+1
                    }
                    else if(studentInfo[j].section=="Charity"){
                        chartData[0].Charity=chartData[0].Charity+1
                    }
                    else if(studentInfo[j].section=="Helpfulness"){
                        chartData[0].Helpfulness=chartData[0].Helpfulness+1
                    }
                    else if(studentInfo[j].section=="Gratefulness"){
                        chartData[0].Gratefulness=chartData[0].Gratefulness+1
                    }
                    else if(studentInfo[j].section=="Gratitude"){
                        chartData[0].Gratitude=chartData[0].Gratitude+1
                    }
                    else if(studentInfo[j].section=="Meekness"){
                        chartData[0].Meekness=chartData[0].Meekness+1
                    }
                
                }
            }
        }


        // console.log("ARRAYs");
        // console.log(temp);
        // console.log(temp2);
        // console.log(temp3);
        // console.log(studentInfo);
        console.log(chartData);
        res.send(chartData);
    })
    
    
}
//DISEASE SURVEILLANCE FUNCTIONS END HERE



//USED IN THE DASHBOARD CHARTS
//used for Dashboard to get disease count in certain time period
exports.getVisitReasonCount=function(req,res){
    console.log("enters")
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var studentInfoRef = database.ref("studentInfo");
    var query = clinicVisitRef.orderByChild("timeStamp");

    var temp=[],temp2=[];
    //var temp3=[], g1=0,g2=0,g3=0,g4=0,g5=0,g6=0;
    var childSnapshotData, csData;
    var i,j,alreadyAdded;
    var start=req.body.startDate;
    var end=req.body.endDate;
    var from = req.body.from;

    var startSplit,endSplit, startDate,endDate;
    databaseRef.once('value', (snapshot) => {
        //this gets the clinicVisit data into the temp array
        if(snapshot.hasChild("clinicVisit")){
            query.on('value', (childSnapshot) => {
                childSnapshot.forEach(function(innerChildSnapshot){ // Getting primary keys of users
                    childSnapshotData = innerChildSnapshot.exportVal();
                    temp.push({
                        visitReason:childSnapshotData.visitReason,
                        visitDate:childSnapshotData.visitDate,
                        id:childSnapshotData.id,
                        grade:childSnapshotData.grade
                    })
                })
                
            })
        }
        console.log("temp:");
        console.log(temp);
        //temp where data is filtered by date and gets the count of each disease
        for(i=0;i<temp.length;i++){
            parts=temp[i].visitDate.split('-');
            startSplit= start.split('-');
            endSplit = end.split('-');
            dbDate = new Date(parts[0], parts[1] - 1, parts[2]); //date gotten from Db
            startDate = new Date(startSplit[0], startSplit[1] - 1, startSplit[2]);
            endDate = new Date(endSplit[0], endSplit[1] - 1, endSplit[2]);
            alreadyAdded=0;
            if(dbDate<=endDate && dbDate>=startDate){
                // temp2.push(temp[i]);
                if(temp2==null){ //if empty auto add
                    if(temp[i].visitReason!=""){
                        temp2.push({
                            concern: temp[i].visitReason,
                            count:1
                        })
                    }
                }
                else{ //if not empty
                    for(j=0;j<temp2.length;j++){ //this whole thing is used to check if it has a count
                        if(temp2[j].concern.toLowerCase()==temp[i].visitReason.toLowerCase()){ 
                            temp2[j].count=temp2[j].count+1;
                            alreadyAdded=1;
                        }
                    }
                    if(alreadyAdded!=1){
                        if(temp[i].visitReason!=""){
                            temp2.push({
                                concern: temp[i].visitReason,
                                count:1
                            })
                        }
                    }
                }
            }
    
        }



        //temp2 = only symptoms in a certain date range
        console.log("getDiseaseCount array");
        console.log(temp2);
        if(from=="dashboard"){
            res.send(temp2);
        }
        else{
            return temp2;
        }
        

    })
    
    
}
exports.getVRCountByGradeInMonth=function(req,res){
    console.log("enters")
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var studentInfoRef = database.ref("studentInfo");
    var query = clinicVisitRef.orderByChild("timeStamp");

    var temp=[],temp2=[];
    var temp3=[];
    var childSnapshotData, csData;
    var i,j,k,alreadyAddedTemp2,alreadyAddedTemp3;
    var today= new Date();
    var curr=today.toString();
    var monthToday = today.getMonth();
    var from = req.body.from;

    databaseRef.once('value', (snapshot) => {
        //this gets the clinicVisit data into the temp array
        if(snapshot.hasChild("clinicVisit")){
            query.on('value', (childSnapshot) => {
                childSnapshot.forEach(function(innerChildSnapshot){ // Getting primary keys of users
                    childSnapshotData = innerChildSnapshot.exportVal();
                    temp.push({
                        visitReason:childSnapshotData.visitReason,
                        visitDate:childSnapshotData.visitDate,
                        id:childSnapshotData.id,
                        grade:childSnapshotData.grade
                    })
                })
                
            })
        }
        console.log("temp:");
        console.log(temp);
        //temp where data is filtered by date and gets the count of each disease
        for(i=0;i<temp.length;i++){
            partsDb=temp[i].visitDate.split('-');
            
            alreadyAddedTemp2=0;
            alreadyAddedTemp3=0;
            if(partsDb[1]-1 == monthToday){
                // temp2.push(temp[i]);
                if(temp3==null){ //if empty auto add
                    if(temp[i].visitReason!=""){
                        // temp2.push({
                        //     concern: temp[i].visitReason,
                        //     count:1
                        // })

                        if(temp[i].grade=="1"){
                           temp3.push({
                               concern: temp[i].visitReason,
                               g1:1,
                               g2:0,
                               g3:0,
                               g4:0,
                               g5:0,
                               g6:0
                           })
                        }
                        else if(temp[i].grade=="2"){
                            temp3.push({
                                concern: temp[i].visitReason,
                                g1:0,
                                g2:1,
                                g3:0,
                                g4:0,
                                g5:0,
                                g6:0
                            })
                        } 
                        if(temp[i].grade=="3"){
                            temp3.push({
                                concern: temp[i].visitReason,
                                g1:0,
                                g2:0,
                                g3:1,
                                g4:0,
                                g5:0,
                                g6:0
                            })
                        }
                        if(temp[i].grade=="4"){
                            temp3.push({
                                concern: temp[i].visitReason,
                                g1:0,
                                g2:0,
                                g3:0,
                                g4:1,
                                g5:0,
                                g6:0
                            })
                        }
                        if(temp[i].grade=="5"){
                            temp3.push({
                                concern: temp[i].visitReason,
                                g1:0,
                                g2:0,
                                g3:0,
                                g4:0,
                                g5:1,
                                g6:0
                            })
                        }
                        if(temp[i].grade=="6"){
                            temp3.push({
                                concern: temp[i].visitReason,
                                g1:0,
                                g2:0,
                                g3:0,
                                g4:0,
                                g5:0,
                                g6:1
                            })
                        }
                    }
                }
                else{ //if not empty

                    for(k=0;k<temp3.length;k++){
                        if(temp3[k].concern.toLowerCase()==temp[i].visitReason.toLowerCase()){ 
                            if(temp[i].grade=="1"){
                                temp3[k].g1=temp3[k].g1+1;
                            }
                            else if(temp[i].grade=="2"){
                                temp3[k].g2=temp3[k].g2+1;
                            }
                            else if(temp[i].grade=="3"){
                                temp3[k].g3=temp3[k].g3+1;
                            }
                            else if(temp[i].grade=="4"){
                                temp3[k].g4=temp3[k].g4+1;
                            }
                            else if(temp[i].grade=="5"){
                                temp3[k].g5=temp3[k].g5+1;
                            }
                            else if(temp[i].grade=="6"){
                                temp3[k].g6=temp3[k].g6+1;
                            }                        
                            alreadyAddedTemp3=1;
                        }
                    }
                    if(alreadyAddedTemp3!=1){
                        if(temp[i].visitReason!=""){    
                            if(temp[i].grade=="1"){
                               temp3.push({
                                   concern: temp[i].visitReason,
                                   g1:1,
                                   g2:0,
                                   g3:0,
                                   g4:0,
                                   g5:0,
                                   g6:0
                               })
                            }
                            else if(temp[i].grade=="2"){
                                temp3.push({
                                    concern: temp[i].visitReason,
                                    g1:0,
                                    g2:1,
                                    g3:0,
                                    g4:0,
                                    g5:0,
                                    g6:0
                                })
                            } 
                            if(temp[i].grade=="3"){
                                temp3.push({
                                    concern: temp[i].visitReason,
                                    g1:0,
                                    g2:0,
                                    g3:1,
                                    g4:0,
                                    g5:0,
                                    g6:0
                                })
                            }
                            if(temp[i].grade=="4"){
                                temp3.push({
                                    concern: temp[i].visitReason,
                                    g1:0,
                                    g2:0,
                                    g3:0,
                                    g4:1,
                                    g5:0,
                                    g6:0
                                })
                            }
                            if(temp[i].grade=="5"){
                                temp3.push({
                                    concern: temp[i].visitReason,
                                    g1:0,
                                    g2:0,
                                    g3:0,
                                    g4:0,
                                    g5:1,
                                    g6:0
                                })
                            }
                            if(temp[i].grade=="6"){
                                temp3.push({
                                    concern: temp[i].visitReason,
                                    g1:0,
                                    g2:0,
                                    g3:0,
                                    g4:0,
                                    g5:0,
                                    g6:1
                                })
                            }
                        }
                    }

                    // for(j=0;j<temp2.length;j++){ //this whole thing is used to check if it has a count
                    //     if(temp2[j].concern.toLowerCase()==temp[i].visitReason.toLowerCase()){ 
                    //         temp2[j].count=temp2[j].count+1;
                    //         alreadyAddedTemp2=1;
                    //     }
                    // }
                    // if(alreadyAddedTemp2!=1){
                    //     if(temp[i].visitReason!=""){
                    //         temp2.push({
                    //             concern: temp[i].visitReason,
                    //             grade:temp[i].grade,
                    //             count:1
                    //         })
                    //     }
                    // }

                }
            }
        }

        console.log("getDiseaseCount array");
        console.log(temp3);
        if(from=="dashboard"){
            res.send(temp3);
        }
        else{
            return temp3;
        }

    })
    
}




