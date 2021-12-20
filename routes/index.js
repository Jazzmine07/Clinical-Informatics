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

expressHbs.registerHelper('concat', function(num) {
    return "Grade " + num;
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
  // prom2 = notificationController.getNotifications();
  // prom2.then(function(result){
  //   notifs = result;
  // });

  Promise.all([prom1,prom2]).then(result => {
    var i, count = 0, newNotifs;
    
    // for(i = 0; i < notifs.length; i++){
    //   if(notifs[i].seen == false){
    //     count++; 
    //   }
    // }

    // if(count != 0){
    //   newNotifs = true;
    // } else {
    //   newNotifs = false;
    // }

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

// Get disease surveillance page
router.get('/disease-surveillance', (req, res) => {
  console.log("Read disease surveillance successful!");
  var prom1 ,prom2, prom3 ,user, topDiagnosis;

  prom1 =  userController.getUser();
  prom2= surveillanceController.getDiseaseSurveillanceData();
  
  Promise.all([prom1, prom2]).then(result => {
    prom3=surveillanceController.getTopDisease(result[1])
    user = result[0];
    if(user.role == "Nurse"){
      res.render('disease-surveillance', {
        user: user,
        topDiagnosisWeek: prom3[0],
        topDiagnosisMonth: prom3[1],
        
      });
    } else {
      res.render('disease-surveillance', {
        user: user,
        topDiagnosisWeek: prom3[0],
        topDiagnosisMonth: prom3[1],
        
      });
    }
  }).catch(error => {
    console.log('Error in disease surveillance');
    console.log(error.message);
  });
});

// Get clinic visit page
router.get('/clinic-visit', (req, res) => { // dont foget to put loggedIn
  console.log("Read clinic visit successful!");
  var promise1, promise2, promise3, promise4;
  var user, formId, record, dashboard;
  promise1 = userController.getUser();
  promise2 = visitController.getClinicVisits();
  promise4 = visitController.getDashboard();

  Promise.all([promise1, promise2, promise4]).then( result => {
    user = result[0];
    record = result[1];
    dashboard = result[2];
    promise3 = visitController.getAssignedForms(user.key);

    promise3.then(function(forms){
      formId = forms;
      if(user.role == "Nurse"){
        res.render('clinic-visit', {
          isNurse: true,
          user: user,
          forms: formId,
          clinicVisits: record,
          dashboard: dashboard
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

// Get clinic visit view page
router.get('/clinic-visit/view/:id', (req, res) => {
  console.log("Read clinic visit view successful!");
  var prom1, prom2;
  var user, form;

  prom1 = userController.getUser();
  prom2 = visitController.getClinicVisitForm(req);

  Promise.all([prom1, prom2]).then(result => {
    user = result[0];
    console.log("user in view");
    console.log(user);
    form = result[1];

    if(user.role == "Nurse"){
      res.render('clinic-visit-view', {
        user: user,
        isNurse: true,
        form: form,
      });
    } else{
      res.render('clinic-visit-view', {
        user: user,
        isNurse: false
      });
    }
  }).catch(error => {
    console.log('Error in loading clinic visit view form');
    console.log(error.message);
  });
});

// Get clinic visit page
router.get('/clinic-visit/create', (req, res) => {
  console.log("Read create clinic visit successful!");
  var prom1, prom2, prom3, prom4, prom5;
  var user, nurse, clinician, prescribed, medicines;

  prom1 = userController.getUser();
  prom1.then(function(result){
    prom4 = userController.getPrescribedBy(result.key);
    prom4.then(function(result){
      prescribed = result;
    })
  });
  prom2 = userController.getNurse(); 
  prom3 = userController.getClinician();
  prom5 = inventoryController.getMedicines();
  
  Promise.all([prom1, prom2, prom3, prom4, prom5]).then(result => {
    user = result[0];
    nurse = result[1];
    clinician = result[2];
    medicines = result[4];

    if(user.role == "Nurse"){
      res.render('clinic-visit-create', {
        user: user,
        isNurse: true,
        nurse: nurse,
        clinician: clinician,
        prescribed: prescribed,
        medicines: medicines
      });
    } else {
      res.render('clinic-visit-create', {
        user: user, 
        isNurse: false,
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
  var prom1, prom2, prom3, prom4;
  var user, nurse, medicines, form;

  prom1 = userController.getUser();
  prom2 = userController.getNurse();
  prom3 = inventoryController.getMedicines();
  prom4 = visitController.getClinicVisitForm(req);

  Promise.all([prom1, prom2, prom3, prom4]).then(result => {
    user = result[0];
    nurse = result[1];
    medicines = result[2];
    form = result[3];

    if(user.role == "Nurse"){
      res.render('clinic-visit-edit', {
        user: user,
        isNurse: true,
        form: form,
      });
    } else {
      res.render('clinic-visit-edit', {
        user: user, 
        isNurse: false,
        nurse: nurse,
        form: form,
        medicines: medicines
      });
    }
  }).catch(error => {
    console.log('Error in loading clinic visit edit form');
    console.log(error.message);
  });
});

// Get clinic medication page
router.get('/clinic-visit/medication', (req, res) => {
  console.log("Read medication clinic visit successful!");
  var prom1, prom2, prom3;
  var user, nurse, medicines;

  prom1 = userController.getUser();
  prom2 = userController.getNurse(); 
  prom3 = inventoryController.getMedicines();
  
  Promise.all([prom1, prom2, prom3]).then(result => {
    user = result[0];
    nurse = result[1];
    medicines = result[2];

    if(user.role == "Nurse"){
      res.render('clinic-visit-medication', {
        user: user,
        isNurse: true,
        nurse: nurse,
        medicines: medicines
      });
    } else {
      res.render('clinic-visit-medication', {
        user: user, 
        isNurse: false,
      });
    }
  }).catch(error => {
    console.log('Error in clinic visit medication');
    console.log(error.message);
  });
});

// Get clinic incidence page
router.get('/clinic-visit/incidence', (req, res) => {
  console.log("Read clinic visit incidence successful!");
  var user =  userController.getUser();
  user.then(function(result){
    res.render('clinic-visit-incidence', { 
      user: result
    })
  });
});

// Get profile page
router.get('/profile', (req, res) => {
  console.log("Read profile successful!");
  var promise1, promise2;
  var user;
  promise1 = userController.getUser();

  Promise.all([promise1]).then(result => {
    user = result[0];
    if(user.role == "Nurse"){
      res.render('profile', {
        isNurse: true,
        user: user,
      });
    }
    else {
      res.render('profile', {
        isNurse: false,
        user: user,
      });
    }
  }).catch(error => {
    console.log('Error in student profile!');
    console.log(error.message);
  });
});

// Get health assessment page
router.get('/health-assessment', (req, res) => { // dont foget to put loggedIn
  console.log("Read health assessment successful!");
  var prom1,prom2,prom3,prom4,user,records,sections,schedule;

  prom1 = userController.getUser();
  prom2 = studentController.getSections();
  prom3 = studentController.getAllApeSched();
  prom4 = studentController.getAllAdeSched();

  Promise.all([prom1, prom2, prom3,prom4]).then(result => {
    user = result[0];
    sections = result[1];
    apeSchedule = result[2];
    adeSchedule = result[3];
    var i,schedule=[];
    console.log("APE and ADE")
    for(i=0;i<apeSchedule.length;i++){
      console.log(apeSchedule[i]);
      console.log(adeSchedule[i]);
      schedule.push({
        grade:apeSchedule[i].grade,
        section:apeSchedule[i].section,
        totalNumStudents:apeSchedule[i].numStudents,
        apeDate:apeSchedule[i].apeDate,
        apeTime:apeSchedule[i].apeTime,
        apeSeen:apeSchedule[i].apeSeen,
        adeDate:adeSchedule[i].adeDate,
        adeTime:adeSchedule[i].adeTime,
        adeSeen:adeSchedule[i].adeSeen
      });
    }
    
    if(user.role == "Nurse"){
      res.render('health-assessment', {
        user: user,
        isNurse: true,
        sections: sections,
        schedule:schedule
      });
    } else {
      res.render('health-assessment', {
        user: user, 
        isNurse: false,
        sections: sections,
        schedule:schedule
      });
    }
  }).catch(error => {
    console.log('Error in health assessment');
    console.log(error.message);
  });
});

// Get physical exam page
router.get('/health-assessment/physical', (req, res) => {
  console.log("Read physical exam successful!");
  var prom1;
  var user;

  prom1 =  userController.getUser();
  Promise.all([prom1]).then(result => {
    user = result[0];
    if(user.role == "Nurse"){
      res.render('health-assessment-physical', {
        isNurse: true,
        user: user,
      });
    }
    else {
      res.render('health-assessment-physical', {
        isNurse: false,
        user: user,
      });
    }
  }).catch(error => {
    console.log('Error in health assessment physical!');
    console.log(error.message);
  });
});

// Get physical exam page
router.get('/health-assessment/dental', (req, res) => {
  console.log("Read dental exam successful!");
  var prom1;
  var user;

  prom1 =  userController.getUser();
  Promise.all([prom1]).then(result => {
    user = result[0];
    if(user.role == "Nurse"){
      res.render('health-assessment-dental', {
        isNurse: true,
        user: user,
      });
    }
    else {
      res.render('health-assessment-dental', {
        isNurse: false,
        user: user,
      });
    }
  }).catch(error => {
    console.log('Error in health assessment dental!');
    console.log(error.message);
  });
});

// Get health assessment schedule page
router.get('/health-assessment/schedule', (req, res) => {
  console.log("Read health assessment schedule successful!");
  prom1 =  userController.getUser();
  Promise.all([prom1]).then(result => {
    user = result[0];
    if(user.role == "Nurse"){
      res.render('health-assessment-schedule', {
        isNurse: true,
        user: user,
      });
    }
    else {
      res.render('health-assessment-schedule', {
        isNurse: false,
        user: user,
      });
    }
  }).catch(error => {
    console.log('Error in health assessment schedule!');
    console.log(error.message);
  });
});

// Get medicine inventory page
router.get('/inventory-medicine', (req, res) => {
  console.log("Read medicine inventory successful!");
  var prom1, prom2, prom3;
  var user, inventory, usedMedicine;
  prom1 = userController.getUser();
  prom2 = inventoryController.getMedicineInventory();
  prom3 = inventoryController.getUsedMedicine();

  Promise.all([prom1, prom2, prom3]).then(result => {
    user = result[0];
    inventory = result[1];
    usedMedicine = result[2];
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
        usedMedicine: usedMedicine
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

// Get promotive care page
router.get('/promotive-care', (req, res) => {
  console.log("Read promotive care successful!");
  var users =  userController.getUser();
  users.then(function(result){
    res.render('promotive-care', {
      users: users
    });
  })
});

// Get program form page
router.get('/promotive-care/program-form', (req, res) => {
  console.log("Read program form successful!");
  var users =  userController.getUser();
  users.then(function(result){
    res.render('program-form', {
      users: users
    });
  })
});

// Get performance assessment  page
router.get('/performance-assessment', (req, res) => {
  console.log("Read performance assessment successful!");
  var user =  userController.getUser();
  user.then(function(result){
    res.render('performance-assessment', { 
      user: result
    })
  });
});

// Get communications page
router.get('/communications', (req, res) => {
  console.log("Read communications successful!");
  var users =  userController.getUser();
  users.then(function(result){
    res.render('communications', {
      users: users
    });
  })
});

// Get bmi info
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.post('/updateNotif', notificationController.updateNotifications);
router.post('/getStudentRecord', studentInfoController.getStudentInfo);
router.post('/getBMI', studentInfoController.getBMI);
router.post('/getBmiStatus', studentController.getBmiStatus);

router.post('/getNotAllowedMedication', studentInfoController.getNotAllowedMedication);
router.post('/getVisits', studentInfoController.getStudentVisits);
router.post('/getLastVisit', visitController.getLastVisit);
router.post('/getIntakeHistory', studentInfoController.getStudentIntakeHistory);


router.post('/addClinicVisit', visitController.addClinicVisit);
router.post('/editClinicVisit', visitController.editClinicVisit);
router.post('/addMedicationIntake', visitController.addMedicationIntake);
router.post('/addAPE', studentController.addAPE); 
router.post('/getSectionStudents',studentController.getSectionStudents);
router.post('/getApePercentageChart', studentController.getAPEPercentage);
router.post('/getAdePercentageChart', studentController.getADEPercentage);

router.post('/addSchedule', studentController.addSchedule);
// router.post('/getSchedules', studentController.getAllApeSched);
router.post('/loadPrevData', studentController.loadPrevData);
router.post('/addWeightHeight',studentController.addWeightHeight);
router.post('/getDiseaseDemographics', surveillanceController.getDiseaseDemographics);
router.post('/getVisitReasonCountDashboard', surveillanceController.getVisitReasonCount);
router.post('/getVRGradeMonthlyCountDashboard', surveillanceController.getVRCountByGradeInMonth);

router.post('/addMedicineInventory', inventoryController.addMedicineInventory);
router.post('/updateMedicineInventory', inventoryController.updateMedicineInventory);
router.post('/getMedicineDetails', inventoryController.getMedicineDetails);
router.post('/addSupplyInventory', inventoryController.addSupplyInventory);
router.post('/updateSupplyInventory', inventoryController.updateSupplyInventory);
router.post('/addDentalInventory', inventoryController.addDentalInventory);
router.post('/updateDentalInventory', inventoryController.updateDentalInventory);

module.exports = router;