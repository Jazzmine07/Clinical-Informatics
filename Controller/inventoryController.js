const firebase = require('../firebase');

exports.addMedicineInventory = function(req, res){
    var medicationsArray = req.body.meds;
    var i, medicines;
    //var time = Math.round(+new Date()/1000);

    var database = firebase.database();
    var inventoryRef = database.ref("medicineInventory");

    for(i = 0; i < medicationsArray.length; i++){
        medicines = {
            batchNum: medicationsArray[i].batchNum,
            medicine: medicationsArray[i].medication,
            quantity: medicationsArray[i].quantity,
            unit: medicationsArray[i].unit,
            purchDate: medicationsArray[i].purchDate,
            expDate: medicationsArray[i].expDate
        };
        inventoryRef.push(medicines);
    }
    // needed as ajax was used to send data
    res.status(200).send();
};

exports.getMedicineInventory = function(){
    var childSnapshotData, inventory = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("medicineInventory");

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("medicineInventory")){
                inventoryRef.on('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        inventory.push({
                            medicineID: innerChildSnapshot.key,
                            batchNum: childSnapshotData.batchNum,
                            med: childSnapshotData.medicine,
                            qty: parseInt(childSnapshotData.quantity),
                            unit: childSnapshotData.unit,
                            purchDate: childSnapshotData.purchDate,
                            expDate: childSnapshotData.expDate
                        })
                    })
                    console.log("medicine inventory in controller");
                    console.log(inventory);
                    resolve(inventory);
                })
            } else {
                resolve(inventory);
            }
        })
    });
    return promise;
};

exports.getMedicines = function(){
    var childSnapshotData, i, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("medicineInventory");

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("medicineInventory")){
                inventoryRef.on('value',async (childSnapshot) => {
                    await childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            med: childSnapshotData.medicine,
                        })
                    })

                    await temp.forEach(medicine => {
                        var found = false;
                        for(i = 0; i < filtered.length; i++){
                            if(medicine.med == filtered[i].med){   // filters if same medicine name
                                found = true;
                                break;
                            } 
                        }
                        if(!found){
                            filtered.push({
                                med: medicine.med,
                            })
                        }    
                    })
                    console.log("medicines in controller");
                    console.log(filtered);
                    resolve(filtered);
                })
            } else {
                resolve(filtered);
            }
        })
    });
    return promise;
};

exports.updateMedicineInventory = function(req, res){
    var medicineID = req.body.medicineID;
    var amount = req.body.amount;
    var inventoryRef = firebase.database().ref("medicineInventory/" + medicineID + "/quantity");
    inventoryRef.set(amount);
    res.status(200).send(amount);
};

exports.addSupplyInventory = function(req, res){
    var suppliesArray = req.body.supplies;
    var i, supplies;
    //var time = Math.round(+new Date()/1000);

    var database = firebase.database();
    var inventoryRef = database.ref("supplyInventory");

    for(i = 0; i < suppliesArray.length; i++){
        supplies = {
            batchNum: suppliesArray[i].batchNum,
            supply: suppliesArray[i].supply,
            quantity: suppliesArray[i].quantity,
            unit: suppliesArray[i].unit,
            purchDate: suppliesArray[i].purchDate,
            expDate: suppliesArray[i].expDate
        };
        inventoryRef.push(supplies);
    }
    
    // needed as ajax was used to send data
    res.status(200).send();
};

exports.getSupplyInventory = function(){
    var childSnapshotData, inventory = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("supplyInventory");

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("supplyInventory")){
                inventoryRef.on('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        inventory.push({
                            supplyID: innerChildSnapshot.key,
                            batchNum: childSnapshotData.batchNum,
                            supply: childSnapshotData.supply,
                            qty: parseInt(childSnapshotData.quantity),
                            unit: childSnapshotData.unit,
                            purchDate: childSnapshotData.purchDate,
                            expDate: childSnapshotData.expDate
                        })
                    })
                    console.log("supply inventory in controller");
                    console.log(inventory);
                    resolve(inventory);
                })
            } else {
                resolve(inventory);
            }
        })
    });
    return promise;
};

exports.getSupplies = function(){
    var childSnapshotData, i, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("supplyInventory");

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("supplyInventory")){
                inventoryRef.on('value',async (childSnapshot) => {
                    await childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            supply: childSnapshotData.supply,
                        })
                    })

                    await temp.forEach(supplies => {
                        var found = false;
                        for(i = 0; i < filtered.length; i++){
                            if(supplies.supply == filtered[i].supply){   // filters if same supply name
                                found = true;
                                break;
                            } 
                        }
                        if(!found){
                            filtered.push({
                                supply: supplies.supply,
                            })
                        }    
                    })
                    console.log("supplies in controller");
                    console.log(filtered);
                    resolve(filtered);
                })
            } else {
                resolve(filtered);
            }
        })
    });
    return promise;
};

exports.updateSupplyInventory = function(req, res){
    var supplyID = req.body.supplyID;
    var amount = req.body.amount;
    var inventoryRef = firebase.database().ref("supplyInventory/" + supplyID + "/quantity");
    inventoryRef.set(amount);
    res.status(200).send(amount);
};

exports.addDentalInventory = function(req, res){
    var dentalArray = req.body.dentalArray;
    var i, dentals;
    //var time = Math.round(+new Date()/1000);

    var database = firebase.database();
    var inventoryRef = database.ref("dentalInventory");

    for(i = 0; i < dentalArray.length; i++){
        dentals = {
            batchNum: dentalArray[i].batchNum,
            dental: dentalArray[i].dental,
            quantity: dentalArray[i].quantity,
            unit: dentalArray[i].unit,
            purchDate: dentalArray[i].purchDate,
            expDate: dentalArray[i].expDate
        };
        inventoryRef.push(dentals);
    }
    
    // needed as ajax was used to send data
    res.status(200).send();
};

exports.getDentalInventory = function(){
    var childSnapshotData, inventory = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("dentalInventory");

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("dentalInventory")){
                inventoryRef.on('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        inventory.push({
                            dentalID: innerChildSnapshot.key,
                            batchNum: childSnapshotData.batchNum,
                            dental: childSnapshotData.dental,
                            qty: parseInt(childSnapshotData.quantity),
                            unit: childSnapshotData.unit,
                            purchDate: childSnapshotData.purchDate,
                            expDate: childSnapshotData.expDate
                        })
                    })
                    console.log("dental inventory in controller");
                    console.log(inventory);
                    resolve(inventory);
                })
            } else {
                resolve(inventory);
            }
        })
    });
    return promise;
};

exports.getDentals = function(){
    var childSnapshotData, i, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("dentalInventory");

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("dentalInventory")){
                inventoryRef.on('value',async (childSnapshot) => {
                    await childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            dental: childSnapshotData.dental,
                        })
                    })

                    await temp.forEach(dental => {
                        var found = false;
                        for(i = 0; i < filtered.length; i++){
                            if(dental.dental == filtered[i].dental){   // filters if same medicine name
                                found = true;
                                break;
                            } 
                        }
                        if(!found){
                            filtered.push({
                                dental: dental.dental,
                            })
                        }    
                    })
                    console.log("dentals in controller");
                    console.log(filtered);
                    resolve(filtered);
                })
            } else {
                resolve(filtered);
            }
        })
    });
    return promise;
};

exports.updateDentalInventory = function(req, res){
    var dentalID = req.body.dentalID;
    var amount = req.body.amount;
    var inventoryRef = firebase.database().ref("dentalInventory/" + dentalID + "/quantity");
    inventoryRef.set(amount);
    res.status(200).send(amount);
};