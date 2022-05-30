const firebase = require('../firebase');

// This function is used to get the notifications per user
exports.getNotifications = function(req, res){
    var database = firebase.database();
    var childSnapshotData;
    var notifs = [];

    //var promise= new Promise((resolve,reject)=>{
        //setTimeout(function(){
            user = firebase.auth().currentUser;
            if(user !== null) {
                var uid = user.uid;
                var notifRef = database.ref("notifications/"+uid);
                        
                notifRef.orderByChild("timestamp").once('value', (snapshot) => {
                    if(snapshot.exists()){
                        snapshot.forEach(function(childSnapshot){
                            childSnapshotData = childSnapshot.exportVal();
                            notifs.push({
                                user: snapshot.key,
                                type: childSnapshotData.type,
                                formId: childSnapshot.key,
                                message: childSnapshotData.message,
                                date: childSnapshotData.date,
                                seen: childSnapshotData.seen
                            })
                        })
                        notifs.reverse();
                        res.status(200).send(notifs);
                        //resolve(notifs);
                    } else {
                        //resolve(notifs);
                        res.status(200).send(notifs);
                    }
                })
            }
        //}, 10000);
    //});
    //return promise;
}

// This function is used to update the notification if the user has seen it or not
exports.updateNotifications = function(req, res){
    var { userID, formIds } = req.body;
    var database = firebase.database();

    if(formIds.length != 0){
        for(var i = 0; i < formIds.length; i++){
            database.ref("notifications/"+userID+"/"+formIds[i]+"/seen").set(true);
        }
    }

    res.status(200).send();
}

exports.lowStockMedicineInventory = function(req, res){
    var medicineName = req.body.lowStock;
    var today = req.body.date;
    var userKey = req.body.userKey;
    var time = Math.round(+new Date()/1000);
    var database = firebase.database();
    var cliniciansRef = database.ref("clinicUsers");
    var userRef = database.ref("clinicUsers/"+userKey);
    var i;
    
    userRef.once("value", (userSnapshot) => { 
        if(userSnapshot.child("role").val() == "Nurse"){
            cliniciansRef.once('value', (snapshot) => {
                snapshot.forEach(function(childSnapshot){
                    for (i = 0; i < medicineName.length; i++){
                        var medicineNotification = database.ref("notifications/"+childSnapshot.key);
                        var notif = {
                            type: "inventory",
                            message: medicineName[i] + " is low on stock!",
                            date: today,
                            timestamp: time,
                            seen: false
                        }
                        medicineNotification.push(notif);
                    }
                    
                    res.status(200).send();
                })
            })
        }
    })
}