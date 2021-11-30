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

exports.getInventory = function(req, res){
    var childSnapshotData, inventory = [];

    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("inventory");

    databaseRef.on('value', (snapshot) => {
        if(snapshot.hasChild("inventory")){
            inventoryRef.on('value', (childSnapshot) => {
                childSnapshot.forEach(function(innerChildSnapshot){
                    childSnapshotData = innerChildSnapshot.exportVal();
                    inventory.push({
                        med: childSnapshotData.medicine,
                        qty: childSnapshotData.quantity,
                        unit: childSnapshotData.unit,
                        purchDate: childSnapshotData.purchDate,
                        expDate: childSnapshotData.expDate
                    })
                })
                // console.log("inventory in controller");
                // console.log(inventory);
                res(inventory);
            })
        } else {
            res(inventory);
        }
    })
}