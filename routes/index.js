const router = require('express').Router();
const userController = require('../Controller/userController');
const studentController = require('../Controller/studentController');
const inventoryController = require('../Controller/inventoryController');
const notificationController = require('../Controller/notificationController');
const { loggedIn } = require('../Controller/userController');
var expressHbs =  require('handlebars');

//app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs'}).engine)
//app.set('view engine', '.hbs');

//var hbs = expressHbs.create({});

// register new function
expressHbs.registerHelper('ifEquals', function(arg1, options) {
  if(arg1 === false) {
    return options.fn(this);
  }
  return options.inverse(this);
});

router.get('/', (req, res) => {
  res.redirect('/login');
});

// Get login page
router.get('/login', (req, res) => {
  console.log("Read login successful!");
  res.render('login');
});

//router.get('/getNotification', notificationController.js.getNotifications);

// Get dashboard page
router.get('/dashboard',  (req, res) => {
  console.log("Read dashboard successful!");
  var prom1,prom2,user,notifs;

  var prom1 =  userController.getUser();
  //studentController.getNotifications(user.key, notifs => {
  
  prom1.then(function(result){
    user = result;
  })
  prom2 = notificationController.getNotifications();
  prom2.then(function(result){
    notifs = result;
  });

  Promise.all([prom1,prom2]).then(result => {
    var i, count = 0, newNotifs;
    
    for(i = 0; i < notifs.length; i++){
      if(notifs[i].seen == false){
        count++; 
      }
    }

    if(count != 0){
      newNotifs = true;
    } else {
      newNotifs = false;
    }

    if(user.role == "Nurse"){
      // dashboard for nurse to be fixed
      res.render('dashboard', {
        isNurse: true,
        user: user,
      });
    }
    else {
      res.render('dashboard', { // nagsesend ng another response
        user: user,
        notification: notifs,
        count: count,
        newNotifs: newNotifs
      })
    }
  }).catch(error => {
    console.log(error.message);
    console.log('Error in dashboard');
  });
});

// Get clinic visit page
router.get('/clinic-visit', (req, res) => { // dont foget to put loggedIn
  console.log("Read clinic visit successful!");
  var promise1, promise2, promise3;
  var user, formId, record;

  promise1 = userController.getUser();
  // promise1.then(function(result){
    
  // });

  promise2= studentController.getClinicVisits();
  // promise2.then(function(result){
  //   record = result;
  // });

  Promise.all([promise1, promise2]).then(result => {
    user = result[0];
    record = result[1];
    //formId = result[2];
    promise3 = studentController.getAssignedForms(user.key);
    promise3.then(function(forms){
      formId = forms;
      console.log("forms in index");
      console.log(formId);
      // console.log("forms in index");
      // console.log(formId);
      
      if(user.role == "Nurse"){
        res.render('clinic-visit', {
          isNurse: true,
          user: user,
          forms: formId,
          clinicVisits: record,
        });
      }
      else {
        res.render('clinic-visit', {  // add controller to get all forms assigned to clinician
          isNurse: false,
          user: user,
          forms: formId,
        });
      }
    })
  }).catch(error => {
    console.log('Error in clinic visit!');
    console.log(error.message);
  });
});

// Get clinic visit page
router.get('/clinic-visit/create', (req, res) => {
  console.log("Read create clinic visit successful!");

  var prom1,prom2,prom3,prom4,user,nurse,clinician,users;

  prom1 =userController.getUser();
  prom1.then(function(result){
    console.log("Promise1 in clinic visit create: " + result.key);
    user=result;
    prom4= userController.assignTo(result.key);
    prom4.then(function(result){
      users=result;
      console.log("Promise4 in clinic visit create :"+ result);
    })

  });
  prom2= userController.getNurse();
  prom2.then(function(result){
    nurse=result;
    console.log("Promise2 in clinic visit create: " + result);
  });  
  prom3= userController.getClinician();
  prom3.then(function(result){
    clinician=result;
    console.log("Promise3 in clinic visit create:" + result);
  })
  
  Promise.all([prom1,prom2,prom3,prom4]).then(result => {
    if(user.role == "Nurse"){
      res.render('clinic-visit-create', {
        user: user,
        isNurse: true,
        nurse: nurse,
        clinician: clinician,
        users: users
      });
    } else {
      res.render('clinic-visit-create', {
        user: user, 
        isNurse: false,
        nurse: nurse,
        clinician: clinician,
        users: users
      });
    }
  }).catch(error => {
    console.log('An Error Occured');
  });
  
  // userController.getUser(req, user => {
  //   userController.getNurse(req, nurse => {
  //     userController.getClinician(req, clinician => {
  //       userController.assignTo(user.key, users => {
  //         if(user.role == "Nurse"){
  //           res.render('clinic-visit-create', {
  //             user: user,
  //             isNurse: true,
  //             nurse: nurse,
  //             clinician: clinician,
  //             users: users
  //           });
  //         } else {
  //           res.render('clinic-visit-create', {
  //             user: user, 
  //             isNurse: false,
  //             nurse: nurse,
  //             clinician: clinician,
  //             users: users
  //           });
  //         }
  //       })
  //     })
  //   })
  // })
});

// Get clinic visit edit page
router.get('/clinic-visit/edit/:id', (req, res) => {
  console.log("Read create clinic visit edit successful!");
  var prom1,prom2,prom3,prom4,prom5,user,nurse,clinician,users,form;

  prom1 =userController.getUser();
  prom1.then(function(result){
    console.log("Promise1 in clinic visit create: " + result.key);
    user=result;
  });
  // prom2= userController.getNurse();
  // prom2.then(function(result){
  //   nurse=result;
  //   console.log("Promise2 in clinic visit create: " + result);
  // });  
  // prom3= userController.getClinician();
  // prom3.then(function(result){
  //   clinician=result;
  //   console.log("Promise3 in clinic visit create:" + result);
  // })
  // prom4= userController.assignTo(result.key);
  // prom4.then(function(result){
  //   users=result;
  //   console.log("Promise4 in clinic visit create :"+ result);
  // })
  prom5=studentController.getClinicVisitForm()
  prom5.then(function(result){
    form=result
    console.log("Promise4 in clinic visit create :"+ result);
  })

  Promise.all([prom1,prom2,prom3,prom4,prom5]).then(result => {
    if(user.role == "Nurse"){
      res.render('clinic-visit-edit', {
        user: user,
        isNurse: true,
        form: form
      });
    } else {
      res.render('clinic-visit-edit', {
        user: user, 
        isNurse: false,
        form: form
      });
    }
  }).catch(error => {
    console.log('An Error Occured');
  });
 

  // userController.getUser(req, user => {
  // //   userController.getNurse(req, nurse => {
  // //     userController.getClinician(req, clinician => {
  // //       userController.getUsers(req, users => {
  //   studentController.getClinicVisitForm(req, form => {
  //           if(user.role == "Nurse"){
  //             res.render('clinic-visit-edit', {
  //               user: user,
  //               isNurse: true,
  //               form: form
  //             });
  //           } else {
  //             res.render('clinic-visit-edit', {
  //               user: user, 
  //               isNurse: false,
  //               form: form
  //             });
  //           }
  //   })
          
  // //      })
  // //     })
  // //   })
  // })
});

// Get case-records page
router.get('/case-records', (req, res) => {
  console.log("Read case records successful!");

  var users =  userController.getUsers();
  users.then(function(result){
    res.render('case-records', {
      users: users
    });
  })

  // userController.getUsers(req, usersInfo => {
  //   res.render('case-records', {
  //     users: usersInfo
  //   });
  // })
});

// Get disease surveillance page
router.get('/disease-surveillance', (req, res) => {
  console.log("Read disease surveillance successful!");
  var prom1,prom2,user,topDiagnosis;
  prom1 =  userController.getUsers();
  prom1.then(function(result){
      user = result
  })
  
  prom2 = studentController.getTopDiseaseWeek();
  prom2.then(function(result){
    topDiagnosis=result;
  })

  Promise.all([prom1,prom2]).then(result => {
    console.log("HI"+topDiagnosis[0]);
    if(user.role == "Nurse"){
      res.render('disease-surveillance', {
        user: user,
        topDiagnosisWeek: topDiagnosis[0],
        topDiagnosisMonth: topDiagnosis[1]
      });
    } else {
      res.render('disease-surveillance', {
        user: user,
        topDiagnosisWeek: topDiagnosis[0],
        topDiagnosisMonth: topDiagnosis[1]
      });
    }
  }).catch(error => {
    console.log('An Error Occured');
  });

  // userController.getUsers(req, usersInfo => {
  //   res.render('disease-surveillance', {
  //     users: usersInfo
  //   });
  // })
});

// Get profile page
router.get('/profile', (req, res) => {
  console.log("Read profile successful!");
  res.render('profile');
});

// Get health assessment page
router.get('/health-assessment', (req, res) => { // dont foget to put loggedIn
  console.log("Read health assessment successful!");
  var prom1,prom2,prom3,prom4,user,records,sections,schedule;

  prom1 =userController.getUser();
  prom1.then(function(result){
    console.log("Promise1 in health assessment: " + result.key);
    user=result;
  });

  prom2= studentController.getClinicVisits();
  prom2.then(function(result){
    console.log("Promise2 in health assessment: " + result);
    records=result;
  }); 

  prom3= studentController.getSections();
  prom3.then(function(result){
    console.log("Promise3 in health assessment:" + result);
    sections=result;
  })
  prom4= studentController.getAllApeSched();
  console.log("Promise 4");
  console.log(prom4);
  prom4.then(function(result){
    console.log("Promise4 in health assessment:" + result);
    schedule=result;
  })

  Promise.all([prom1,prom2,prom3,prom4]).then(result => {
    if(user.role == "Nurse"){
      res.render('health-assessment', {
        user: user,
        isNurse: true,
        clinicVisits: records,
        sections: sections,
        schedule: schedule
      });
    } else {
      res.render('health-assessment', {
        user: user, 
        isNurse: false,
        clinicVisits: records,
        sections: sections,
        schedule: schedule
      });
    }
  }).catch(error => {
    console.log('An Error Occured');
  });

  // userController.getUser(req, user => {
  //     studentController.getClinicVisits(req, records => {
  //       studentController.getSections(req, sections => {
  //         console.log("clinicVisits index", records);
  //         console.log("sections:", sections);
  //         userController.getUser(req, user => {
  //         if(user.role == "Nurse"){
  //           res.render('health-assessment', {
  //             user: user,
  //             isNurse: true,
  //             clinicVisits: records,
  //             sections: sections
  //           });
  //         } else {
  //           res.render('health-assessment', {
  //             user: user, 
  //             isNurse: false,
  //             clinicVisits: records,
  //             sections: sections
  //           });
  //         }
  //       })
  //     })
  //   })
  // });
});

// Get physical exam page
router.get('/health-assessment/physical', (req, res) => {
  console.log("Read physical exam successful!");
  
  var user =  userController.getUser();
  user.then(function(result){
    res.render('health-assessment-physical', {
      user: result
    });
  })
  
  
  // userController.getUsers(req, usersInfo => {
  //   res.render('health-assessment-physical', {
  //     users: usersInfo
  //   });
  // })
});

// Get health assessment schedule page
router.get('/health-assessment/schedule', (req, res) => {
  console.log("Read health assessment schedule successful!");
  var user =  userController.getUser();
  user.then(function(result){
    res.render('health-assessment-schedule', { 
      user: result
    })
  });
  
  // userController.getUsers(req, usersInfo => {
  //   res.render('health-assessment-schedule', {
  //     users: usersInfo
  //   });
  // })
});

// Get communications page
router.get('/communications', (req, res) => {
  console.log("Read communications successful!");
  var users =  userController.getUsers();
  users.then(function(result){
    res.render('communications', {
      users: users
    });
  })
  
  // userController.getUsers(req, usersInfo => {
  //   res.render('communications', {
  //     users: usersInfo
  //   });
  // })
});

// Get promotive care page
router.get('/promotive-care', (req, res) => {
  console.log("Read promotive care successful!");
  var users =  userController.getUsers();
  users.then(function(result){
    res.render('promotive-care', {
      users: users
    });
  })
  
  // userController.getUsers(req, usersInfo => {
  //   res.render('promotive-care', {
  //     users: usersInfo
  //   });
  // })
});

// Get program form page
router.get('/promotive-care/program-form', (req, res) => {
  console.log("Read program form successful!");
  var users =  userController.getUsers();
  users.then(function(result){
    res.render('program-form', {
      users: users
    });
  })
  
  // userController.getUsers(req, usersInfo => {
  //   res.render('program-form', {
  //     users: usersInfo
  //   });
  // })
});

// Get inventory page
router.get('/inventory', (req, res) => {
  console.log("Read inventory successful!");

  var prom1,prom2,user,inventory;

  prom1 =userController.getUser();
  prom1.then(function(result){
    console.log("Promise1 in inventory: " + result.key);
    user=result;
  });

  prom2= inventoryController.getInventory();
  prom2.then(function(result){
    console.log("Promise2 in inventory: " + result);
    inventory=result;
  }); 

  Promise.all([prom1,prom2]).then(result => {
    res.render('inventory', {
      user: user,
      inventory: inventory
    });
  }).catch(error => {
    console.log('An Error Occured');
  });


  // userController.getUser(req, user => {
  //   inventoryController.getInventory(req, inventory => {
  //     res.render('inventory', {
  //       user: user,
  //       inventory: inventory
  //     });
  //   })
  // })
});

// Get promotive care page
router.get('/inventory/add', (req, res) => {
  console.log("Read add inventory successful!");
  var userInfo =  userController.getUser();
  userInfo.then(function(result){
    res.render('inventory-add', {
      user: result
    });
  });
  // userController.getUser(req, user => {
  //   res.render('inventory-add', {
  //     user: user
  //   });
  // })
});

// Get bmi info
router.post('/getBMI', studentController.getBMI);

// Get profile page
router.get('/profile', (req, res) => {
  console.log("Read profile successful!");
  res.render('profile');
});

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/getStudentRecord', studentController.getStudent);
router.post('/addClinicVisit', studentController.addClinicVisit);
router.post('/editClinicVisit', studentController.editClinicVisit);
router.post('/addAPE', studentController.addAPE); 
router.post('/getSectionStudents',studentController.getSectionStudents);
router.post('/getPercentageChart', studentController.getAPEPercentage);
router.post('/updateNotif', notificationController.updateNotifications);
router.post('/addSchedule', studentController.addSchedule);
// router.post('/getSchedules', studentController.getAllApeSched);
router.post('/addInventory', inventoryController.addInventory);
router.post('/getBmiStatus', studentController.getBmiStatus);
router.post('/loadPrevData', studentController.loadPrevData);

module.exports = router;