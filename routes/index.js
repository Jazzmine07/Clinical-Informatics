const router = require('express').Router();
const userController = require('../Controller/userController');

router.get('/', (req, res) => {
    res.redirect('/login');
  });
  
  // Get login page
  router.get('/login', (req, res) => {
    //if (req.session.user) res.redirect('/POS');
    //else {
      console.log("Read login successful!");
      res.render('login');
    //}
  });

  // Get dashboard page
  router.get('/dashboard', (req, res) => {
    //if (req.session.user) res.redirect('/POS');
    //else {
      console.log("Read dashboard successful!");
      res.render('index');
    //}
  });

router.post('/login', userController.login);
//router.post('/getStudent', registrarController.getStudent);

module.exports = router;