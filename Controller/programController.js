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
    var childSnapshotData, programs =[];

    var promise = new Promise((resolve, reject) => {
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("programs")){
                query.on('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal(); 
                        programs.push({
                            startDate: childSnapshotData.startDate,
                            endDate: childSnapshotData.endDate,
                            progName: childSnapshotData.progName,
                            progType: childSnapshotData.progType,
                            population: childSnapshotData.population,
                            location: childSnapshotData.location
                        })
                    })  
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