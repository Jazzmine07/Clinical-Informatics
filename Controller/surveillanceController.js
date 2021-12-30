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
                        if(childSnapshotData.diagnosis!=null && childSnapshotData.diagnosis!=undefined && childSnapshotData.diagnosis!=""){
                            temp.push({
                                diagnosis:childSnapshotData.diagnosis,
                                visitDate:childSnapshotData.visitDate,
                                id:childSnapshotData.id
                            })
                        }
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
    console.log("Entered getTopDisease");
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timeStamp");
    var temp=vcArray, strings=[];
    var vcWeek=[], weekTopDisease=[], topWeekCount=[], topWeekConcern=[], stringWeek=""; // variables for top disease week
    var vcMonth=[], monthTopDisease=[], topMonthCount=[], topMonthConcern=[], stringMonth=""; // variables for top disease month
    var childSnapshotData;
    var parts, dbDate,alreadyAdded;
    var currDate =  new Date();
    var today = new Date();
    var weekAgo=new Date(today.setDate(today.getDate() - 7));
    var i,j,size;

    console.log(temp);
    //getting only the clinic visits current week
    for(i=0;i<temp.length;i++){
        parts =temp[i].visitDate.split('-'); // January - 0, February - 1, etc.
        dbDate = new Date(parts[0], parts[1] - 1, parts[2]); //date gotten from Db
        alreadyAdded = false;
        if(dbDate<=currDate && dbDate>=weekAgo){ // filters based on date
            if(vcWeek.length==0){ //if empty auto add
                console.log(temp[i].diagnosis);
                vcWeek.push({
                    concern: temp[i].diagnosis,
                    count:1
                });
            }
            else{ //if not empty
                for(j=0;j<vcWeek.length;j++){ //this whole thing is used to check if it has a count
                    if(vcWeek[j].concern.toLowerCase() == temp[i].diagnosis.toLowerCase()){ 
                        vcWeek[j].count = vcWeek[j].count + 1;
                        alreadyAdded = true;
                    }
                }
                if(alreadyAdded != true){
                    vcWeek.push({
                        concern: temp[i].diagnosis,
                        count:1
                    });
                }
            }
        }
    }
    console.log(vcWeek);
    //getting only the clinic visits current month
    for(i=0;i<temp.length;i++){
        parts = temp[i].visitDate.split('-'); // January - 0, February - 1, etc.
        dbDate = new Date(parts[0], parts[1] - 1, parts[2]); //date gotten from Db
        alreadyAdded = false;
        if(dbDate.getMonth() == currDate.getMonth() && dbDate.getFullYear() == currDate.getFullYear()){
            console.log("length " + vcMonth.length);
            console.log(i);
            if(vcMonth.length==0){ //if empty auto add
                vcMonth.push({
                    concern: temp[i].diagnosis,
                    count:1
                });
            }
            else{ //if not empty
                for(j=0;j<vcMonth.length;j++){ //this whole thing is used to check if it has a count
                    console.log(vcMonth[j].concern.toLowerCase());
                    console.log(temp[i].diagnosis.toLowerCase());
                        if(vcMonth[j].concern.toLowerCase() == temp[i].diagnosis.toLowerCase()){ 
                            vcMonth[j].count = vcMonth[j].count + 1;
                            alreadyAdded = true;
                            break;
                        }
                }
                if(alreadyAdded != true){
                    vcMonth.push({
                        concern: temp[i].diagnosis,
                        count:1
                    });
                }
            }
        }
        console.log("nani4?");
    }
    
    console.log(vcWeek);
    console.log(vcMonth);
    // console.log(monthTopDisease);
    // console.log(weekTopDisease);

    // sorting the vcWeek and Month from highest count to lowest
    if(vcWeek.length>0){
        console.log("FIND ORDER OF WEEK TOP DISEASE");
        weekTopDisease= vcWeek.reverse(function (x, y) {
            return x.count- y.count;
        });
    }
    if(vcMonth.length>0){
        console.log("FIND ORDER OF MONTH TOP DISEASE");
        monthTopDisease= vcMonth.reverse(function (x, y) {
            return x.count- y.count;
        });
    }
    

    if(weekTopDisease!=null){
        size= weekTopDisease.length;
        if(size < 5){
            for(i=0;i<weekTopDisease.length;i++){
                // topWeekConcern.push(weekTopDisease[i].concern);
                // topWeekCount.push(weekTopDisease[i].count);
                stringWeek = stringWeek+ weekTopDisease[i].concern + "(" + weekTopDisease[i].count + ") \n" ;
            }    
        }
        else if(size>5){
            for(i=0;i<5;i++){
                // topWeekConcern.push(weekTopDisease[i].concern);
                // topWeekCount.push(weekTopDisease[i].count);
                stringWeek = stringWeek+ weekTopDisease[i].concern + "(" + weekTopDisease[i].count + ") \n";
            } 
            for(i=5;i<size;i++){
                if(weekTopDisease[i-1].count == weekTopDisease[i].count){
                    // topWeekConcern.push(weekTopDisease[i].concern);
                    // topWeekCount.push(weekTopDisease[i].count);
                    stringWeek = stringWeek+ weekTopDisease[i].concern + "(" + weekTopDisease[i].count + ") \n";
                }
                else{
                    break;
                }
            }
        }
    }
    if(monthTopDisease!=null){
        size= monthTopDisease.length;
        if(size < 5){
            for(i=0;i<monthTopDisease.length;i++){
                // topMonthConcern.push(monthTopDisease[i].concern);
                // topMonthCount.push(monthTopDisease[i].count);
                stringMonth = stringMonth+ monthTopDisease[i].concern + "(" + monthTopDisease[i].count + ") \n";
            }    
        }
        else if(size>=5){
            for(i=0;i<5;i++){
                // topMonthConcern.push(monthTopDisease[i].concern);
                // topMonthCount.push(monthTopDisease[i].count);
                stringMonth = stringMonth+ monthTopDisease[i].concern + "(" + monthTopDisease[i].count + ") \n";
            } 
            for(i=5;i<size;i++){
                if(monthTopDisease[i-1].count == monthTopDisease[i].count){
                    // topMonthConcern.push(monthTopDisease[i].concern);
                    // topMonthCount.push(monthTopDisease[i].count);
                    stringMonth = stringMonth+ monthTopDisease[i].concern + "(" + monthTopDisease[i].count + ") \n";
                }
                else{
                    break;
                }
            }
        }
    }
    //appending all top disease of the week
       
    
    strings.push(stringWeek);
    strings.push(stringMonth);
    // console.log("STRINGS of top disease");
    // console.log(strings);
        
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
    //console.log("DISEASE from frontend:"+disease);
    var start=req.body.startDate;
    var end=req.body.endDate;
    var chartData=[];
    var g1=[{section:"Truthfulness", count:0},{section:"Sincerity", count:0}, {section:"Honesty", count:0}, {section:"Faithfulness", count:0}, {section:"Humility", count:0}, {section:"Politeness", count:0}];
    var g2=[{section:"Simplicity", count:0}, {section:"Charity", count:0}, {section:"Helpfulness", count:0}, {section:"Gratefulness", count:0}, {section:"Gratitude", count:0}, {section:"Meekness", count:0}];
    var g3=[{section:"Respect", count:0}, {section:"Courtesy", count:0}, {section:"Trust:", count:0}, {section:"Kindness", count:0}, {section:"Piety", count:0}, {section:"Prayerfullness", count:0}];
    var g4=[{section:"Unity", count:0}, {section:"Purity", count:0}, {section:"Fidelity", count:0}, {section:"Equality", count:0}, {section:"Harmony", count:0}, {section:"Solidarity", count:0}];
    var g5=[{section:"Trustworthiness", count:0}, {section:"Reliability", count:0}, {section:"Dependability", count:0}, {section:"Responsibility", count:0}, {section:"Serenity", count:0}, {section:"Flexibility:", count:0} ];
    var g6=[{section:"Self-Discipline", count:0}, {section:"Abnegation", count:0}, {section:"Self-Giving", count:0}, {section:"Integrity", count:0}, {section:"Perseverance", count:0}, {section:"Patience", count:0}];


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
                        id:childSnapshotData.id,
                        grade: childSnapshotData.grade,
                        section: childSnapshotData.section
                    })
                })
                
            })
        }
        //temp where data is filtered by date
        for(i=0;i<temp.length;i++){
            if(temp[i].visitDate!="" && temp[i].visitDate!=null && temp[i].visitDate!=undefined){
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
    
        }
        //temp2 which is date filtered is further filtered by disease chosen
        for(i=0;i<temp2.length;i++){
            if(temp2[i].diagnosis!="" && disease!="" && temp2[i].diagnosis!=undefined && disease!=undefined){
                if(temp2[i].diagnosis.toLowerCase()==disease.toLowerCase()){
                    temp3.push(temp2[i]);
                }
            }
        }
        

        //ADD Grade 3-6 pa
        //combining to get chart data
        for(i=0;i<temp3.length;i++){

            if(temp3[i].section == "Truthfulness"){
                g1[0].count=g1[0].count+1; 
            }                
            else if(temp3[i].section=="Sincerity"){
                g1[1].count=g1[1].count+1;
            }
            else if(temp3[i].section=="Honesty"){
                g1[2].count=g1[2].count+1;
            }
            else if(temp3[i].section=="Faithfulness"){
                g1[3].count=g1[3].count+1;
            }
            else if(temp3[i].section=="Humility"){
                g1[4].count=g1[4].count+1;
            }
            else if(temp3[i].section=="Politeness"){
                g1[5].count=g1[5].count+1;
            }
            else if(temp3[i].section=="Simplicity"){
                g2[0].count=g2[0].count+1;
            }
            else if(temp3[i].section=="Charity"){
                g2[1].count=g2[1].count+1;
            }
            else if(temp3[i].section=="Helpfulness"){
                g2[2].count=g2[2].count+1;
            }
            else if(temp3[i].section=="Gratefulness"){
                g2[3].count=g2[3].count+1;
            }
            else if(temp3[i].section=="Gratitude"){
                g2[4].count=g2[4].count+1;
            }
            else if(temp3[i].section=="Meekness"){
                g2[5].count=g2[5].count+1;
            }
            else if(temp3[i].section=="Respect"){
                g3[0].count=g3[0].count+1;
            }
            else if(temp3[i].section=="Courtesy"){
                g3[1].count=g3[1].count+1;
            }
            else if(temp3[i].section=="Trust"){
                g3[2].count=g3[2].count+1;
            }
            else if(temp3[i].section=="Kindness"){
                g3[3].count=g3[3].count+1;
            }
            else if(temp3[i].section=="Piety"){
                g3[4].count=g3[4].count+1;
            }
            else if(temp3[i].section=="Prayerfulness"){
                g3[5].count=g3[5].count+1;
            }
            else if(temp3[i].section=="Unity"){
                g4[0].count=g4[0].count+1;
            }
            else if(temp3[i].section=="Purity"){
                g4[1].count=g4[1].count+1;
            }
            else if(temp3[i].section=="Fidelity"){
                g4[2].count=g4[2].count+1;
            }
            else if(temp3[i].section=="Equality"){
                g4[3].count=g4[3].count+1;
            }
            else if(temp3[i].section=="Harmony"){
                g4[4].count=g4[4].count+1;
            }
            else if(temp3[i].section=="Solidarity"){
                g4[5].count=g4[5].count+1;
            }
            else if(temp3[i].section=="Trustworthiness"){
                g5[0].count=g5[0].count+1;
            }
            else if(temp3[i].section=="Reliability"){
                g5[1].count=g5[1].count+1;
            }
            else if(temp3[i].section=="Dependability"){
                g5[2].count=g5[2].count+1;
            }
            else if(temp3[i].section=="Responsibility"){
                g5[3].count=g5[3].count+1;
            }
            else if(temp3[i].section=="Serenity"){
                g5[4].count=g5[4].count+1;
            }
            else if(temp3[i].section=="Flexibility"){
                g5[5].count=g5[5].count+1;
            }
            else if(temp3[i].section=="Self-Discipline"){
                g6[0].count=g6[0].count+1;
            }
            else if(temp3[i].section=="Abnegation"){
                g6[1].count=g6[1].count+1;
            }
            else if(temp3[i].section=="Self-Giving"){
                g6[2].count=g6[2].count+1;
            }
            else if(temp3[i].section=="Integrity"){
                g6[3].count=g6[3].count+1;
            }
            else if(temp3[i].section=="Perseverance"){
                g6[4].count=g6[4].count+1;
            }
            else if(temp3[i].section=="Patience"){
                g6[5].count=g6[5].count+1;
            }
                
        }

        chartData.push( {grade1:g1},{grade2:g2},{grade3:g3},{grade4:g4},{grade5:g5}, {grade6:g6},{temp3} );
        console.log("HELLO DEATH");
        console.log(chartData);
    //    chartData.push(g1);
    //    chartData.push(g2);
    //    chartData.push(g3);
    //    chartData.push(g4);
    //    chartData.push(g5);
    //    chartData.push(g6);
        // console.log("ARRAYs");
        // console.log(temp);
        // console.log(temp2);
        // console.log(temp3);
        // console.log(studentInfo);
        //console.log(chartData);
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

    var temp=[],temp2=[],temp3=[];
    var data=[];
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
                        grade:childSnapshotData.grade,
                        section:childSnapshotData.section,
                    })
                })
                
            })
        }
        
        //temp where data is filtered by date and gets the count of each disease
        for(i=0;i<temp.length;i++){
            if(temp[i].visitDate!="" && temp[i].visitDate!=null && temp[i].visitDate!=undefined){
                parts=temp[i].visitDate.split('-');
                startSplit= start.split('-');
                endSplit = end.split('-');
                dbDate = new Date(parts[0], parts[1] - 1, parts[2]); //date gotten from Db
                startDate = new Date(startSplit[0], startSplit[1] - 1, startSplit[2]);
                endDate = new Date(endSplit[0], endSplit[1] - 1, endSplit[2]);
                alreadyAdded=0;
                if(dbDate<=endDate && dbDate>=startDate){
                    // temp2.push(temp[i]);
                    temp3.push(temp[i]);
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
                            if(temp[i].visitReason!="" && temp2[j].concern!="" && temp[i].visitReason!=undefined && temp2[j].concern!=undefined){
                                if(temp2[j].concern.toLowerCase()==temp[i].visitReason.toLowerCase()){ 
                                    temp2[j].count=temp2[j].count+1;
                                    alreadyAdded=1;
                                }
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
            
    
        }

        //temp2 = symptoms in a certain data range (contains concern and count of the symptom)
        //temp3 = symptoms in a certain data range (contains concern, grade, section)
        
        data.push({arr:temp2});
        data.push({arr2:temp3})
        console.log(data);
        if(from=="dashboard"){
            res.send(data);
        }
        else{
            return data;
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

    var temp=[], temp2=[];
    var temp3=[];
    var childSnapshotData, csData;
    var i,j,k,alreadyAddedTemp2,alreadyAddedTemp3;
    var today= new Date();
    var curr=today.toString();
    var monthToday = today.getMonth();
    var from = req.body.from;

    console.log("MARSHMALLOW");
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
                        grade:childSnapshotData.grade,
                        section:childSnapshotData.section
                    })
                })
                
            })
        }
        console.log("temp:");
        console.log(temp);
        //temp where data is filtered by date and gets the count of each disease
        for(i=0;i<temp.length;i++){
            if(temp[i].visitDate!="" && temp[i].visitDate!=null && temp[i].visitDate!=undefined){
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
                        if(temp3[k].concern!="" && temp[i].visitReason!="" && temp3[k].concern!=undefined && temp[i].visitReason!=undefined){
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

                    

                }
            }
            }
            
        }
        temp3.push(temp);
        console.log("getDiseaseCount array");
        console.log(temp3);
        console.log("MINT");
        if(from=="dashboard"){
            res.send(temp3);
        }
        else{
            return temp3;
        }

    })
    
}
//returns the disease and visitReason with the dates and filtered by specified date
exports.getDiseaseTrendCount= function(req,res){
    console.log("enters trend count")
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var studentInfoRef = database.ref("studentInfo");
    var query = clinicVisitRef.orderByChild("timeStamp");

    var temp=[],temp2=[];
    var childSnapshotData, csData;
    var i,j,alreadyAdded;
    var start=req.body.startDate;
    var end=req.body.endDate;
    

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
                        grade:childSnapshotData.grade,
                        section:childSnapshotData.section,
                        diagnosis:childSnapshotData.diagnosis,
                    })
                })
                
            })
        }
        
        //temp where data is filtered by date
        for(i=0;i<temp.length;i++){
            if(temp[i].visitDate!="" && temp[i].visitDate!=null && temp[i].visitDate!=undefined){
                parts=temp[i].visitDate.split('-');
                startSplit= start.split('-');
                endSplit = end.split('-');
                dbDate = new Date(parts[0], parts[1] - 1, parts[2]); //date gotten from Db
                startDate = new Date(startSplit[0], startSplit[1] - 1, startSplit[2]);
                endDate = new Date(endSplit[0], endSplit[1] - 1, endSplit[2]);
                alreadyAdded=0;
                if(dbDate<=endDate && dbDate>=startDate){
                    if(temp[i].visitReason!=""){
                        temp2.push(temp[i])
                        
                    }
                }
            }
        }
       console.log(temp2);
       res.send(temp2)
        return temp2;
    
    })

}



