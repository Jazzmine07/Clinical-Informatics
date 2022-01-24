const router = require('express').Router();
const userController = require('../Controller/userController');
const studentInfoController = require('../Controller/studentInfoController');
const visitController = require('../Controller/visitController');
const studentController = require('../Controller/studentController');
const inventoryController = require('../Controller/inventoryController');
const notificationController = require('../Controller/notificationController');
const programController = require('../Controller/programController');
const surveillanceController = require('../Controller/surveillanceController');
const reportsController = require('../Controller/reportsController');
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

expressHbs.registerHelper('ifSBFP', function(arg1, options) {
  if(arg1 === "School-Based Feeding Program (SBFP)") {
    return options.fn(this);
  }
  return options.inverse(this);
});

expressHbs.registerHelper('ifWINS', function(arg1, options) {
  if(arg1 === "Water, Sanitation, and Hygiene (WASH) in Schools (WinS)") {
    return options.fn(this);
  }
  return options.inverse(this);
});

expressHbs.registerHelper('ifPACP', function(arg1, options) {
  if(arg1 === "Pest and Animal Control Program (PACP)") {
    return options.fn(this);
  }
  return options.inverse(this);
});

expressHbs.registerHelper('ifERSF', function(arg1, options) {
  if(arg1 === "Evaluation and Repair of School Facilities") {
    return options.fn(this);
  }
  return options.inverse(this);
});

expressHbs.registerHelper('ifEFSQ', function(arg1, options) {
  if(arg1 === "Evaluation of Food Safety and Quality") {
    return options.fn(this);
  }
  return options.inverse(this);
});

expressHbs.registerHelper('ifSBP', function(arg1, options) {
  if(arg1 === "Education/Awareness/Skill-based Program") {
    return options.fn(this);
  }
  return options.inverse(this);
});

expressHbs.registerHelper('ifWMP', function(arg1, options) {
  if(arg1 === "Weight Management Program") {
    return options.fn(this);
  }
  return options.inverse(this);
});

expressHbs.registerHelper('concat', function(num) {
    return "Grade " + num;
});

expressHbs.registerHelper("ifChecked", function(isTrue){
  return isTrue == "true" ? 'checked': '';
})

expressHbs.registerHelper("formatDate", function(string){
  if(string == ""){
    return "-";
  } else {
    let date = new Date(string);
    var month = date.toLocaleString('default', { month: 'short' });
    return (month + '. ' + date.getDate() + ', ' + date.getFullYear());
  }
})

expressHbs.registerHelper("formatLongDate", function(string){
  if(string == ""){
    return "-";
  } else {
    let date = new Date(string)
    var month = date.toLocaleString('default', { month: 'long' })
    return (month + ' ' + date.getDate() + ', ' + date.getFullYear());
  }
})

// formattingDate: function(string){
//   let date = new Date(string)
//   return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
// },

router.get('/', (req, res) => {
  res.redirect('/login');
});

// Get login page
router.get('/login', (req, res) => {
  console.log("Read login successful!");
    res.render('login');
});

router.get('/getNotification', loggedIn, notificationController.getNotifications);
// Get dashboard page
router.get('/dashboard', loggedIn, (req, res) => {
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
      res.render('clinic-visit', {
        isNurse: true,
        user: user,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
    else {
      res.render('dashboard', { // nagsesend ng another response
        isNurse: false,
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
router.get('/disease-surveillance', loggedIn, (req, res) => {
  console.log("Read disease surveillance successful!");
  var prom1 ,prom2, prom3 ,user, topDiagnosis;

  prom1 =  userController.getUser();
  prom2= surveillanceController.getDiseaseSurveillanceData();
  
  Promise.all([prom1, prom2]).then(result => {
    console.log("PROMISES ARE FULFILLED");
    prom3=surveillanceController.getTopDisease(result[1])
    user = result[0];
    
    prom3[0].sort((a, b) => b.count - a.count);
    prom3[1].sort((a, b) => b.count - a.count);

    if(user.role == "Nurse"){
      res.render('clinic-visit', {
        isNurse: true,
        user: user,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    } else {
      res.render('disease-surveillance', {
        isNurse: false,
        user: user,
        topDiagnosisWeek: prom3[0],
        topDiagnosisMonth: prom3[1],
        topDWeekOne:prom3[0][0],
        topDWeekTwo:prom3[0][1],
        topDWeekThree:prom3[0][2],
        topDWeekFour:prom3[0][3],
        topDWeekFive:prom3[0][4],
        topDMonthOne:prom3[1][0],
        topDMonthTwo:prom3[1][1],
        topDMonthThree:prom3[1][2],
        topDMonthFour:prom3[1][3],
        topDMonthFive:prom3[1][4],
      });
    }
  }).catch(error => {
    console.log('Error in disease surveillance');
    console.log(error.message);
  });
});

// Get clinic visit page
router.get('/clinic-visit', loggedIn, (req, res) => { // dont foget to put loggedIn
  console.log("Read clinic visit successful!");
  var promise1, promise2, promise3, promise4, promise5;
  var user, formId, record, dashboard, reports;

  promise1 = userController.getUser();
  promise2 = visitController.getClinicVisits();
  promise4 = visitController.getDashboard();
  promise5 = visitController.getIncidenceList();

  Promise.all([promise1, promise2, promise4, promise5]).then( result => {
    user = result[0];
    record = result[1];
    dashboard = result[2];
    reports = result[3];
    promise3 = visitController.getAssignedForms(user.key);

    promise3.then(function(forms){
      formId = forms;
      if(user.role == "Nurse"){
        res.render('clinic-visit', {
          isNurse: true,
          user: user,
          dashboard: dashboard,
          forms: formId,
          clinicVisits: record,
        });
      }
      else {
        res.render('clinic-visit', {  // add controller to get all forms assigned to clinician
          isNurse: false,
          user: user,
          reports: reports,
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
router.get('/clinic-visit/view/:id', loggedIn, (req, res) => {
  console.log("Read clinic visit view successful!");
  var prom1, prom2;
  var user, form;

  prom1 = userController.getUser();
  prom2 = visitController.viewClinicVisitForm(req);

  Promise.all([prom1, prom2]).then(result => {
    user = result[0];
    form = result[1];
    console.log("form in index");
    console.log(form);

    if(user.role == "Nurse"){
      res.render('clinic-visit-view', {
        user: user,
        isNurse: true,
        form: form,
      });
    } else{
      res.render('dashboard', {
        user: user,
        isNurse: false,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
  }).catch(error => {
    console.log('Error in loading clinic visit view form');
    console.log(error.message);
  });
});

// Get clinic visit view page
router.get('/clinic-visit/view/report/:id', loggedIn, (req, res) => {
  console.log("Read clinic visit view incident report successful!");
  var prom1, prom2;
  var user, report;

  prom1 = userController.getUser();
  prom2 = visitController.viewIncidenceReport(req);

  Promise.all([prom1, prom2]).then(result => {
    user = result[0];
    report = result[1];

    if(user.role == "Nurse"){
      res.render('clinic-visit', {
        user: user,
        isNurse: true,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    } else{
      res.render('clinic-visit-view-report', {
        user: user,
        isNurse: false,
        report: report
      });
    }
  }).catch(error => {
    console.log('Error in loading clinic visit view report');
    console.log(error.message);
  });
});

// Get clinic visit page
router.get('/clinic-visit/create', loggedIn, (req, res) => {
  console.log("Read create clinic visit successful!");
  var prom1, prom2, prom3, prom4, prom5, prom6;
  var user, nurse, clinician, prescribed, medicines, complaints;

  prom1 = userController.getUser();
  prom1.then(function(result){
    prom4 = userController.getPrescribedBy(result.key);
    prom4.then(function(result){
      prescribed = result;
    })
  });
  prom2 = userController.getNurse(); 
  prom3 = userController.getClinician();
  prom5 = inventoryController.getSpecificMedicines();
  prom6 = visitController.getComplaints();
  
  Promise.all([prom1, prom2, prom3, prom4, prom5, prom6]).then(result => {
    user = result[0];
    nurse = result[1];
    clinician = result[2];
    medicines = result[4];
    complaints = result[5];

    if(user.role == "Nurse"){
      res.render('clinic-visit-create', {
        user: user,
        isNurse: true,
        nurse: nurse,
        clinician: clinician,
        prescribed: prescribed,
        medicines: medicines,
        complaints: complaints
      });
    } else {
      res.render('dashboard', {
        user: user, 
        isNurse: false,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
  }).catch(error => {
    console.log('Error in clinic visit create');
    console.log(error.message);
  });
});

// Get clinic visit edit page
router.get('/clinic-visit/edit/:id', loggedIn, (req, res) => {
  console.log("Read clinic visit edit successful!");
  var prom1, prom2, prom3, prom4, prom5;
  var user, nurse, medicines, form, diagnosis;

  prom1 = userController.getUser();
  prom2 = userController.getNurse();
  prom3 = inventoryController.getSpecificMedicines();
  prom4 = visitController.getClinicVisitForm(req);
  prom5 = visitController.getDiagnosis();

  Promise.all([prom1, prom2, prom3, prom4, prom5]).then(result => {
    user = result[0];
    nurse = result[1];
    medicines = result[2];
    form = result[3];
    diagnosis = result[4]

    if(user.role == "Nurse"){
      res.render('clinic-visit-edit', {
        user: user,
        isNurse: true,
        form: form,
        medicines: medicines
      });
    } else {
      res.render('clinic-visit-edit', {
        user: user, 
        isNurse: false,
        nurse: nurse,
        form: form,
        medicines: medicines,
        diagnosis: diagnosis
      });
    }
  }).catch(error => {
    console.log('Error in loading clinic visit edit form');
    console.log(error.message);
  });
});

// Get clinic medication page
router.get('/clinic-visit/medication', loggedIn, (req, res) => {
  console.log("Read medication clinic visit successful!");
  var prom1, prom2, prom3;
  var user, nurse, medicines;

  prom1 = userController.getUser();
  prom2 = userController.getNurse(); 
  prom3 = inventoryController.getSpecificMedicines();
  
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
      res.render('dashboard', {
        user: user, 
        isNurse: false,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
  }).catch(error => {
    console.log('Error in clinic visit medication');
    console.log(error.message);
  });
});

// Get clinic incidence page
router.get('/clinic-visit/incidence', loggedIn, (req, res) => {
  console.log("Read clinic visit incidence successful!");
  var prom1;
  var user;

  prom1 = userController.getUser();
  
  Promise.all([prom1]).then(result => {
    user = result[0];

    if(user.role == "Nurse"){
      res.render('clinic-visit-incidence', {
        user: user,
        isNurse: true
      });
    } else {
      res.render('dashboard', {
        user: user, 
        isNurse: false,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
  }).catch(error => {
    console.log('Error in clinic visit medication');
    console.log(error.message);
  });
});

// Get clinic incidence page
router.get('/clinic-visit/referral', (req, res) => {
  console.log("Read clinic visit referral successful!");
  var prom1;
  var user;

  prom1 = userController.getUser();
  
  Promise.all([prom1]).then(result => {
    user = result[0];

    if(user.role == "Nurse"){
      res.render('clinic-visit-referral', {
        user: user,
        isNurse: true
      });
    } else {
      res.render('dashboard', {
        user: user, 
        isNurse: false,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
  }).catch(error => {
    console.log('Error in clinic visit medication');
    console.log(error.message);
  });
});

// Get profile page
router.get('/profile', loggedIn, (req, res) => {
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
router.get('/health-assessment', loggedIn, (req, res) => { // dont foget to put loggedIn
  console.log("Read health assessment successful!");
  var prom1,prom2,prom3,prom4,user,records,sections,schedule;
  prom1 = userController.getUser();
  prom2 = studentController.getSections();
  prom3 = studentController.getAllSched();
  
  Promise.all([prom1, prom2, prom3]).then(result => {
    user = result[0];
    sections = result[1];
    scheduleData = result[2];
    
    var i,schedule=[];
    for(i=0;i<scheduleData.length;i++){
      console.log(scheduleData[i]);
      schedule.push({
        grade:scheduleData[i].grade,
        section:scheduleData[i].section,
        totalNumStudents:scheduleData[i].numStudents,
        apeDate:scheduleData[i].apeDate,
        apeTime:scheduleData[i].apeTime,
        apeSeen:scheduleData[i].apeSeen,
        adeDate:scheduleData[i].adeDate,
        adeTime:scheduleData[i].adeTime,
        adeSeen:scheduleData[i].adeSeen
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
router.get('/health-assessment/physical', loggedIn, (req, res) => {
  console.log("Read physical exam successful!");
  var prom1, prom3;
  var user,clinician;

  prom1 =  userController.getUser();
  prom2 =  userController.getClinician();
  Promise.all([prom1,prom2]).then(result => {
    user = result[0];
    clinician = result[1]
    if(user.role == "Nurse"){
      res.render('health-assessment-physical', {
        isNurse: true,
        user: user,
        clinician:clinician
      });
    }
    else {
      res.render('health-assessment-physical', {
        isNurse: false,
        user: user,
        clinician:clinician
      });
    }
  }).catch(error => {
    console.log('Error in health assessment physical!');
    console.log(error.message);
  });
});

// Get physical exam page
router.get('/health-assessment/dental', loggedIn, (req, res) => {
  console.log("Read dental exam successful!");
  var prom1,prom2;
  var user,clinician;

  prom1 =  userController.getUser();
  prom2 = userController.getClinician();
  Promise.all([prom1,prom2]).then(result => {
    user = result[0];
    clinician = result[1];
    if(user.role == "Nurse"){
      res.render('health-assessment-dental', {
        isNurse: true,
        user: user,
        clinician:clinician
      });
    }
    else {
      res.render('health-assessment-dental', {
        isNurse: false,
        user: user,
        clinician:clinician
      });
    }
  }).catch(error => {
    console.log('Error in health assessment dental!');
    console.log(error.message);
  });
});

// Get health assessment schedule page
router.get('/health-assessment/schedule', loggedIn, (req, res) => {
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
router.get('/inventory-medicine', loggedIn, (req, res) => {
  console.log("Read medicine inventory successful!");
  var prom1, prom2, prom3;
  var user, inventory, usedMedicine;
  prom1 = userController.getUser();
  prom2 = inventoryController.getMedicineInventory();
  prom3 = inventoryController.getUsedMedicineToday();

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
router.get('/inventory-medicine/add', loggedIn, (req, res) => {
  console.log("Read add medicine successful!");
  var prom1, prom2, user, medicines;
  prom1 =  userController.getUser();
  prom2 = inventoryController.getMedicineNames();
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
      res.render('dashboard', {
        user: user, 
        isNurse: false,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
  })   
});

// Get supply inventory page
router.get('/inventory-supply', loggedIn, (req, res) => {
  console.log("Read supply inventory successful!");
  var prom1, prom2, prom3;
  var user, supply, discrepancy;
  prom1 = userController.getUser();
  prom2 = inventoryController.getSupplyInventory();
  prom3 = inventoryController.getSupplyDiscrepancy();
 
  Promise.all([prom1, prom2, prom3]).then(result => {
    user = result[0];
    supply = result[1];
    discrepancy = result[2];

    if(user.role == "Nurse"){
      res.render('inventory-supply', {
        user: user,
        isNurse: true,
        supply: supply
      });
    } else {
      res.render('inventory-supply', {
        user: user, 
        isNurse: false,
        supplyDiscrepancy: discrepancy
      });
    }
  }).catch(error => {
    console.log('Error in supply inventory');
    console.log(error.message);
  });
});

// Get add supply inventory page
router.get('/inventory-supply/add', loggedIn, (req, res) => {
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
      res.render('dashboard', {
        user: user, 
        isNurse: false,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
  })   
});

// Get dental inventory page
router.get('/inventory-dental', loggedIn, (req, res) => {
  console.log("Read dental successful!");
  var prom1, prom2, prom3;
  var user, dental, discrepancy;

  prom1 = userController.getUser();
  prom2 = inventoryController.getDentalInventory();
  prom3 = inventoryController.getDentalDiscrepancy();

  Promise.all([prom1, prom2, prom3]).then(result => {
    user = result[0];
    dental = result[1];
    discrepancy = result[2];
    
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
        dentalDiscrepancy: discrepancy
      });
    }
  }).catch(error => {
    console.log('Error in dental inventory');
    console.log(error.message);
  });
});

// Get add supply inventory page
router.get('/inventory-dental/add', loggedIn, (req, res) => {
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
      res.render('dashboard', {
        user: user, 
        isNurse: false,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
  })   
});

// Get promotive care page
router.get('/promotive-care', loggedIn, (req, res) => {
  console.log("Read promotive care successful!");
  var prom1, prom2;
  var user, programs;
  prom1 =  userController.getUser();
  prom2 = programController.getProgramsList();

  Promise.all([prom1, prom2]).then(result => {
    user = result[0];
    programs = result[1];

    if(user.role == "Nurse"){
      res.render('promotive-care', {
        user: user,
        isNurse: true,
        programs: programs
      });
    } else {
      res.render('promotive-care', {
        user: user, 
        isNurse: false,
        programs: programs
      });
    }
  }) 
});

// Get program form page
router.get('/promotive-care/program-form', loggedIn, (req, res) => {
  console.log("Read program form successful!");
  var prom1, prom2;
  var user;
  prom1 =  userController.getUser();

  Promise.all([prom1]).then(result => {
    user = result[0];
    
    if(user.role == "Nurse"){
      res.render('program-form', {
        user: user,
        isNurse: true,
      });
    } else {
      res.render('program-form', {
        user: user, 
        isNurse: false,
      });
    }
  }) 
});

// Get performance assessment  page
router.get('/performance-assessment', loggedIn, (req, res) => {
  console.log("Read performance assessment successful!");
  var prom1, prom2;
  var user, programs;
  prom1 =  userController.getUser();
  prom2 = programController.getProgramsList();

  Promise.all([prom1, prom2]).then(result => {
    user = result[0];
    programs = result[1];

    if(user.role == "Nurse"){
      res.render('performance-assessment', {
        user: user,
        isNurse: true,
        programs: programs
      });
    } else {
      res.render('performance-assessment', {
        user: user, 
        isNurse: false,
        programs: programs
      });
    }
  }) 
});

// Get communications page
router.get('/communications', loggedIn, (req, res) => {
  console.log("Read communications successful!");
  var users =  userController.getUser();
  users.then(function(result){
    res.render('communications', {
      users: users
    });
  })
});

// Get report clinic visit page
router.get('/reports-clinic-visit', loggedIn, (req, res) => {
  console.log("Read reports clinic visit successful!");
  var promise1, promise2;
  var user, reports;
  promise1 = userController.getUser();
  promise2 = visitController.getIncidenceList();

  Promise.all([promise1, promise2]).then( result => {
    user = result[0];
    reports = result[1];

    if(user.role == "Nurse"){
      res.render('clinic-visit', {
        isNurse: true,
        user: user,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
    else {
      res.render('reports-clinic-visit', {  
        isNurse: false,
        user: user,
        reports: reports,
      });
    }
  }).catch(error => {
    console.log('Error in clinic visit report!');
    console.log(error.message);
  });
});

// Get report health assessment page
router.get('/reports-health-assessment', loggedIn, (req, res) => {
  console.log("Read reports health assessment successful!");
  var prom1,prom2,prom3,prom4,user,sections;
  prom1 = userController.getUser();
  // prom2 = studentController.getSections();
  // prom3 = studentController.getAllSched();
  
  
  Promise.all([prom1]).then(result => {
    user = result[0];
    sections = result[1];
    scheduleData = result[2];
    prom4 = reportsController.getStudentsNoCurrYearRecord();
    
    // var i,schedule=[];
    // for(i=0;i<scheduleData.length;i++){
    //   console.log(scheduleData[i]);
    //   schedule.push({
    //     grade:scheduleData[i].grade,
    //     section:scheduleData[i].section,
    //     totalNumStudents:scheduleData[i].numStudents,
    //     apeDate:scheduleData[i].apeDate,
    //     apeTime:scheduleData[i].apeTime,
    //     apeSeen:scheduleData[i].apeSeen,
    //     adeDate:scheduleData[i].adeDate,
    //     adeTime:scheduleData[i].adeTime,
    //     adeSeen:scheduleData[i].adeSeen
    //   });
    // }
    
    if(user.role == "Nurse"){
      res.render('clinic-visit', {
        isNurse: true,
        user: user,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    }
    else {
      res.render('reports-health-assessment', {
        user: user, 
        isNurse: false,
        // sections: sections,
        // schedule:schedule
      });
    }
  }).catch(error => {
    console.log('Error in health assessment');
    console.log(error.message);
  });
});

// Get report inventory page
router.get('/reports-inventory', loggedIn, (req, res) => {
  console.log("Read reports inventory successful!");
  var prom1, prom2, prom3;
  var user, inventory, usedMedicine;
  prom1 = userController.getUser();
  prom2 = inventoryController.getMedicineInventory();
  prom3 = inventoryController.getUsedMedicineToday();

  Promise.all([prom1, prom2, prom3]).then(result => {
    user = result[0];
    inventory = result[1];
    usedMedicine = result[2];

    if(user.role == "Nurse"){
      res.render('clinic-visit', {
        isNurse: true,
        user: user,
        error: true,
        error_msg: "You don't have access to this module!"
      });
    } else {
      res.render('reports-inventory', {
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

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/updateNotif', notificationController.updateNotifications);

//--------GETTING STUDENT INFO RELATED----------------------------
router.get('/getStudentRecord', studentInfoController.getStudentInfo);
router.get('/getVisits', studentInfoController.getStudentVisits);
router.get('/getIntakeHistory', studentInfoController.getStudentIntakeHistory);
router.get('/getNotAllowedMedication', studentInfoController.getNotAllowedMedication);
router.get('/getBMI', studentInfoController.getBMI);
router.post('/getBmiStatus', studentController.getBmiStatus);
router.get('/getLastVisit', studentInfoController.getLastVisit);
router.get('/getAllVisits', visitController.getAllVisits);
router.get('/getImmunizationRecord', studentInfoController.getImmunizationRecord);
router.get('/getVaccineList', studentInfoController.getVaccineList);
router.get('/getPastIllness', studentInfoController.getStudentPastIllness);
router.get('/getAllergies', studentInfoController.getStudentAllergies);

//---------POST FORMS FOR CLINIC VISIT MODULE---------------------
router.post('/addClinicVisit', visitController.addClinicVisit);
router.post('/editClinicVisit', visitController.editClinicVisit);
router.post('/addMedicationIntake', visitController.addMedicationIntake);
router.post('/addIncidenceReport', visitController.addIncidenceReport);

//---------GET FOR CLINIC VISIT MODULE REPORTS---------------------
router.get('/getIncidenceCount', visitController.getIncidenceCount);

//---------POST FORMS FOR HEALTH ASSESSMENT MODULE----------------
router.post('/addAPE', studentController.addAPE); 
router.post('/addADE', studentController.addADE); 
router.post('/addSchedule', studentController.addSchedule);
router.post('/getSectionStudents',studentController.getSectionStudents);
router.post('/getApePercentageChart', studentController.getAPEPercentage);
router.post('/getAdePercentageChart', studentController.getADEPercentage);
router.post('/getAllPrevSchedules', studentController.getAllPrevSched);
router.post('/loadPrevDataAPE', studentController.loadPrevDataAPE);
router.post('/loadPrevDataADE', studentController.loadPrevDataADE);
router.post('/loadStudentData',studentController.loadStudentData);
router.post('/addWeightHeight',studentController.addWeightHeight);

//---------POST FORMS FOR DISEASE SURVEILLANCE MODULE----------------
router.post('/getDiseaseDemographics', surveillanceController.getDiseaseDemographics);
router.post('/getVisitReasonCountDashboard', surveillanceController.getVisitReasonCount);
router.post('/getVRGradeMonthlyCountDashboard', surveillanceController.getVRCountByGradeInMonth);
router.post('/getDataForTrend', surveillanceController.getDiseaseTrendCount);

//---------FORMS FOR INVENTORY MODULE----------------
router.post('/addMedicineInventory', inventoryController.addMedicineInventory);
router.post('/updateMedicineInventory', inventoryController.updateMedicineInventory);
router.get('/getTop5MedsUsedMonth', reportsController.getTop5MedsUsedMonth);
router.get('/getMedicineDiscrepancy', inventoryController.getMedicineDiscrepancy);
router.get('/getMedicineInventoryList', inventoryController.getMedicineInventoryList);
router.get('/getGroupedMedicineInventory', inventoryController.getGroupedMedicineInventory);
router.get('/getUsedMedicineMonthYear', inventoryController.getUsedMedicineMonthYear);
router.post('/addSupplyInventory', inventoryController.addSupplyInventory);
router.post('/updateSupplyInventory', inventoryController.updateSupplyInventory);
router.post('/addDentalInventory', inventoryController.addDentalInventory);
router.post('/updateDentalInventory', inventoryController.updateDentalInventory);

//---------POST FORMS FOR PROMOTIVE CARE MODULE----------------
router.post('/addProgram', programController.addProgram);

module.exports = router;