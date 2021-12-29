const firebase = require('../firebase');

exports.getTop5MedsUsedMonth = function(req, res){
    var data, i, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var intakeRef = database.ref("intakeHistory");
    var g1Count = [], g2Count = [], g3Count = [], g4Count = [], g5Count = [], g6Count = [];

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("usedMedicine")){
            intakeRef.on('value', (childSnapshot) => { // year
                childSnapshot.forEach(function(innerChildSnapshot){
                    innerChildSnapshot.child('medications').forEach(function(medications){
                        medications = medications.exportVal();
                        console.log("medications in controller");
                        console.log(medications);
                        temp.push({ // gettung all the medications regardless of grade level
                            medicineName: medications.medicine,
                        })
                    })
                    
                })

                console.log("temp medications");
                console.log(temp);
                
                temp.forEach(inventory => {
                    var found = false;
                    for(i = 0; i < filtered.length; i++){
                        if(inventory.medicineName == filtered[i].medicineName){   // filters if same medicine name and same date
                            found = true;
                            filtered[i].count++;
                            break;
                        } 
                    }
                    if(!found){
                        filtered.push({
                            medicineName: inventory.medicineName,
                            count: 1,
                        })
                    }    
                })
                console.log("filtered intake medicine");
                console.log(filtered);
                res.status(200).send(filtered);
            })
        } else {
            res.status(200).send(filtered);
        }
    })
};