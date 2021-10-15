const router = require('express').Router();
//const connection = require('./database');
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

router.get('/registrar_home',(req, res) => {
  //if (req.session.user) res.redirect('/POS');
  //else {
    console.log("Entered Registrar Home");
    res.render('login');
  //}
});

router.post('/login', userController.login);




module.exports = router;