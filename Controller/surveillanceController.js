const firebase = require('../firebase');

//function returns an array that contains the clinic visit(visitDate, id, diagnosis) to pass list for top disease (used in Disease Surveillance)
exports.getDiseaseSurveillanceData=function(){
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timeStamp");
    var temp=[];
    var childSnapshotData;
    var checkDiagnosis=[];
    var i;
    
    console.log("GET TOP DISEASE DATA")
    var promise = new Promise((resolve,reject) => {
        clinicVisitRef.once('value', (snapshot)=>{
            snapshot.forEach(function(childSnapshot){
                child = childSnapshot.exportVal();
                //if(!child.diagnosis ==null && !child.diagnosis==undefined && !child.diagnosis =="" ){
                    checkDiagnosis = child.diagnosis.split(", ");
                    for(i=0;i<checkDiagnosis.length;i++){
                        if(checkDiagnosis[i]!=null && checkDiagnosis[i]!=undefined && checkDiagnosis[i]!=""){
                            temp.push({
                                diagnosis:checkDiagnosis[i],
                                visitDate:child.visitDate,
                                id:child.id
                            })
                        }
                    }
                //}
            })
            resolve (temp);
        })
    })

    return promise;
}
//function returns strings of top diagnosis for week and month - dependent on current date (used in Disease Surveillance)
exports.getTopDisease=function(vcArray){
    console.log("Entered getTopDisease");
    var temp=vcArray, strings=[];
    var vcWeek=[], weekTopDisease=[]; // variables for top disease week
    var vcMonth=[], monthTopDisease=[]; // variables for top disease month
    var parts, dbDate,alreadyAdded;
    var currDate =  new Date();
    var today = new Date();
    var weekAgo=new Date(today.setDate(today.getDate() - 7));
    var i,j;
    
    //getting only the clinic visits current week
    for(i=0;i<temp.length;i++){
        parts =temp[i].visitDate.split('-'); // January - 0, February - 1, etc.
        dbDate = new Date(parts[0], parts[1] - 1, parts[2]); //date gotten from Db
        alreadyAdded = false;
        if(dbDate<=currDate && dbDate>=weekAgo){ // filters based on date
            if(vcWeek.length==0){ //if empty auto add
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
    
    //getting only the clinic visits current month
    for(i=0;i<temp.length;i++){
        parts = temp[i].visitDate.split('-'); // January - 0, February - 1, etc.
        dbDate = new Date(parts[0], parts[1] - 1, parts[2]); //date gotten from Db
        alreadyAdded = false;
        if(dbDate.getMonth() == currDate.getMonth() && dbDate.getFullYear() == currDate.getFullYear()){
            if(vcMonth.length==0){ //if empty auto add
                vcMonth.push({
                    concern: temp[i].diagnosis,
                    count:1
                });
            }
            else{ //if not empty
                for(j=0;j<vcMonth.length;j++){ //this whole thing is used to check if it has a count
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

    }
 
    // sorting the vcWeek and Month from highest count to lowest
    if(vcWeek.length>0){
        console.log("FIND ORDER OF WEEK TOP DISEASE");
        weekTopDisease= vcWeek.sort(function (x, y) {
            return y.count- x.count;
        });
        strings.push(weekTopDisease);
    }
    else{
        strings.push(weekTopDisease);
    }
    if(vcMonth.length>0){
        console.log("FIND ORDER OF MONTH TOP DISEASE");
        monthTopDisease= vcMonth.sort(function (x, y) {
            return y.count- x.count;
        });
        strings.push(monthTopDisease);
    }
    else{
        strings.push(monthTopDisease);
    }
        
    return strings;

}
//function is used to get data for chart which is dependent on disease and date range (used in Disease Surveillance)
exports.getDiseaseDemographics=function(req,res){
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timeStamp");

    var temp=[],temp2=[],temp3=[],checkDiagnosis=[];
    var childSnapshotData;
    var i;
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
                    //if(!childSnapshotData.diagnosis==null && !childSnapshotData.diagnosis==undefined && !childSnapshotData.diagnosis==""){
                        checkDiagnosis=childSnapshotData.diagnosis.split(", ");
                            for(i=0;i<checkDiagnosis.length;i++){
                                if(childSnapshotData.diagnosis!=null && childSnapshotData.diagnosis!=undefined && childSnapshotData.diagnosis!=""){
                                    temp.push({
                                        diagnosis:checkDiagnosis[i],
                                        visitDate:childSnapshotData.visitDate,
                                        id:childSnapshotData.id,
                                        grade: childSnapshotData.grade,
                                        section: childSnapshotData.section
                                    })
                                }
                            }
                    //}
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
        res.send(chartData);
    })
    
    
}
//function is used to get disease count in certain time period (used in Disease Surveillance)
exports.getVisitReasonCount=function(req,res){
    console.log("enters")
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timeStamp");

    var temp=[],temp2=[],temp3=[];
    var data=[];
    var checkVisitReason=[];
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
                    checkVisitReason=childSnapshotData.visitReason.split(", ");
                    for(i=0;i<checkVisitReason.length;i++){
                        temp.push({
                            visitReason:checkVisitReason[i],
                            visitDate:childSnapshotData.visitDate,
                            grade:childSnapshotData.grade,
                            section:childSnapshotData.section,
                        })
                    }
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
        if(from=="dashboard"){
            res.send(data);
        }
        else{
            return data;
        }
    
    })
    
    
}
//(used in Dashboard)
exports.getVRCountByGradeInMonth=function(req,res){
    console.log("enters")
    var database = firebase.database();
    var clinicVisitRef = database.ref("clinicVisit");

    var temp=[];
    var temp3=[];
    var checkVisitReason=[];
    var childSnapshotData;
    var i,j,k,alreadyAddedTemp3;
    var today= new Date();    // DONT FORGET TO REMOVE THE DATE!!
    var curr=today.toString();
    var monthToday = today.getMonth();
    var yearToday = today.getFullYear();
    var from = req.body.from;
    var getTop10Temp=[],getTop10Final=[],alreadyAdded;

    clinicVisitRef.once('value', (snapshot) => {
        snapshot.forEach(function(innerChildSnapshot){ // Getting primary keys of users
            childSnapshotData = innerChildSnapshot.exportVal();
            checkVisitReason=childSnapshotData.visitReason.split(", ");
            for(i=0;i<checkVisitReason.length;i++){
                if(checkVisitReason[i]!=""){
                    partsDb =childSnapshotData.visitDate.split('-');
                    if(partsDb[1]-1 == monthToday && partsDb[0]==yearToday){
                        temp.push({
                            visitReason:checkVisitReason[i],
                            visitDate:childSnapshotData.visitDate,
                            id:childSnapshotData.id,
                            grade:childSnapshotData.grade,
                            section:childSnapshotData.section
                        })
                    }
                }
            }
        })

        if(temp.length>0){
        
            for(i=0;i<temp.length;i++){
                alreadyAdded=0;
                if(getTop10Temp.length==0){
                    getTop10Temp.push({
                        visitReason:temp[i].visitReason,
                        count:1
                    })
                }
                else{
                    for(j=0;j<getTop10Temp.length;j++){
                        if(temp[i].visitReason.toLowerCase() == getTop10Temp[j].visitReason.toLowerCase()){
                            getTop10Temp[j].count= getTop10Temp[j].count+1;
                            alreadyAdded=1;
                        }
                    }
                    if(alreadyAdded!=1){
                        if(temp[i].visitReason!=""){
                            getTop10Temp.push({
                                visitReason: temp[i].visitReason,
                                count:1
                            })
                        }
                    }
                }
                    
            }
            
            //to sort in descending order
            getTop10Temp=getTop10Temp.sort(function (x, y) {
                return y.count- x.count;
            });
            

            //to get only the top 10 
            if(getTop10Temp.length <= 10){
                getTop10Final=getTop10Temp;
            }
            else{
                for(i=0;i<10;i++){
                    getTop10Final.push({
                        visitReason: getTop10Temp[i].visitReason,
                        count:getTop10Temp[i].count
                    })
                }
            }
            
            //temp where data is filtered by date and gets the count of each disease
            for(i=0;i<temp.length;i++){
                if(temp[i].visitReason!=undefined && temp[i].visitReason!=""){
                    if(temp[i].visitDate!="" && temp[i].visitDate!=null && temp[i].visitDate!=undefined){
                        alreadyAddedTemp2=0;
                        alreadyAddedTemp3=0;       
                        if(temp3.length==0){
                            if(temp[i].visitReason!=""){
                                for(j=0;j<getTop10Final.length;j++){
                                    if(temp[i].visitReason.toLowerCase()==getTop10Final[j].visitReason.toLowerCase()){
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
                                        else if(temp[i].grade=="3"){
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
                                        else if(temp[i].grade=="4"){
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
                                        else if(temp[i].grade=="5"){
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
                                        else if(temp[i].grade=="6"){
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
                        else{
                            console.log(temp[i].visitReason);
                            for(k=0;k<temp3.length;k++){
                                if(temp3[k].concern!="" && temp3[k].concern!=undefined){
                                    for(j=0;j<getTop10Final.length;j++){
                                        if(temp[i].visitReason.toLowerCase()==getTop10Final[j].visitReason.toLowerCase()){
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
                                }
                            }
                            if(alreadyAddedTemp3!=1){
                                for(j=0;j<getTop10Final.length;j++){
                                    if(temp[i].visitReason.toLowerCase()==getTop10Final[j].visitReason.toLowerCase()){
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
                                            else if(temp[i].grade=="3"){
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
                                            else if(temp[i].grade=="4"){
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
                                            else if(temp[i].grade=="5"){
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
                                            else if(temp[i].grade=="6"){
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
                }

                
                
            }
            
            temp3.push(temp);

        }
        
        if(from=="dashboard"){
            res.send(temp3);
        }
        else{
            return temp3;
        }

    })    
}
//returns the disease and visitReason with the dates and filtered by specified date (used in Disease Surveillance)
exports.getDiseaseTrendCount= function(req,res){
    console.log("enters trend count")
    var database = firebase.database();
    var databaseRef = database.ref();
    var clinicVisitRef = database.ref("clinicVisit");
    var query = clinicVisitRef.orderByChild("timeStamp");

    var temp=[],temp2=[];
    var childSnapshotData;
    var i,alreadyAdded;
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
       
       res.send(temp2)
        return temp2;
    
    })

}



