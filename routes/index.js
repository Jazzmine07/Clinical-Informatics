const router = require('express').Router();
//const connection = require('./database');
const userController = require('../Controller/userController');
const registrarController = require('../Controller/registrarController');

router.get('/', (req, res) => {
    res.redirect('/test');
  });
  
  // Get login page
  router.get('/login', (req, res) => {
    //if (req.session.user) res.redirect('/POS');
    //else {
      console.log("Read login successful!");
      res.render('login');
    //}
  });

router.get('/registrar_home', (req, res) => {
  //if (req.session.user) res.redirect('/POS');
  //else {
    console.log("Entered Registrar Home");
    res.render('login');
  //}
});

router.get('/test', (req, res) => {
  console.log("Read test success!");
  res.render('test');
});



router.post('/login', userController.login);
router.post('/getStudent', registrarController.getStudent);



module.exports = router;