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

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/getStudentRecord', studentController.getStudent);
router.post('/addClinicVisit', studentController.addClinicVisit);

module.exports = router;