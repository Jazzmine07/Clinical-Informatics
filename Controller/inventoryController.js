const firebase = require('../firebase');

exports.addMedicineInventory = async function(req, res){
    var medicationsArray = req.body.meds;
    var i, medicines;
    var snapshotData;

    var database = firebase.database();
    var rootRef = database.ref();
    var inventoryRef = database.ref("medicineInventory");
    var qty;
    /* TO DO: fix add inventory in existing inventory */
    for(i = 0; i < medicationsArray.length; i++){
        console.log(medicationsArray[i].medication);
        //await rootRef.child("medicineInventory").orderByChild("medicine").equalTo(medicationsArray[i].medication).once('value', (snapshot) => {
            //snapshotData = snapshot.exportVal();
            //console.log(snapshotData);
            //if(snapshotData.batchNum == parseInt(medicationsArray[i].batchNum)){
            //    qty = snapshotData.quantity + medicationsArray[i].quantity;
            //    snapshotData.quantity.set(qty);
            //} else {
                medicines = {
                    batchNum: parseInt(medicationsArray[i].batchNum),
                    medicine: medicationsArray[i].medication + " " + medicationsArray[i].dosageForm + " " + medicationsArray[i].strength,
                    name: medicationsArray[i].medication,
                    dosageForm: medicationsArray[i].dosageForm,
                    strength: medicationsArray[i].strength,
                    quantity: parseInt(medicationsArray[i].quantity),
                    unit: medicationsArray[i].unit,
                    purchDate: medicationsArray[i].purchDate,
                    expDate: medicationsArray[i].expDate
                };
        
                inventoryRef.push(medicines);
            //}
        //})
    }
    // needed as ajax was used to send data
    res.status(200).send();
};

exports.getMedicineInventory = function(){
    var childSnapshotData, inventory = [], details;
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("medicineInventory");

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("medicineInventory")){
                inventoryRef.once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        
                        //console.log(childSnapshot.exportVal());
                        details = {
                            medicineID: innerChildSnapshot.key,
                            batchNum: childSnapshotData.batchNum,
                            med: childSnapshotData.medicine,
                            qty: parseInt(childSnapshotData.quantity),
                            unit: childSnapshotData.unit,
                            purchDate: childSnapshotData.purchDate,
                            expDate: childSnapshotData.expDate
                        };
                        inventory.push({
                            details: details
                        });
                    })
                    resolve(inventory);
                })
            } else {
                resolve(inventory);
            }
        })
    });
    return promise;
};

// for front-end
exports.getMedicineInventoryList = function(req, res){
    var childSnapshotData, inventory = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("medicineInventory");
    
    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("medicineInventory")){
            inventoryRef.once('value', (childSnapshot) => {
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
                    });
                })
                res.status(200).send(inventory);
            })
        } else {
            res.status(200).send(inventory);
        }
    })
};

// for front-end
exports.getGroupedMedicineInventory = function(req, res){
    var childSnapshotData, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("medicineInventory");
    
    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("medicineInventory")){
            inventoryRef.once('value', (childSnapshot) => {
                childSnapshot.forEach(function(innerChildSnapshot){
                    childSnapshotData = innerChildSnapshot.exportVal();
                    temp.push({
                        medicine: childSnapshotData.medicine,
                        qty: parseInt(childSnapshotData.quantity),
                        unit: childSnapshotData.unit,
                    });
                })

                temp.forEach(inventory => {
                    var found = false;
                    for(i = 0; i < filtered.length; i++){
                        if(inventory.medicine == filtered[i].medicine){   // filters if same medicine name
                            filtered[i].quantity += inventory.qty;
                            found = true;
                            break;
                        } 
                    }
                    if(!found){
                        filtered.push({
                            medicine: inventory.medicine,
                            quantity: inventory.qty,
                            unit: inventory.unit
                        })
                    }    
                })
                res.status(200).send(filtered);
            })
        } else {
            res.status(200).send(filtered);
        }
    })
};

exports.getSpecificMedicines = function(){
    var childSnapshotData, i, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("medicineInventory");

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("medicineInventory")){
                inventoryRef.once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            medicine: childSnapshotData.medicine,
                            name: childSnapshotData.name
                        })
                    })

                    temp.forEach(med => {
                        var found = false;
                        for(i = 0; i < filtered.length; i++){
                            if(med.medicine == filtered[i].medicine){   // filters if same medicine name
                                found = true;
                                break;
                            } 
                        }
                        if(!found){
                            filtered.push({
                                medicine: med.medicine,
                                name: med.name
                            })
                        }    
                    })
                    console.log("filtered");
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

exports.getMedicineNames = function(){
    var childSnapshotData, i, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("medicineInventory");

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("medicineInventory")){
                inventoryRef.once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            medicine: childSnapshotData.medicine,
                            name: childSnapshotData.name
                        })
                    })

                    temp.forEach(med => {
                        var found = false;
                        for(i = 0; i < filtered.length; i++){
                            if(med.name == filtered[i].name){   // filters if same medicine name
                                found = true;
                                break;
                            } 
                        }
                        if(!found){
                            filtered.push({
                                medicine: med.medicine,
                                name: med.name
                            })
                        }    
                    })
                    console.log("filtered");
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

exports.getMedicineDetails = function(req, res){
    var childSnapshotData, i, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("medicineInventory");

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("medicineInventory")){
            inventoryRef.once('value',async (childSnapshot) => {
                await childSnapshot.forEach(function(innerChildSnapshot){
                    childSnapshotData = innerChildSnapshot.exportVal();
                    temp.push({
                        medicine: childSnapshotData.medicine,
                        name: childSnapshotData.name,
                        dosageForm: childSnapshotData.dosageForm,
                        strength: childSnapshotData.strength,
                    })
                })

                await temp.forEach(med => {
                    var found = false;
                    for(i = 0; i < filtered.length; i++){
                        if(med.medicine == filtered[i].medicine){   // filters if same medicine name
                            found = true;
                            break;
                        } 
                    }
                    if(!found){
                        filtered.push({
                            medicine: med.medicine,
                            name: med.name,
                            dosageForm: med.dosageForm,
                            strength: med.strength
                        })
                    }    
                })
                console.log("laman ng medicine details");
                console.log(filtered);
                res.status(200).send(filtered);
            })
        } else {
            res.status(200).send(filtered);
        }
    })
};

exports.getUsedMedicineDaily = function(req, res){
    var data, i, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("usedMedicine");

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("usedMedicine")){
            inventoryRef.once('value', (childSnapshot) => { // year
                childSnapshot.forEach(function(innerChildSnapshot){ 
                    data = innerChildSnapshot.exportVal();
                    temp.push({
                        medicineID: data.medicineID,
                        medicineName: data.medicineName,
                        dateUpdated: data.dateUpdated,
                        usedInventory: data.usedInventory,
                    })
                })

                temp.forEach(inventory => {
                    var found = false;
                    for(i = 0; i < filtered.length; i++){
                        if(inventory.dateUpdated == filtered[i].dateUpdated && inventory.medicineName == filtered[i].medicineName){   // filters if same medicine name and same date
                            found = true;
                            filtered[i].usedInventory+=inventory.usedInventory;
                            break;
                        } 
                    }
                    if(!found){
                        filtered.push({
                            medicineID: inventory.medicineID,
                            medicineName: inventory.medicineName,
                            dateUpdated: inventory.dateUpdated,
                            usedInventory: inventory.usedInventory,
                        })
                    }    
                })
                res.status(200).send(filtered);
            })
        } else {
            res.status(200).send(filtered);
        }
    })
};

exports.updateMedicineInventory = function(req, res){
    var { medicineID, batchNum, medicineName, qty, amount, unit } = req.body;
    var used = parseInt(qty) - parseInt(amount);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); 

    var database = firebase.database();
    var discrepancyRef = database.ref("discrepancyMedicine/");

    var inventoryRef = firebase.database().ref("medicineInventory/" + medicineID + "/quantity");
    inventoryRef.set(amount);   // update inventory

    var discrepancy = {
        medicineID: medicineID,
        batchNum: batchNum,
        medicineName: medicineName,
        usedInventory: used,
        unit: unit,
        dateUpdated: date
    };
    discrepancyRef.push(discrepancy);

    res.status(200).send(amount);
};

exports.getUsedMedicineToday = function(){
    var childSnapshotData, i, temp = [], filtered = [], currInventory;
    var database = firebase.database();
    var databaseRef = database.ref();
    
    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("usedMedicine")){
                database.ref("usedMedicine/").once('value', async (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            medicineID: childSnapshotData.medicineID,
                            batchNum: childSnapshotData.batchNum,
                            medicineName: childSnapshotData.medicineName,
                            usedInventory: childSnapshotData.usedInventory,
                            unit: childSnapshotData.unit,
                        })
                    })

                    await temp.forEach(inventory => {
                        var found = false;
                        databaseRef.child("medicineInventory").child(inventory.medicineID).on('value', (snapshot) => {
                            currInventory = snapshot.child("quantity").val();
                            for(i = 0; i < filtered.length; i++){
                                if(inventory.batchNum == filtered[i].batchNum && inventory.medicineName == filtered[i].medicineName){   // filters if same medicine name and batch number
                                    found = true;
                                    filtered[i].usedInventory += inventory.usedInventory;
                                    break;
                                } 
                            }
                            if(!found){
                                filtered.push({
                                    medicineID: inventory.medicineID,
                                    batchNum: inventory.batchNum,
                                    medicineName: inventory.medicineName,
                                    currInventory: currInventory,
                                    usedInventory: inventory.usedInventory,
                                    unit: inventory.unit,
                                })
                            }    
                        })
                    })
                    resolve(filtered);
                })
            } else {
                resolve(filtered);
            }
        })
    });
    return promise;
}

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
                inventoryRef.once('value', (childSnapshot) => {
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
                inventoryRef.once('value',async (childSnapshot) => {
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
                inventoryRef.once('value', (childSnapshot) => {
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
                inventoryRef.once('value',async (childSnapshot) => {
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