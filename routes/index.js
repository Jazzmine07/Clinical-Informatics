const router = require('express').Router();
const userController = require('../Controller/userController');
const studentController = require('../Controller/studentController');
const { loggedIn } = require('../Controller/userController');

router.get('/', (req, res) => {
  res.redirect('/login');
});

// Get login page
router.get('/login', (req, res) => {
  console.log("Read login successful!");
  res.render('login');
});

// Get dashboard page
router.get('/dashboard', (req, res) => {
  // -------------DONT FORGET TO UNCOMMENT-------------
  //userController.getUser(req, userInfo => {
    //console.log("user? " + userInfo);
    console.log("Read dashboard successful!");
    res.render('dashboard', {
      //user: userInfo
    });
  //})
});

// Get clinic visit page
router.get('/clinic-visit', (req, res) => { // dont foget to put loggedIn
  console.log("Read clinic visit successful!");
  studentController.getClinicVisits(req, records => {
    console.log("clinicVisits index", records);
    res.render('clinic-visit', {
      clinicVisits: records
    });
  })
});

// Get clinic visit page
router.get('/clinic-visit/create', (req, res) => {
  console.log("Read create clinic visit successful!");
  userController.getUsers(req, usersInfo => {
    res.render('clinic-visit-create', {
      users: usersInfo
    });
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
    console.log("clinicVisits index", records);
    res.render('health-assessment', {
      clinicVisits: records
    });
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

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/getStudentRecord', studentController.getStudent);
router.post('/addClinicVisit', studentController.addClinicVisit);
router.post('/addAPE', studentController.addAPE);


module.exports = router;