const router = require('express').Router();
const userController = require('../Controller/userController');
const studentInfoController = require('../Controller/studentInfoController');
const visitController = require('../Controller/visitController');
const studentController = require('../Controller/studentController');
const inventoryController = require('../Controller/inventoryController');
const notificationController = require('../Controller/notificationController');
const surveillanceController = require('../Controller/surveillanceController');
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
router.get('/dashboard', (req, res) => {
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
  promise2 = visitController.getClinicVisits();

  Promise.all([promise1, promise2]).then( result => {
    user = result[0];
    record = result[1];
    promise3 = visitController.getAssignedForms(user.key);
    promise3.then(function(forms){
      formId = forms;
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
  var prom1, prom2, prom3, prom4;
  var user, nurse, clinician, users;

  prom1 = userController.getUser();
  prom1.then(function(result){
    prom4 = userController.assignTo(result.key);
    prom4.then(function(result){
      users = result;
    })
  });
  prom2 = userController.getNurse(); 
  prom3 = userController.getClinician();
  
  Promise.all([prom1, prom2, prom3, prom4]).then(result => {
    user = result[0];
    nurse = result[1];
    clinician = result[2];

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
    console.log('Error in clinic visit create');
    console.log(error.message);
  });
});

// Get clinic visit edit page
router.get('/clinic-visit/edit/:id', (req, res) => {
  console.log("Read clinic visit edit successful!");
  var prom1, prom2, prom3, prom4, prom5;
  var user, nurse, clinician, users, form;

  prom1 = userController.getUser();
  prom2 = userController.getNurse();
  prom3 = userController.getClinician();
  // prom3.then(function(result){
  //   clinician=result;
  //   console.log("Promise3 in clinic visit create:" + result);
  // })
  // prom4= userController.assignTo(result.key);
  // prom4.then(function(result){
  //   users=result;
  //   console.log("Promise4 in clinic visit create :"+ result);
  // })
  prom5 = visitController.getClinicVisitForm(req);

  Promise.all([prom1, prom2, prom3, prom5]).then(result => {
    user = result[0];
    nurse = result[1];
    clinician = result[2];
    form = result[3];

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
  var prom1,prom2,prom3,user,topDiagnosis;
  prom1 =  userController.getUser();
  prom1.then(function(result){
      user = result;
  });
  prom2= surveillanceController.getDiseaseSurveillanceData();
  prom2.then(function(result){
    prom3 = surveillanceController.getTopDisease(result);
    prom3.then(function(result){
      topDiagnosis=result;
    });
  });
  

  Promise.all([prom1,prom2,prom3]).then(result => {
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

  prom2= visitController.getClinicVisits();
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
  //     visitController.getClinicVisits(req, records => {
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

// Get medicine inventory page
router.get('/inventory-medicine', (req, res) => {
  console.log("Read medicine inventory successful!");
  var prom1, prom2, user, inventory;
  prom1 = userController.getUser();
  prom2 = inventoryController.getMedicineInventory();

  Promise.all([prom1, prom2]).then(result => {
    user = result[0];
    inventory = result[1];
    if(user.role == "Nurse"){
      res.render('inventory-medicine', {
        user: user,
        isNurse: true,
        inventory: inventory
      });
    } else {
      res.render('inventory-medicine', {
        user: user, 
        isNurse: false,
      });
    }
  }).catch(error => {
    console.log('Error in medicine inventory');
    console.log(error.messgae);
  });
});

// Get add medicine inventory page
router.get('/inventory-medicine/add', (req, res) => {
  console.log("Read add medicine successful!");
  var prom1, prom2, user, medicines;
  prom1 =  userController.getUser();
  prom2 = inventoryController.getMedicines();
  Promise.all([prom1, prom2]).then(result => {
    user = result[0];
    medicines = result[1];
    
    if(user.role == "Nurse"){
      res.render('inventory-medicine-add', {
        user: user,
        isNurse: true,
        medicines: medicines
      });
    } else {
      res.render('inventory-medicine-add', {
        user: user, 
        isNurse: false,
      });
    }
  })   
});

// Get supply inventory page
router.get('/inventory-supply', (req, res) => {
  console.log("Read supply inventory successful!");
  var prom1, prom2, user, supply;
  prom1 = userController.getUser();
  prom2= inventoryController.getSupplyInventory();
 
  Promise.all([prom1,prom2]).then(result => {
    user = result[0];
    supply = result[1];
    if(user.role == "Nurse"){
      res.render('inventory-supply', {
        user: user,
        isNurse: true,
        inventory: supply
      });
    } else {
      res.render('inventory-supply', {
        user: user, 
        isNurse: false,
      });
    }
  }).catch(error => {
    console.log('Error in supply inventory');
    console.log(error.message);
  });
});

// Get add supply inventory page
router.get('/inventory-supply/add', (req, res) => {
  console.log("Read add supply successful!");
  var prom1, prom2, user, supplies;
  prom1 =  userController.getUser();
  prom2 = inventoryController.getSupplies();
  Promise.all([prom1, prom2]).then(result => {
    user = result[0];
    supplies = result[1];
    
    if(user.role == "Nurse"){
      res.render('inventory-supply-add', {
        user: user,
        isNurse: true,
        supply: supplies
      });
    } else {
      res.render('inventory-supply-add', {
        user: user, 
        isNurse: false,
      });
    }
  })   
});

// Get dental inventory page
router.get('/inventory-dental', (req, res) => {
  console.log("Read dental successful!");
  var prom1, prom2, user, dental;

  prom1 = userController.getUser();
  prom2 = inventoryController.getDentalInventory();

  Promise.all([prom1,prom2]).then(result => {
    user = result[0];
    dental = result[1];
    if(user.role == "Nurse"){
      res.render('inventory-dental', {
        user: user,
        isNurse: true,
        dental: dental
      });
    } else {
      res.render('inventory-dental', {
        user: user, 
        isNurse: false,
      });
    }
  }).catch(error => {
    console.log('Error in dental inventory');
    console.log(error.message);
  });
});

// Get add supply inventory page
router.get('/inventory-dental/add', (req, res) => {
  console.log("Read add dental successful!");
  var prom1, prom2, user, dental;
  prom1 =  userController.getUser();
  prom2 = inventoryController.getDentals();
  Promise.all([prom1, prom2]).then(result => {
    user = result[0];
    dental = result[1];
    
    if(user.role == "Nurse"){
      res.render('inventory-dental-add', {
        user: user,
        isNurse: true,
        supply: dental
      });
    } else {
      res.render('inventory-dental-add', {
        user: user, 
        isNurse: false,
      });
    }
  })   
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
router.post('/getStudentRecord', studentInfoController.getStudentInfo);
router.post('/getLastVisit', visitController.getLastVisit);
router.post('/addClinicVisit', visitController.addClinicVisit);
router.post('/editClinicVisit', visitController.editClinicVisit);
router.post('/addAPE', studentController.addAPE); 
router.post('/getSectionStudents',studentController.getSectionStudents);
router.post('/getPercentageChart', studentController.getAPEPercentage);
router.post('/updateNotif', notificationController.updateNotifications);
router.post('/addSchedule', studentController.addSchedule);
// router.post('/getSchedules', studentController.getAllApeSched);
router.post('/addMedicineInventory', inventoryController.addMedicineInventory);
router.post('/updateMedicineInventory', inventoryController.updateMedicineInventory);
router.post('/addSupplyInventory', inventoryController.addSupplyInventory);
router.post('/updateSupplyInventory', inventoryController.updateSupplyInventory);
router.post('/addDentalInventory', inventoryController.addDentalInventory);
router.post('/updateDentalInventory', inventoryController.updateDentalInventory);
router.post('/getBmiStatus', studentController.getBmiStatus);
router.post('/loadPrevData', studentController.loadPrevData);
router.post('/getDiseaseDemographics', surveillanceController.getDiseaseDemographics);

module.exports = router;