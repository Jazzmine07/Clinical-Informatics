const firebase = require('../firebase');

exports.getNotifications = function(){
    var database = firebase.database();
    var childSnapshotData;
    var notifs = [];

    var promise= new Promise((resolve,reject)=>{
        setTimeout(function(){
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    var uid = user.uid;
                    var notifRef = database.ref("notifications/"+uid);
                            
                    notifRef.orderByChild("timestamp").on('value', (snapshot) => {
                        if(snapshot.exists()){
                            snapshot.forEach(function(childSnapshot){
                                childSnapshotData = childSnapshot.exportVal();
                                    notifs.push({
                                    user: snapshot.key,
                                    type: childSnapshotData.type,
                                    formId: childSnapshotData.formId,
                                    message: childSnapshotData.message,
                                    date: childSnapshotData.date,
                                    seen: childSnapshotData.seen
                                })
                            })
                            notifs.reverse();
                            resolve (notifs);
                        } else {
                            resolve (notifs);
                        }
                    })
                }
            });
        }, 5000);
    });
    return promise;
    
}

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