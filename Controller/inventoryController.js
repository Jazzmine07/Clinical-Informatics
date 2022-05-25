const res = require('express/lib/response');
const firebase = require('../firebase');

// This function is used to add medicine inventories 
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

// This function is used to get all the medicine inventories to be displayed to the nurse 
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

// This function is used to get all the medicine inventories to be sent to the front end in order to update discrepancy real-time
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

// This function is used to get all the medicine inventories grouped by medicine regardless of batch number
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

// This function is used to get all the medicine used with the same month and year
exports.getUsedMedicineMonthYear = function(req, res){
    var childSnapshotData, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("discrepancyMedicine");
    
    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("discrepancyMedicine")){
            inventoryRef.once('value', (childSnapshot) => {
                childSnapshot.forEach(function(innerChildSnapshot){
                    childSnapshotData = innerChildSnapshot.exportVal();
                    temp.push({
                        medicineID: childSnapshotData.medicineID,
                        medicineName: childSnapshotData.medicineName,
                        dateUpdated: childSnapshotData.dateUpdated,
                        usedInventory: childSnapshotData.usedInventory,
                    })
                })

                temp.forEach(inventory => {
                    var found = false;
                    var inventoryDate = inventory.dateUpdated.split("-");

                    for(i = 0; i < filtered.length; i++){
                        var filteredDate = filtered[i].dateUpdated.split("-");
                        if(inventoryDate[0] == filteredDate[0] && inventoryDate[1] == filteredDate[1] && inventory.medicineName == filtered[i].medicineName){   // filters if same medicine name and same month and year
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
                // console.log("filtered in controller");
                // console.log(filtered);
                res.status(200).send(filtered);
            })
        } else {
            res.status(200).send(filtered);
        }
    })
};

// This function is used to get all the specific medicines (with dosage and strength) for medication section
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
                    // console.log("filtered");
                    // console.log(filtered);
                    resolve(filtered);
                })
            } else {
                resolve(filtered);
            }
        })
    });
    return promise;
};

// This function is used to get all the generic medicine for adding inventory purposes (category)
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
                    // console.log("filtered");
                    // console.log(filtered);
                    resolve(filtered);
                })
            } else {
                resolve(filtered);
            }
        })
    });
    return promise;
};

// This function is used to get all the generic medicine name ie paracetamol for getting generic names in nurse intake history
exports.getMedicineNamesFront = function(req, res){
    var childSnapshotData, i, temp = [], filtered = [];
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
                            name: med.name
                        })
                    }    
                })
                res.send(filtered);
            })
        } else {
            res.send(filtered);
        }
    })
};

// exports.getMedicineDetails = function(req, res){
//     var childSnapshotData, i, temp = [], filtered = [];
//     var database = firebase.database();
//     var databaseRef = database.ref();
//     var inventoryRef = database.ref("medicineInventory");

//     databaseRef.once('value', (snapshot) => {
//         if(snapshot.hasChild("medicineInventory")){
//             inventoryRef.once('value',async (childSnapshot) => {
//                 await childSnapshot.forEach(function(innerChildSnapshot){
//                     childSnapshotData = innerChildSnapshot.exportVal();
//                     temp.push({
//                         medicine: childSnapshotData.medicine,
//                         name: childSnapshotData.name,
//                         dosageForm: childSnapshotData.dosageForm,
//                         strength: childSnapshotData.strength,
//                     })
//                 })

//                 await temp.forEach(med => {
//                     var found = false;
//                     for(i = 0; i < filtered.length; i++){
//                         if(med.medicine == filtered[i].medicine){   // filters if same medicine name
//                             found = true;
//                             break;
//                         } 
//                     }
//                     if(!found){
//                         filtered.push({
//                             medicine: med.medicine,
//                             name: med.name,
//                             dosageForm: med.dosageForm,
//                             strength: med.strength
//                         })
//                     }    
//                 })
//                 console.log("laman ng medicine details");
//                 console.log(filtered);
//                 res.status(200).send(filtered);
//             })
//         } else {
//             res.status(200).send(filtered);
//         }
//     })
// };

// This function is used to record any discrepancy in the medicine inventory
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

// This function is used to get all the discrepancy in the medicine inventory for low stock detection
exports.getMedicineDiscrepancy = function(req, res){
    var data, i, temp = [], filtered = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("discrepancyMedicine");

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("discrepancyMedicine")){
            inventoryRef.once('value', (childSnapshot) => { 
                childSnapshot.forEach(function(innerChildSnapshot){ 
                    data = innerChildSnapshot.exportVal();
                    temp.push({
                        medicineID: data.medicineID,
                        batchNum: data.batchNum,
                        medicineName: data.medicineName,
                        dateUpdated: data.dateUpdated,
                        usedInventory: data.usedInventory,
                    })
                })

                temp.forEach(inventory => {
                    var found = false;
                    for(i = 0; i < filtered.length; i++){
                        if(inventory.batchNum == filtered[i].batchNum && inventory.dateUpdated == filtered[i].dateUpdated && inventory.medicineName == filtered[i].medicineName){   // filters if same medicine name and same date
                            found = true;
                            filtered[i].usedInventory+=inventory.usedInventory;
                            break;
                        } 
                    }
                    if(!found){
                        filtered.push({
                            medicineID: inventory.medicineID,
                            batchNum: inventory.batchNum,
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

// This function is used to get all the discrepancy in the medicine inventory for the day (to be shown to physician)
exports.getUsedMedicineToday = function(){
    var childSnapshotData, i, temp = [], filtered = [], currInventory;
    var database = firebase.database();
    var databaseRef = database.ref();

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); 
    
    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("discrepancyMedicine")){
                database.ref("discrepancyMedicine/").orderByChild('dateUpdated').equalTo(date).once('value', async (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            medicineID: childSnapshotData.medicineID,
                            batchNum: childSnapshotData.batchNum,
                            medicineName: childSnapshotData.medicineName,
                            dateUpdated: childSnapshotData.dateUpdated,
                            usedInventory: childSnapshotData.usedInventory,
                            unit: childSnapshotData.unit,
                        })
                    })

                    console.log("pasok1");

                    await temp.forEach(inventory => {
                        var found = false;
                        databaseRef.child("medicineInventory").child(inventory.medicineID).once('value', (snapshot) => {
                            currInventory = snapshot.child("quantity").val();
                            for(i = 0; i < filtered.length; i++){
                                if(inventory.batchNum == filtered[i].batchNum && inventory.medicineName == filtered[i].medicineName && inventory.dateUpdated == filtered[i].dateUpdated){   // filters if same medicine name and batch number
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
                                    dateUpdated: inventory.dateUpdated,
                                    currInventory: currInventory,
                                    usedInventory: inventory.usedInventory,
                                    unit: inventory.unit,
                                })
                                console.log("filtered1");
                                console.log(filtered);
                            }    
                        })
                    })
                    console.log("filtered2");
                    console.log(filtered);
                    resolve(filtered);
                })
            } else {
                resolve(filtered);
            }
        })
    });
    return promise;
}

// This function is used to get the discrepancy report for the medicine inventory
exports.getMedicineDiscrepancyReport = function(req, res){
    var start = req.query.start;
    var startDate = new Date(start);
    var end = req.query.end;
    var endDate = new Date(end);
    var yearMonthDate = [], newDate;

    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("medicineInventory");
    var childSnapshotData, i, j, temp = [], currInv = [], filtered = [];

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("discrepancyMedicine")){
            inventoryRef.once('value', (medicineInventory) => {
                medicineInventory.forEach(function(medInventory){
                    var data = medInventory.exportVal();
                    currInv.push({
                        medicineID: medInventory.key,
                        medicine: data.medicine,
                        currInventory: data.quantity,
                    })
                })

                database.ref("discrepancyMedicine/").once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            medicineID: childSnapshotData.medicineID,
                            batchNum: childSnapshotData.batchNum,
                            medicineName: childSnapshotData.medicineName,
                            dateUpdated: childSnapshotData.dateUpdated,
                            usedInventory: childSnapshotData.usedInventory,
                            unit: childSnapshotData.unit,
                        })
                    })
    
                    temp.forEach((inventory) => {
                        yearMonthDate = inventory.dateUpdated.split("-"); // 2021-01-03    2021 01 03
                        newDate = new Date(yearMonthDate[0], yearMonthDate[1]-1, yearMonthDate[2]);   // year, month, day
    
                        if(startDate <= newDate && newDate <= endDate){ // if within date range
                            var found = false;
                            for(i = 0; i < currInv.length; i++){
                                if(inventory.medicineID == currInv[i].medicineID){
                                    for(j = 0; j < filtered.length; j++){
                                        if(inventory.batchNum == filtered[j].batchNum && inventory.medicineName == filtered[j].medicineName){   // filters if same medicine name and batch number
                                            found = true;
                                            filtered[j].usedInventory += inventory.usedInventory;
                                            break;
                                        } 
                                    }
                                    if(!found){
                                        filtered.push({
                                            batchNum: inventory.batchNum,
                                            medicineName: inventory.medicineName,
                                            dateUpdated: inventory.dateUpdated,
                                            currInventory: currInv[i].currInventory,
                                            usedInventory: inventory.usedInventory,
                                            unit: inventory.unit,
                                        })
                                    } 
                                }
                            }
                        }
                    })
                    res.status(200).send(filtered);
                })
            })
            
        } else {
            res.status(200).send(filtered);
        }
    })
}

// This function is used to add supply inventories 
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

// This function is used to get all the supply inventories to be displayed to the nurse 
exports.getSupplyInventory = function(){
    var childSnapshotData, supply = [];
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("supplyInventory");

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("supplyInventory")){
                inventoryRef.once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        supply.push({
                            supplyID: innerChildSnapshot.key,
                            batchNum: childSnapshotData.batchNum,
                            supply: childSnapshotData.supply,
                            qty: parseInt(childSnapshotData.quantity),
                            unit: childSnapshotData.unit,
                            purchDate: childSnapshotData.purchDate,
                            expDate: childSnapshotData.expDate
                        })
                    })
                    resolve(supply);
                })
            } else {
                resolve(supply);
            }
        })
    });
    return promise;
};

// This function is used to get all the generic supply name for adding inventory purposes (category)
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

// This function is used to record any discrepancy in the supply inventory
exports.updateSupplyInventory = function(req, res){
    var { supplyID, batchNum, supplyName, qty, amount, unit } = req.body;
    var discrepancy = parseInt(qty) - parseInt(amount);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); 

    var database = firebase.database();
    var discrepancyRef = database.ref("discrepancySupply");

    var inventoryRef = firebase.database().ref("supplyInventory/" + supplyID + "/quantity");
    inventoryRef.set(amount);   // update inventory

    var discrepancy = {
        supplyID: supplyID,
        batchNum: batchNum,
        supplyName: supplyName,
        discrepancy: discrepancy,
        unit: unit,
        dateUpdated: date
    };
    discrepancyRef.push(discrepancy);

    res.status(200).send(amount);
};

// This function is used to get all the discrepancy in the supply inventory for the day (to be shown to physician)
exports.getSupplyDiscrepancy = function(){
    var data, i, temp = [], filtered = [], currInventory;
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("discrepancySupply");
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); 

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("discrepancySupply")){
                inventoryRef.orderByChild('dateUpdated').equalTo(date).once('value', (childSnapshot) => { 
                    childSnapshot.forEach(function(innerChildSnapshot){ 
                        data = innerChildSnapshot.exportVal();
                        temp.push({
                            supplyID: data.supplyID,
                            batchNum: data.batchNum,
                            supplyName: data.supplyName,
                            dateUpdated: data.dateUpdated,
                            discrepancy: data.discrepancy,
                            unit: data.unit,
                        })
                    })

                    temp.forEach(inventory => {
                        var found = false;
                        databaseRef.child("supplyInventory").child(inventory.supplyID).once('value', (snapshot) => {
                            currInventory = snapshot.child("quantity").val();
                            for(i = 0; i < filtered.length; i++){
                                if(inventory.dateUpdated == filtered[i].dateUpdated && inventory.supplyName == filtered[i].supplyName && inventory.batchNum == filtered[i].batchNum){   // filters if same medicine name and same date
                                    found = true;
                                    filtered[i].discrepancy+=inventory.discrepancy;
                                    break;
                                } 
                            }
                            if(!found){
                                filtered.push({
                                    supplyID: inventory.supplyID,
                                    batchNum: inventory.batchNum,
                                    supplyName: inventory.supplyName,
                                    dateUpdated: inventory.dateUpdated,
                                    currInventory: currInventory,
                                    discrepancy: inventory.discrepancy,
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
};

// This function is used to get the discrepancy report for the supply inventory
exports.getSupplyDiscrepancyReport = function(req, res){
    var start = req.query.start;
    var startDate = new Date(start);
    var end = req.query.end;
    var endDate = new Date(end);
    var yearMonthDate = [], newDate;

    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("supplyInventory");
    var childSnapshotData, i, j, temp = [], currInv = [], filtered = [];

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("discrepancySupply")){
            inventoryRef.once('value', (supplyInventory) => {
                supplyInventory.forEach(function(suppInventory){
                    var data = suppInventory.exportVal();
                    currInv.push({
                        supplyID: suppInventory.key,
                        supply: data.supply,
                        currInventory: data.quantity,
                    })
                })

                database.ref("discrepancySupply/").once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            supplyID: childSnapshotData.supplyID,
                            batchNum: childSnapshotData.batchNum,
                            supplyName: childSnapshotData.supplyName,
                            dateUpdated: childSnapshotData.dateUpdated,
                            discrepancy: childSnapshotData.discrepancy,
                            unit: childSnapshotData.unit,
                        })
                    })
    
                    temp.forEach((inventory) => {
                        yearMonthDate = inventory.dateUpdated.split("-"); // 2021-01-03    2021 01 03
                        newDate = new Date(yearMonthDate[0], yearMonthDate[1]-1, yearMonthDate[2]);   // year, month, day
    
                        if(startDate <= newDate && newDate <= endDate){ // if within date range
                            var found = false;
                            for(i = 0; i < currInv.length; i++){
                                if(inventory.supplyID == currInv[i].supplyID){
                                    for(j = 0; j < filtered.length; j++){
                                        if(inventory.batchNum == filtered[j].batchNum && inventory.supplyName == filtered[j].supplyName){   // filters if same medicine name and batch number
                                            found = true;
                                            filtered[j].discrepancy += inventory.discrepancy;
                                            break;
                                        } 
                                    }
                                    if(!found){
                                        filtered.push({
                                            batchNum: inventory.batchNum,
                                            supplyName: inventory.supplyName,
                                            dateUpdated: inventory.dateUpdated,
                                            currInventory: currInv[i].currInventory,
                                            discrepancy: inventory.discrepancy,
                                            unit: inventory.unit,
                                        })
                                    } 
                                }
                            }
                        }
                    })
                    res.status(200).send(filtered);
                })
            })
            
        } else {
            res.status(200).send(filtered);
        }
    })
}

// This function is used to add dental inventories 
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

// This function is used to get all the dental inventories to be displayed to the nurse 
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

// This function is used to get all the generic dental supply name for adding inventory purposes (category)
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

// This function is used to record any discrepancy in the dental supply inventory
exports.updateDentalInventory = function(req, res){
    var { dentalID, batchNum, dentalName, qty, amount, unit } = req.body;
    var discrepancy = parseInt(qty) - parseInt(amount);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); 

    var database = firebase.database();
    var discrepancyRef = database.ref("discrepancyDental");

    var inventoryRef = firebase.database().ref("dentalInventory/" + dentalID + "/quantity");
    inventoryRef.set(amount);   // update inventory

    var discrepancy = {
        dentalID: dentalID,
        batchNum: batchNum,
        dentalName: dentalName,
        discrepancy: discrepancy,
        unit: unit,
        dateUpdated: date
    };
    discrepancyRef.push(discrepancy);

    res.status(200).send(amount);
};

// This function is used to get all the discrepancy in the dental supply inventory for the day (to be shown to physician)
exports.getDentalDiscrepancy = function(){
    var data, i, temp = [], filtered = [], currInventory;
    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("discrepancyDental");
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); 

    var promise = new Promise((resolve, reject)=>{
        databaseRef.once('value', (snapshot) => {
            if(snapshot.hasChild("discrepancyDental")){
                inventoryRef.orderByChild('dateUpdated').equalTo(date).once('value', (childSnapshot) => { 
                    childSnapshot.forEach(function(innerChildSnapshot){ 
                        data = innerChildSnapshot.exportVal();
                        temp.push({
                            dentalID: data.dentalID,
                            batchNum: data.batchNum,
                            dentalName: data.dentalName,
                            dateUpdated: data.dateUpdated,
                            discrepancy: data.discrepancy,
                            unit: data.unit,
                        })
                    })

                    temp.forEach(inventory => {
                        var found = false;
                        databaseRef.child("dentalInventory").child(inventory.dentalID).once('value', (snapshot) => {
                            currInventory = snapshot.child("quantity").val();
                            for(i = 0; i < filtered.length; i++){
                                if(inventory.dateUpdated == filtered[i].dateUpdated && inventory.dentalName == filtered[i].dentalName && inventory.batchNum == filtered[i].batchNum){   // filters if same medicine name and same date
                                    found = true;
                                    filtered[i].discrepancy+=inventory.discrepancy;
                                    break;
                                } 
                            }
                            if(!found){
                                filtered.push({
                                    dentalID: inventory.dentalID,
                                    batchNum: inventory.batchNum,
                                    dentalName: inventory.dentalName,
                                    dateUpdated: inventory.dateUpdated,
                                    currInventory: currInventory,
                                    discrepancy: inventory.discrepancy,
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
};

// This function is used to get the discrepancy report for the dental supply inventory
exports.getDentalDiscrepancyReport = function(req, res){
    var start = req.query.start;
    var startDate = new Date(start);
    var end = req.query.end;
    var endDate = new Date(end);
    var yearMonthDate = [], newDate;

    var database = firebase.database();
    var databaseRef = database.ref();
    var inventoryRef = database.ref("dentalInventory");
    var childSnapshotData, i, j, temp = [], currInv = [], filtered = [];

    databaseRef.once('value', (snapshot) => {
        if(snapshot.hasChild("discrepancyDental")){
            inventoryRef.once('value', (dentalInventory) => {
                dentalInventory.forEach(function(suppInventory){
                    var data = suppInventory.exportVal();
                    currInv.push({
                        dentalID: suppInventory.key,
                        dentalName: data.dental,
                        currInventory: data.quantity,
                    })
                })

                database.ref("discrepancyDental/").once('value', (childSnapshot) => {
                    childSnapshot.forEach(function(innerChildSnapshot){
                        childSnapshotData = innerChildSnapshot.exportVal();
                        temp.push({
                            dentalID: childSnapshotData.dentalID,
                            batchNum: childSnapshotData.batchNum,
                            dentalName: childSnapshotData.dentalName,
                            dateUpdated: childSnapshotData.dateUpdated,
                            discrepancy: childSnapshotData.discrepancy,
                            unit: childSnapshotData.unit,
                        })
                    })
    
                    temp.forEach(inventory => {
                        yearMonthDate = inventory.dateUpdated.split("-"); // 2021-01-03    2021 01 03
                        newDate = new Date(yearMonthDate[0], yearMonthDate[1]-1, yearMonthDate[2]);   // year, month, day
    
                        if(startDate <= newDate && newDate <= endDate){ // if within date range
                            var found = false;
                            for(i = 0; i < currInv.length; i++){
                                if(inventory.dentalID == currInv[i].dentalID){
                                    for(j = 0; j < filtered.length; j++){
                                        if(inventory.batchNum == filtered[j].batchNum && inventory.dentalName == filtered[j].dentalName){   // filters if same medicine name and batch number
                                            found = true;
                                            filtered[j].discrepancy += inventory.discrepancy;
                                            break;
                                        } 
                                    }
                                    if(!found){
                                        filtered.push({
                                            batchNum: inventory.batchNum,
                                            dentalName: inventory.dentalName,
                                            dateUpdated: inventory.dateUpdated,
                                            currInventory: currInv[i].currInventory,
                                            discrepancy: inventory.discrepancy,
                                            unit: inventory.unit,
                                        })
                                    } 
                                }
                            }
                        }
                    })
                    res.status(200).send(filtered);
                })
            })
            
        } else {
            res.status(200).send(filtered);
        }
    })
}