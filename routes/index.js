const router = require('express').Router();
const userController = require('../Controller/userController');
const studentController = require('../Controller/studentController');
const inventoryController = require('../Controller/inventoryController');
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

router.get('/getNotification', studentController.getNotifications);

// Get dashboard page
router.get('/dashboard', (req, res) => {
  userController.getUser(req, user => {
    //studentController.getNotifications(user.key, notifs => {
      var i, count = 0, newNotifs;

      // for(i = 0; i < notifs.length; i++){
      //   if(notifs[i].seen == false){
      //     newNotifs = true;
      //     count++; 
      //   } else {
      //     newNotifs = false;
      //   }
      // }

      res.render('dashboard', {
        user: user,
        //notification: notifs,
        count: count,
        //newNotifs: newNotifs
      })
    //})
  })
});

// Get clinic visit page
router.get('/clinic-visit', (req, res) => { // dont foget to put loggedIn
  console.log("Read clinic visit successful!");
  userController.getUser(req, user => {
    studentController.getClinicVisits(req, records => {
      studentController.getAssignedForms(user.key, forms => {
        if(user.role == "Nurse"){
          res.render('clinic-visit', {
            isNurse: true,
            user: user,
            forms: forms,
            clinicVisits: records,
          });
        }
        else {
          res.render('clinic-visit', {  // add controller to get all forms assigned to clinician
            isNurse: false,
            user: user,
            clinicVisitForms: forms,
          });
        }
      })
    })
  })
});

// Get clinic visit page
router.get('/clinic-visit/create', (req, res) => {
  console.log("Read create clinic visit successful!");
  userController.getUser(req, user => {
    userController.getNurse(req, nurse => {
      userController.getClinician(req, clinician => {
        userController.assignTo(user.key, users => {
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
        })
      })
    })
  })
});

// Get clinic visit edit page
router.get('/clinic-visit/edit/:id', (req, res) => {
  console.log("Read create clinic visit edit successful!");
  userController.getUser(req, user => {
  //   userController.getNurse(req, nurse => {
  //     userController.getClinician(req, clinician => {
  //       userController.getUsers(req, users => {
    studentController.getClinicVisitForm(req, form => {
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
    })
          
  //      })
  //     })
  //   })
  })
});

// Get profile page
router.get('/profile', (req, res) => {
  console.log("Read profile successful!");
  res.render('profile');
});

// Get health assessment page
router.get('/health-assessment', (req, res) => { // dont foget to put loggedIn
  console.log("Read health assessment successful!");
  studentController.getClinicVisits(req, records => {
    studentController.getSections(req, sections => {
      console.log("clinicVisits index", records);
      console.log("sections:", sections);
      res.render('health-assessment', {
        clinicVisits: records,
        sections: sections
      });
    })
  })
});

// Get physical exam page
router.get('/health-assessment/physical', (req, res) => {
  console.log("Read physical exam successful!");
  userController.getUsers(req, usersInfo => {
    res.render('health-assessment-physical', {
      users: usersInfo
    });
  })
});

// Get health assessment schedule page
router.get('/health-assessment/schedule', (req, res) => {
  console.log("Read health assessment schedule successful!");
  userController.getUsers(req, usersInfo => {
    res.render('health-assessment-schedule', {
      users: usersInfo
    });
  })
});

// Get communications page
router.get('/communications', (req, res) => {
  console.log("Read communications successful!");
  userController.getUsers(req, usersInfo => {
    res.render('communications', {
      users: usersInfo
    });
  })
});

// Get promotive care page
router.get('/promotive-care', (req, res) => {
  console.log("Read promotive care successful!");
  userController.getUsers(req, usersInfo => {
    res.render('promotive-care', {
      users: usersInfo
    });
  })
});

// Get program form page
router.get('/promotive-care/program-form', (req, res) => {
  console.log("Read program form successful!");
  userController.getUsers(req, usersInfo => {
    res.render('program-form', {
      users: usersInfo
    });
  })
});

// Get inventory page
router.get('/inventory', (req, res) => {
  console.log("Read inventory successful!");
  userController.getUser(req, user => {
    inventoryController.getInventory(req, inventory => {
      res.render('inventory', {
        user: user,
        inventory: inventory
      });
    })
  })
});

// Get promotive care page
router.get('/inventory/add', (req, res) => {
  console.log("Read add inventory successful!");
  userController.getUser(req, user => {
    res.render('inventory-add', {
      user: user
    });
  })
});

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/getStudentRecord', studentController.getStudent);
router.post('/addClinicVisit', studentController.addClinicVisit);
router.post('/editClinicVisit', studentController.editClinicVisit);
router.post('/addAPE', studentController.addAPE); 
router.post('/addAPE', studentController.addAPE);
router.post('/getSectionStudents',studentController.getSectionStudents);
router.post('/getPercentageChart', studentController.getAPEPercentage);
router.post('/updateNotif', studentController.updateNotifications);
router.post('/addSchedule', studentController.addSchedule);
router.post('/getSchedules', studentController.getAllApeSched);
router.post('/addInventory', inventoryController.addInventory);
router.post('/getBmiStatus', studentController.getBmiStatus);


module.exports = router;