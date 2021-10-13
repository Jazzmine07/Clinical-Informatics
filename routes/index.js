const router = require('express').Router();

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