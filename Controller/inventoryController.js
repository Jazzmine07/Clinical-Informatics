const firebase = require('../firebase');

exports.addInventory = function(req, res){
    var medicationsArray = req.body.meds;
    var i;
    //var time = Math.round(+new Date()/1000);

    var database = firebase.database();
    var inventoryRef = database.ref("inventory");

    // for(i = 0; i < medicationsArray.length; i++){
    //     medicines = {
    //         medicine: medicationsArray[i].medication,
    //         quantity: medicationsArray[i].quantity,
    //         unit: medicationsArray[i].unit,
    //         purchDate: medicationsArray[i].purchDate,
    //         expDate: medicationsArray[i].expDate
    //     };
    //     inventoryRef.push(medicines);
    // }
    
    // needed as ajax was used to send data
    res.status(200).send();
}

exports.getInventory = function(){
    var childSnapshotData, temp = [];

    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("inventory");

    var promise = new Promise((resolve,reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("inventory")){
                inventoryRef.on('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            med: childSnapshotData.medicine,
                            qty: parseInt(childSnapshotData.quantity),
                            unit: childSnapshotData.unit,
                            purchDate: childSnapshotData.purchDate,
                            expDate: childSnapshotData.expDate
                        })
                    })
                    var inventory = [];
    
                    temp.reverse().forEach(inv => {
                        var found = false;
                        for(i = 0; i < inventory.length; i++){
                            if(inv.med == inventory[i].med){   // filters if same medication
                                inventory[i].purchDate.push(inv.purchDate);
                                inventory[i].expDate.push(inv.expDate);
                                inventory[i].qty += inv.qty;
                                found = true;
                                break;
                            } 
                        }
                        if(!found){
                            inventory.push({
                                med: inv.med,
                                qty: inv.qty,
                                unit: inv.unit,
                                purchDate: [],
                                expDate: []
                            })
                            inventory[i].purchDate.push(inv.purchDate);
                            inventory[i].expDate.push(inv.expDate);
                        }          
                    });
                    console.log("inventory in controller");
                    console.log(inventory);
                    resolve(inventory);
                })
            } else {
                resolve(inventory);
            }
        })
    });
    return promise;
}