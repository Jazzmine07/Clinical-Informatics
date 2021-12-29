const firebase = require('../firebase');

exports.getTop5MedsUsedMonth = function(req, res){
    var data, i, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var intakeRef = database.ref("intakeHistory");

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("usedMedicine")){
            intakeRef.on('value', (childSnapshot) => { // year
                childSnapshot.forEach(function(innerChildSnapshot){ 
                    data = innerChildSnapshot.exportVal();
                    temp.push({
                        medicineID: data.medicineID,
                        medicineName: data.medicineName,
                        dateUpdated: data.dateUpdated,
                        usedInventory: data.usedInventory,
                    })
                })

                console.log("temp bago ifilter");
                console.log(temp);
                
                temp.forEach(inventory => {
                    var found = false;
                    for(i = 0; i < filtered.length; i++){
                        if(inventory.dateUpdated == filtered[i].dateUpdated){   // filters if same medicine name and same date
                            found = true;
                            filtered[i].count++;
                            break;
                        } 
                    }
                    if(!found){
                        filtered.push({
                            medicineID: inventory.medicineID,
                            medicineName: inventory.medicineName,
                            dateUpdated: inventory.dateUpdated,
                            usedInventory: inventory.usedInventory,
                            count: 1,
                        })
                    }    
                })
                console.log("filtered used medicine for the day");
                console.log(filtered);
                for(i = 0; i < filtered.length; i++){
                    
                }
                res.status(200).send(filtered);
            })
        } else {
            res.status(200).send(filtered);
        }
    })
};