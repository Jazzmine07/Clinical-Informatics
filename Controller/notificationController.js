const firebase = require('../firebase');

exports.getNotifications = function(req, res){
    var database = firebase.database();
    var childSnapshotData;
    var notifs = [];

    //var promise= new Promise((resolve,reject)=>{
        //setTimeout(function(){
            firebase.auth().onAuthStateChanged((user) => {
                if(user) {
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
            });
        //}, 10000);
    //});
    //return promise;
}

exports.updateNotifications = function(req, res){
    var { userID, formIds } = req.body;
    console.log("user id in notif contoller");
    console.log(userID);
    console.log("formIds in notif contoller");
    console.log(formIds);
    var database = firebase.database();

    if(formIds.length != 0){
        // var seen = {
        //     seen: true
        // }
        for(var i = 0; i < formIds.length; i++){
            database.ref("notifications/"+userID+"/"+formIds[i]+"/seen").set(true);
        }
    }

    res.status(200).send();
}