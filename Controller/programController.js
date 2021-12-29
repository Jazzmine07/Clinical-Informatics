const firebase = require('../firebase');

exports.addProgram = function(req, res){
    var { progType, progName, description, objectives,
        population, startDate, endDate, location } = req.body;
    var database = firebase.database();
    var programRef = database.ref("programs");
    var time = Math.round(+new Date()/1000);
    var i, key;

    var program = {
        progType: progType,
        progName: progName,
        description: description,
        objectives: objectives,
        startDate: startDate,
        endDate: endDate,
        location: location,
        timestamp: time
    };

    key = programRef.push(program).key;

    for(i = 0; i < population.length; i++){
        var populationGroup = {
            population: population[i]
        }
        database.ref('programs/' + key + '/population').push(populationGroup);
    }
    
    res.status(200).send();
}

exports.getProgramsList = function(req, res){
    var database = firebase.database();
    var databaseRef = database.ref();
    var programRef = database.ref("programs");
    var query = programRef.orderByChild("startDate");
    var childSnapshotData, programs =[], population = [];

    var promise = new Promise((resolve, reject) => {
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("programs")){
                query.on('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal(); 
                        innerChildSnapshot.child('population').forEach(function(populationGroup){
                            population.push({
                                population: populationGroup.child('population').val()
                            })
                        })
                    
                        programs.push({
                            startDate: childSnapshotData.startDate,
                            endDate: childSnapshotData.endDate,
                            progName: childSnapshotData.progName,
                            progType: childSnapshotData.progType,
                            population: population,
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