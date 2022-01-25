const firebase = require('../firebase');

exports.addProgram = function(req, res){
    var { progType, progName, description, objectives,
        population, startDate, endDate, location } = req.body;
    var database = firebase.database();
    var programRef = database.ref("programs");

    var program = {
        progType: progType,
        progName: progName,
        description: description,
        objectives: objectives,
        population: population,
        startDate: startDate,
        endDate: endDate,
        location: location,
    };

    programRef.push(program);
    res.status(200).send();
}

exports.getProgramsList = function(){
    var database = firebase.database();
    var databaseRef = database.ref();
    var programRef = database.ref("programs");
    var query = programRef.orderByChild("startDate");
    var childSnapshotData, temp = [], programDate = [], programYear = [], programMonth = [], programs =[];

    var date = new Date();
    var month = date.getMonth()+1;
    var currYear = date.getFullYear();
    var schoolYearStart, schoolYearEnd;

    if(month >= 6){
        schoolYearStart = currYear; // 2021-2022
        schoolYearEnd = currYear + 1;
    }
    else {
        schoolYearStart = currYear - 1;
        schoolYearEnd = currYear;
    }

    var promise = new Promise((resolve, reject) => {
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("programs")){
                query.once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        programDate.push(new Date(childSnapshotData.startDate));
                        temp.push({
                            startDate: childSnapshotData.startDate,
                            endDate: childSnapshotData.endDate,
                            progName: childSnapshotData.progName,
                            progType: childSnapshotData.progType,
                            population: childSnapshotData.population,
                            location: childSnapshotData.location
                        })
                    })  

                    for(var i = 0; i < programDate.length; i++){
                        programYear.push(programDate[i].getFullYear());
                        programMonth.push(programDate[i].getMonth()+1);
                    }

                    for(var i = 0; i < programDate.length; i++){
                        if(programYear[i] == schoolYearStart && programMonth[i] >= 6 || programYear[i] == schoolYearEnd && programMonth[i] <= 4){
                            programs.push({
                                startDate: temp[i].startDate,
                                endDate: temp[i].endDate,
                                progName: temp[i].progName,
                                progType: temp[i].progType,
                                population: temp[i].population,
                                location: temp[i].location
                            })
                        }
                    }
                    resolve(programs);
                })
            }
            else {
                resolve(programs);
            }
        })
    })
    return promise;
}

exports.promotiveReport = function(req, res){
    // var program = req.query.program;
    // console.log("program");
    // console.log(program);
    var program = "OPLAN Health Food";
    var database = firebase.database();
    var databaseRef = database.ref();
    var programRef = database.ref("programs");
    var query = programRef.orderByChild("progName").equalTo(program);
    var temp;

    var studentInfoRef = database.ref("studentInfo");
    var g1Students = [], g2Students = [], g3Students = [], g4Students = [], g5Students = [], g6Students = [];

    var apeRef = database.ref('studentHealthHistory');
    var childSnapshotData, i;
    var apeGrade1Temp = [], apeG1CurrYearTemp = [], apeG1LastYearTemp = [];
    var apeGrade2Temp = [], apeG2CurrYearTemp = [], apeG2LastYearTemp = [];
    var apeGrade3Temp = [], apeG3CurrYearTemp = [], apeG3LastYearTemp = [];
    var apeGrade4Temp = [], apeG4CurrYearTemp = [], apeG4LastYearTemp = [];
    var apeGrade5Temp = [], apeG5CurrYearTemp = [], apeG5LastYearTemp = [];
    var apeGrade6Temp = [], apeG6CurrYearTemp = [], apeG6LastYearTemp = [];

    var clinicVisitRef = database.ref("clinicVisit");
    var winsVisitDatesG1 = [], winsVisitsTempG1 = [], winsVisitDatesG2 = [], winsVisitsTempG2 = [], winsVisitDatesG3 = [], winsVisitsTempG3 = [];
    var winsVisitDatesG4 = [], winsVisitsTempG4 = [], winsVisitDatesG5 = [], winsVisitsTempG5 = [], winsVisitDatesG6 = [], winsVisitsTempG6 = [];
    var winsBeforeCountG1 = 0, winsAfterCountG1 = 0;
    var winsBeforeCountG2 = 0, winsAfterCountG2 = 0;
    var winsBeforeCountG3 = 0, winsAfterCountG3 = 0;
    var winsBeforeCountG4 = 0, winsAfterCountG4 = 0;
    var winsBeforeCountG5 = 0, winsAfterCountG5 = 0;
    var winsBeforeCountG6 = 0, winsAfterCountG6 = 0;

    var pacpVisitDatesG1 = [], pacpVisitsTempG1 = [], pacpVisitDatesG2 = [], pacpVisitsTempG2 = [], pacpVisitDatesG3 = [], pacpVisitsTempG3 = [];
    var pacpVisitDatesG4 = [], pacpVisitsTempG4 = [], pacpVisitDatesG5 = [], pacpVisitsTempG5 = [], pacpVisitDatesG6 = [], pacpVisitsTempG6 = [];
    var pacpBeforeCountG1 = 0, pacpAfterCountG1 = 0;
    var pacpBeforeCountG2 = 0, pacpAfterCountG2 = 0;
    var pacpBeforeCountG3 = 0, pacpAfterCountG3 = 0;
    var pacpBeforeCountG4 = 0, pacpAfterCountG4 = 0;
    var pacpBeforeCountG5 = 0, pacpAfterCountG5 = 0;
    var pacpBeforeCountG6 = 0, pacpAfterCountG6 = 0;

    var efsqVisitDatesG1 = [], efsqVisitsTempG1 = [], efsqVisitDatesG2 = [], efsqVisitsTempG2 = [], efsqVisitDatesG3 = [], efsqVisitsTempG3 = [];
    var efsqVisitDatesG4 = [], efsqVisitsTempG4 = [], efsqVisitDatesG5 = [], efsqVisitsTempG5 = [], efsqVisitDatesG6 = [], efsqVisitsTempG6 = [];
    var efsqBeforeCountG1 = 0, efsqAfterCountG1 = 0;
    var efsqBeforeCountG2 = 0, efsqAfterCountG2 = 0;
    var efsqBeforeCountG3 = 0, efsqAfterCountG3 = 0;
    var efsqBeforeCountG4 = 0, efsqAfterCountG4 = 0;
    var efsqBeforeCountG5 = 0, efsqAfterCountG5 = 0;
    var efsqBeforeCountG6 = 0, efsqAfterCountG6 = 0;

    var wpeApeGrade1Temp = [], wpeApeG1CurrYearTemp = [], wpeApeG1LastYearTemp = [];
    var wpeApeGrade2Temp = [], wpeApeG2CurrYearTemp = [], wpeApeG2LastYearTemp = [];
    var wpeApeGrade3Temp = [], wpeApeG3CurrYearTemp = [], wpeApeG3LastYearTemp = [];
    var wpeApeGrade4Temp = [], wpeApeG4CurrYearTemp = [], wpeApeG4LastYearTemp = [];
    var wpeApeGrade5Temp = [], wpeApeG5CurrYearTemp = [], wpeApeG5LastYearTemp = [];
    var wpeApeGrade6Temp = [], wpeApeG6CurrYearTemp = [], wpeApeG6LastYearTemp = [];

    var date = new Date();
    var month = date.getMonth()+1;
    var currYear = date.getFullYear();
    var schoolYear, schoolYearStart, schoolYearEnd;

    if(month >= 6){
        schoolYear = currYear + "-" + (currYear + 1);
        schoolYearStart = currYear;
        schoolYearEnd = currYear + 1;
    }
    else{
        schoolYear = (currYear - 1) + "-" + (currYear);
        schoolYearStart = currYear - 1;
        schoolYearEnd = currYear;
    }

    var prevSchoolYear = (schoolYearStart-1)+"-"+(schoolYearEnd-1);

    if(program != "Select School Health Program..."){
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("programs")){
                query.once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal(); 
                        temp = {
                            startDate: childSnapshotData.startDate,
                            endDate: childSnapshotData.endDate,
                            progName: childSnapshotData.progName,
                            progType: childSnapshotData.progType,
                            population: childSnapshotData.population,
                            location: childSnapshotData.location
                        }
                    });
    
                    var populationArray = temp.population.split(", ");
                    //console.log(populationArray);
                    var programStartDate = new Date(temp.startDate);
                    var programEndDate = new Date(temp.endDate); 
                    if(temp.progType == "School-Based Feeding Program (SBFP)"){
                        for(i = 0; i < populationArray.length; i++){
                            if(populationArray[i] == "Grade 1"){
                                apeRef.once('value', (snapshot) => {
                                    snapshot.forEach(function(ape){ // skipping id number
                                        ape.child('ape').forEach(function(apeList){
                                            var apeData = apeList.exportVal();
                                            if(apeData.grade == "1"){   // dont forget if weightStatus is underweight
                                                apeGrade1Temp.push({
                                                    id: ape.key,
                                                    name: apeData.name,
                                                    schoolYear: apeList.key,
                                                    grade: apeData.grade,
                                                    weight: apeData.weight,
                                                })
                                            } 
                                        })
                                    })
    
                                    var g1currID = apeGrade1Temp[0].id;
                                    for(i = 0; i < apeGrade1Temp.length; i++){
                                        if(g1currID == apeGrade1Temp[i].id){    // if same id number
                                            if(apeGrade1Temp[i].schoolYear == prevSchoolYear){    // APE last year
                                                apeG1LastYearTemp.push({
                                                    id: apeGrade1Temp[i].id,
                                                    name: apeGrade1Temp[i].name,
                                                    schoolYear: apeGrade1Temp[i].schoolYear,
                                                    grade: apeGrade1Temp[i].grade,
                                                    weight: apeGrade1Temp[i].weight,
                                                })
                                                if(checker == 0 && apeGrade1Temp[i].schoolYear == prevSchoolYear){
                                                    apeG1CurrYearTemp.push({
                                                        id: apeGrade1Temp[i].id,
                                                        name: apeGrade1Temp[i].name,
                                                        schoolYear: schoolYear,
                                                        grade: apeGrade1Temp[i].grade,
                                                        weight: 'No APE record.',
                                                    })
                                                }
                                            } else {
                                                var checker = 0;
                                                for(j = 0; j < apeGrade1Temp.length; j++){
                                                    if(apeGrade1Temp[j].schoolYear == schoolYear){
                                                        apeG1CurrYearTemp.push({
                                                            id: apeGrade1Temp[i].id,
                                                            name: apeGrade1Temp[i].name,
                                                            schoolYear: apeGrade1Temp[i].schoolYear,
                                                            grade: apeGrade1Temp[i].grade,
                                                            weight: apeGrade1Temp[i].weight,
                                                        })
                                                        checker = 1;
                                                    }
                                                }
                                            }
                                            console.log("apeG1LastYearTemp");
                                            console.log(apeG1LastYearTemp);
                                            console.log("apeG1CurrYearTemp");
                                            console.log(apeG1CurrYearTemp);
                                        } else {
                                            g1currID = apeGrade1Temp[i].id;
                                            i--;
                                        }
                                    }
                                })
                            }
                            if(populationArray[i] == "Grade 2"){
                                studentInfoRef.once('value', (studentsList) => {
                                    studentsList.forEach(function(studentInfo){
                                        var sInfo = studentInfo.exportVal();
                                        var sFullName = sInfo.firstName + " " + sInfo.middleName.substring(0) + " " + sInfo.lastName;
                                        
                                        if(sInfo.grade == 2 && sInfo.weightStatus == "Underweight"){
                                            g2Students.push({
                                                id: studentInfo.key,
                                                studentName: sFullName,
                                                grade: sInfo.grade,
                                                section: sInfo.section
                                            })
                                        }        
                                    });
    
                                    // console.log("g2Students");
                                    // console.log(g2Students);
                                        
                                    apeRef.once('value', async (apeSnapshot) => {
                                        await apeSnapshot.forEach(function(ape){ // skipping id number
                                            for(var j = 0; j < g2Students.length; j++){
                                                if(ape.key == g2Students[j].id){
                                                    ape.child('ape').forEach(function(apeList){
                                                        apeData = apeList.exportVal();
                                                        apeGrade2Temp.push({
                                                            id: ape.key,
                                                            name: apeData.name,
                                                            schoolYear: apeList.key,
                                                            grade: apeData.grade,
                                                            weight: apeData.weight,
                                                        })
                                                    })
                                                }
                                            }
                                        });
    
                                        // console.log("apeGrade2Temp");
                                        // console.log(apeGrade2Temp);
    
                                        var g2currID = apeGrade2Temp[0].id;
                                        var checker;
                                        console.log("apeG2LastYearTemp1");
                                        console.log(apeG2LastYearTemp);
                                        console.log("apeG2CurrYearTemp1");
                                        console.log(apeG2CurrYearTemp);
                                        for(var k = 0; k < apeGrade2Temp.length; k++){
                                            console.log("pumasok dito");
    
                                            if(g2currID == apeGrade2Temp[k].id){    // if same id number
                                                if(apeGrade2Temp[k].schoolYear == prevSchoolYear){    // APE last year
                                                    apeG2LastYearTemp.push({
                                                        id: apeGrade2Temp[k].id,
                                                        name: apeGrade2Temp[k].name,
                                                        schoolYear: apeGrade2Temp[k].schoolYear,
                                                        grade: apeGrade2Temp[k].grade,
                                                        weight: apeGrade2Temp[k].weight,
                                                    })
                                                    if(checker == 0 && apeGrade2Temp[k].schoolYear == prevSchoolYear){  // checking if student has no ape last year
                                                        console.log("pumasok sa no ape");
                                                        apeG2CurrYearTemp.push({
                                                            id: apeGrade2Temp[k-1].id,
                                                            name: apeGrade2Temp[k-1].name,
                                                            schoolYear: schoolYear,
                                                            grade: apeGrade2Temp[k-1].grade,
                                                            weight: 'No APE record.',
                                                        })
                                                    }
                                                } else {
                                                    checker = 0;
                                                    if(apeGrade2Temp[k].schoolYear == schoolYear){
                                                        apeG2CurrYearTemp.push({
                                                            id: apeGrade2Temp[k].id,
                                                            name: apeGrade2Temp[k].name,
                                                            schoolYear: apeGrade2Temp[k].schoolYear,
                                                            grade: apeGrade2Temp[k].grade,
                                                            weight: apeGrade2Temp[k].weight,
                                                        })
                                                        checker = 1;
                                                    }
                                                }
                                            } else {
                                                g2currID = apeGrade2Temp[k].id;
                                                k--;
                                            }
                                        }
                                        console.log("apeG2LastYearTemp2");
                                        console.log(apeG2LastYearTemp);
                                        console.log("apeG2CurrYearTemp2");
                                        console.log(apeG2CurrYearTemp);
                                        console.log("befire res");
                                        //return res.status(200).send(apeG2LastYearTemp);
                                        res.status(200).send({
                                            lastYearAPE: apeG2LastYearTemp, 
                                            currentYearAPE: apeG2CurrYearTemp
                                        });
                                        console.log("after res");
                                    })
                                })
                                break;
                            }
                        }
                    } else if(temp.progType == "Water, Sanitation, and Hygiene (WASH) in Schools (WinS)"){
                        for(i = 0; i < populationArray.length; i++){
                            if(populationArray[i] == "Grade 1"){
                                databaseRef.once('value', (snapshot) => {
                                    if(snapshot.hasChild("clinicVisit")){
                                        clinicVisitRef.once('value', (childSnapshot) => {
                                            childSnapshot.forEach(function(innerChildSnapshot){
                                                var visitData = innerChildSnapshot.exportVal();
                                                if(visitData.grade == "1"){
                                                    winsVisitDatesG1.push(new Date(visitData.visitDate));
                                                    winsVisitsTempG1.push({
                                                        diagnosis: visitData.diagnosis,
                                                        impression: visitData.impression
                                                    })
                                                }
                                            })
    
                                            var visitYear = [], visitMonth = [], visitDay = [];
                                            var curVisitDates = [];
                                            var impressionDiagnosis = [];
                
                                            for(i = 0; i < winsVisitDatesG1.length; i++){
                                                visitYear.push(winsVisitDatesG1[i].getFullYear());
                                                visitMonth.push(winsVisitDatesG1[i].getMonth());
                                                visitDay.push(winsVisitDatesG1[i].getDate());
                                            }
                                            
                                            for(i = 0; i < winsVisitDatesG1.length; i++){
                                                if(visitYear[i] == schoolYearStart && visitMonth[i] >= 6 || visitYear[i] == schoolYearEnd && visitMonth[i] <= 4){ // filter all clinic visits from start of the school year
                                                    curVisitDates.push(new Date(visitYear[i], visitMonth[i], visitDay[i]+1));
                                                    impressionDiagnosis.push({
                                                        diagnosis: winsVisitsTempG1[i].diagnosis,
                                                        impression: winsVisitsTempG1[i].impression
                                                    });
                                                }
                                            }
    
                                            for(i = 0; i < curVisitDates.length; i++){
                                                if(curVisitDates[i] < programStartDate){ 
                                                    //count mga diarrhea before progStart
                                                    console.log("ilang beses pumasok sa before wins?");
                                                    if(impressionDiagnosis[i].impression.toLowerCase() == "diarrhea" || impressionDiagnosis[i].diagnosis.toLowerCase() == "diarrhea" || 
                                                       impressionDiagnosis[i].impression.toLowerCase() == "food poisioning" || impressionDiagnosis[i].diagnosis.toLowerCase() == "food poisioning" ||
                                                       impressionDiagnosis[i].impression.toLowerCase() == "hand foot and mouth disease" || impressionDiagnosis[i].diagnosis.toLowerCase() == "hand foot and mouth disease"){
                                                        winsBeforeCountG1++;
                                                    }
                                                }
                                                else if(curVisitDates[i] > programEndDate){
                                                    console.log("ilang beses pumasok sa after wins?");
                                                    //count mga diarrhea before progEnd
                                                    if(impressionDiagnosis[i].impression.toLowerCase() == "diarrhea" || impressionDiagnosis[i].diagnosis.toLowerCase() == "diarrhea" || 
                                                       impressionDiagnosis[i].impression.toLowerCase() == "food poisioning" || impressionDiagnosis[i].diagnosis.toLowerCase() == "food poisioning" ||
                                                       impressionDiagnosis[i].impression.toLowerCase() == "hand foot and mouth disease" || impressionDiagnosis[i].diagnosis.toLowerCase() == "hand foot and mouth disease"){
                                                        winsAfterCountG1++;
                                                    }
                                                }
                                            }
                                            console.log("winsBeforeCountG1");
                                            console.log(winsBeforeCountG1);
                                            console.log("winsAfterCountG1");
                                            console.log(winsAfterCountG1);
                                        })
                                    }
                                })
                            }
                        }
                    } else if(temp.progType == "Pest and Animal Control Program (PACP)"){
                        for(i = 0; i < populationArray.length; i++){
                            if(populationArray[i] == "Grade 1"){
                                databaseRef.once('value', (snapshot) => {
                                    if(snapshot.hasChild("clinicVisit")){
                                        clinicVisitRef.once('value', (childSnapshot) => {
                                            childSnapshot.forEach(function(innerChildSnapshot){
                                                var visitData = innerChildSnapshot.exportVal();
                                                if(visitData.grade == "1"){
                                                    pacpVisitDatesG1.push(new Date(visitData.visitDate));
                                                    pacpVisitsTempG1.push({
                                                        diagnosis: visitData.diagnosis,
                                                        impression: visitData.impression
                                                    })
                                                }
                                            })
    
                                            var visitYear = [], visitMonth = [], visitDay = [];
                                            var curVisitDates = [];
                                            var impressionDiagnosis = [];
                
                                            for(i = 0; i < pacpVisitDatesG1.length; i++){
                                                visitYear.push(pacpVisitDatesG1[i].getFullYear());
                                                visitMonth.push(pacpVisitDatesG1[i].getMonth());
                                                visitDay.push(pacpVisitDatesG1[i].getDate());
                                            }
                                            
                                            for(i = 0; i < pacpVisitDatesG1.length; i++){
                                                if(visitYear[i] == schoolYearStart && visitMonth[i] >= 6 || visitYear[i] == schoolYearEnd && visitMonth[i] <= 4){ // filter all clinic visits from start of the school year
                                                    curVisitDates.push(new Date(visitYear[i], visitMonth[i], visitDay[i]+1));
                                                    impressionDiagnosis.push({
                                                        diagnosis: pacpVisitsTempG1[i].diagnosis,
                                                        impression: pacpVisitsTempG1[i].impression
                                                    });
                                                }
                                            }
    
                                            for(i = 0; i < curVisitDates.length; i++){
                                                if(curVisitDates[i] < programStartDate){ 
                                                    console.log("ilang beses pumasok sa before pacp?");
                                                    if(impressionDiagnosis[i].impression.toLowerCase() == "dengue" || impressionDiagnosis[i].diagnosis.toLowerCase() == "dengue" || 
                                                       impressionDiagnosis[i].impression.toLowerCase() == "malaria" || impressionDiagnosis[i].diagnosis.toLowerCase() == "malaria" || 
                                                       impressionDiagnosis[i].impression.toLowerCase() == "japanese encephalitis" || impressionDiagnosis[i].diagnosis.toLowerCase() == "japanese encephalitis"){
                                                        pacpBeforeCountG1++;
                                                    }
                                                }
                                                else if(curVisitDates[i] > programEndDate){
                                                    console.log("ilang beses pumasok sa after pacp?");
                                                    if(impressionDiagnosis[i].impression.toLowerCase() == "dengue" || impressionDiagnosis[i].diagnosis.toLowerCase() == "dengue" || 
                                                       impressionDiagnosis[i].impression.toLowerCase() == "malaria" || impressionDiagnosis[i].diagnosis.toLowerCase() == "malaria" ||
                                                       impressionDiagnosis[i].impression.toLowerCase() == "japanese encephalitis" || impressionDiagnosis[i].diagnosis.toLowerCase() == "japanese encephalitis"){
                                                        pacpAfterCountG1++;
                                                    }
                                                }
                                            }
                                            console.log("pacpBeforeCountG1");
                                            console.log(pacpBeforeCountG1);
                                            console.log("pacpAfterCountG1");
                                            console.log(pacpAfterCountG1);
                                        })
                                    }
                                })
                            }
                        }
                    } else if(temp.progType == "Evaluation of Food Safety and Quality"){
                        for(i = 0; i < populationArray.length; i++){
                            if(populationArray[i] == "Grade 1"){
                                databaseRef.once('value', (snapshot) => {
                                    if(snapshot.hasChild("clinicVisit")){
                                        clinicVisitRef.once('value', (childSnapshot) => {
                                            childSnapshot.forEach(function(innerChildSnapshot){
                                                var visitData = innerChildSnapshot.exportVal();
                                                if(visitData.grade == "1"){
                                                    efsqVisitDatesG1.push(new Date(visitData.visitDate));
                                                    efsqVisitsTempG1.push({
                                                        diagnosis: visitData.diagnosis,
                                                        impression: visitData.impression
                                                    })
                                                }
                                            })
    
                                            var visitYear = [], visitMonth = [], visitDay = [];
                                            var curVisitDates = [];
                                            var impressionDiagnosis = [];
                
                                            for(i = 0; i < efsqVisitDatesG1.length; i++){
                                                visitYear.push(efsqVisitDatesG1[i].getFullYear());
                                                visitMonth.push(efsqVisitDatesG1[i].getMonth());
                                                visitDay.push(efsqVisitDatesG1[i].getDate());
                                            }
                                            
                                            for(i = 0; i < efsqVisitDatesG1.length; i++){
                                                if(visitYear[i] == schoolYearStart && visitMonth[i] >= 6 || visitYear[i] == schoolYearEnd && visitMonth[i] <= 4){ // filter all clinic visits from start of the school year
                                                    curVisitDates.push(new Date(visitYear[i], visitMonth[i], visitDay[i]+1));
                                                    impressionDiagnosis.push({
                                                        diagnosis: efsqVisitsTempG1[i].diagnosis,
                                                        impression: efsqVisitsTempG1[i].impression
                                                    });
                                                }
                                            }
    
                                            for(i = 0; i < curVisitDates.length; i++){
                                                if(curVisitDates[i] < programStartDate){ 
                                                    //count mga diarrhea before progStart
                                                    console.log("ilang beses pumasok sa before efsq?");
                                                    if(impressionDiagnosis[i].impression.toLowerCase() == "diarrhea" || impressionDiagnosis[i].diagnosis.toLowerCase() == "diarrhea" || 
                                                       impressionDiagnosis[i].impression.toLowerCase() == "food poisioning" || impressionDiagnosis[i].diagnosis.toLowerCase() == "food poisioning"){
                                                        efsqBeforeCountG1++;
                                                    }
                                                }
                                                else if(curVisitDates[i] > programEndDate){
                                                    console.log("ilang beses pumasok sa after efsq?");
                                                    //count mga diarrhea before progEnd
                                                    if(impressionDiagnosis[i].impression.toLowerCase() == "diarrhea" || impressionDiagnosis[i].diagnosis.toLowerCase() == "diarrhea" || 
                                                       impressionDiagnosis[i].impression.toLowerCase() == "food poisioning" || impressionDiagnosis[i].diagnosis.toLowerCase() == "food poisioning"){
                                                        efsqAfterCountG1++;
                                                    }
                                                }
                                            }
                                            console.log("efsqBeforeCountG1");
                                            console.log(efsqBeforeCountG1);
                                            console.log("efsqAfterCountG1");
                                            console.log(efsqAfterCountG1);
                                        })
                                    }
                                })
                            }
                        }
                    } else if(temp.progType == "Education/Awareness/Skill-based Program"){
    
                    } else if(temp.progType == "Weight Management Program"){
                        for(i = 0; i < populationArray.length; i++){
                            if(populationArray[i] == "Grade 1"){
                                apeRef.once('value', (snapshot) => {
                                    snapshot.forEach(function(ape){ // skipping id number
                                        ape.child('ape').forEach(function(apeList){
                                            var apeData = apeList.exportVal();
                                            if(apeData.grade == "1"){   // dont forget if weightStatus is overweight or obese
                                                wpeApeGrade1Temp.push({
                                                    id: ape.key,
                                                    name: apeData.name,
                                                    schoolYear: apeList.key,
                                                    grade: apeData.grade,
                                                    weight: apeData.weight,
                                                })
                                            } 
                                        })
                                    })
    
                                    var g1currID = wpeApeGrade1Temp[0].id;
                                    for(i = 0; i < wpeApeGrade1Temp.length; i++){
                                        if(g1currID == wpeApeGrade1Temp[i].id){    // if same id number
                                            if(wpeApeGrade1Temp[i].schoolYear == prevSchoolYear){    // APE last year
                                                wpeApeG1LastYearTemp.push({
                                                    id: wpeApeGrade1Temp[i].id,
                                                    name: wpeApeGrade1Temp[i].name,
                                                    schoolYear: wpeApeGrade1Temp[i].schoolYear,
                                                    grade: wpeApeGrade1Temp[i].grade,
                                                    weight: wpeApeGrade1Temp[i].weight,
                                                })
                                                if(checker == 0 && wpeApeGrade1Temp[i].schoolYear == prevSchoolYear){
                                                    wpeApeG1CurrYearTemp.push({
                                                        id: wpeApeGrade1Temp[i].id,
                                                        name: wpeApeGrade1Temp[i].name,
                                                        schoolYear: schoolYear,
                                                        grade: wpeApeGrade1Temp[i].grade,
                                                        weight: 'No APE record.',
                                                    })
                                                }
                                            } else {
                                                var checker = 0;
                                                for(j = 0; j < wpeApeGrade1Temp.length; j++){
                                                    if(wpeApeGrade1Temp[j].schoolYear == schoolYear){
                                                        wpeApeG1CurrYearTemp.push({
                                                            id: wpeApeGrade1Temp[i].id,
                                                            name: wpeApeGrade1Temp[i].name,
                                                            schoolYear: wpeApeGrade1Temp[i].schoolYear,
                                                            grade: wpeApeGrade1Temp[i].grade,
                                                            weight: wpeApeGrade1Temp[i].weight,
                                                        })
                                                        checker = 1;
                                                    }
                                                }
                                                
                                            }
                                            console.log("wpeApeG1LastYearTemp");
                                            console.log(wpeApeG1LastYearTemp);
                                            console.log("wpeApeG1CurrYearTemp");
                                            console.log(wpeApeG1CurrYearTemp);
                                        } else {
                                            g1currID = wpeApeGrade1Temp[i].id;
                                            i--;
                                        }
                                    }
                                })
                            }
                            if(populationArray[i] == "Grade 2"){
                                apeRef.once('value', (snapshot) => {
                                    snapshot.forEach(function(ape){ // skipping id number
                                        ape.child('ape').forEach(function(apeList){
                                            var apeData = apeList.exportVal();
                                            if(apeData.grade == "2"){   // dont forget if weightStatus is overweight or obese
                                                wpeApeGrade2Temp.push({
                                                    id: ape.key,
                                                    name: apeData.name,
                                                    schoolYear: apeList.key,
                                                    grade: apeData.grade,
                                                    weight: apeData.weight,
                                                })
                                            } 
                                        })
                                    })
    
                                    var g2currID = wpeApeGrade2Temp[0].id;
                                    for(i = 0; i < wpeApeGrade2Temp.length; i++){
                                        if(g2currID == wpeApeGrade2Temp[i].id){    // if same id number
                                            if(wpeApeGrade2Temp[i].schoolYear == prevSchoolYear){    // APE last year
                                                wpeApeG2LastYearTemp.push({
                                                    id: wpeApeGrade2Temp[i].id,
                                                    name: wpeApeGrade2Temp[i].name,
                                                    schoolYear: wpeApeGrade2Temp[i].schoolYear,
                                                    grade: wpeApeGrade2Temp[i].grade,
                                                    weight: wpeApeGrade2Temp[i].weight,
                                                })
                                                if(checker == 0 && wpeApeGrade2Temp[i].schoolYear == prevSchoolYear){
                                                    wpeApeG2CurrYearTemp.push({
                                                        id: wpeApeGrade2Temp[i-1].id,
                                                        name: wpeApeGrade2Temp[i-1].name,
                                                        schoolYear: schoolYear,
                                                        grade: wpeApeGrade2Temp[i-1].grade,
                                                        weight: 'No APE record.',
                                                    })
                                                }
                                            } else {
                                                var checker = 0;
                                                for(j = 0; j < wpeApeGrade2Temp.length; j++){
                                                    if(wpeApeGrade2Temp[j].schoolYear == schoolYear){
                                                        wpeApeG2CurrYearTemp.push({
                                                            id: wpeApeGrade2Temp[i].id,
                                                            name: wpeApeGrade2Temp[i].name,
                                                            schoolYear: wpeApeGrade2Temp[i].schoolYear,
                                                            grade: wpeApeGrade2Temp[i].grade,
                                                            weight: wpeApeGrade2Temp[i].weight,
                                                        })
                                                        checker = 1;
                                                    }
                                                }
                                            }
                                        } else {
                                            g2currID = wpeApeGrade2Temp[i].id;
                                            i--;
                                        }
                                    }
                                })
                            }
                        }
                    }
                })
            }
        })
    }
}