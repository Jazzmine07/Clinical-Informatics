const firebase = require('../firebase');

exports.getTop5MedsUsedMonth = function(req, res){
    var database = firebase.database();
    var databaseRef = database.ref();
    var intakeRef = database.ref("intakeHistory");
    var i, temp = [], filtered = [], top5 = [];
    var g1Count = [], g2Count = [], g3Count = [], g4Count = [], g5Count = [], g6Count = [];

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
                res.status(200).send(filtered);
            })
        } else {
            res.status(200).send(filtered);
        }
    })
};