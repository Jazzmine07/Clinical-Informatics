const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const connection = require('./database');
//Routes imports
const indexRouter = require('./routes/index');
const db = require('./firebase')

const app = express();
const port = 3000;
const hostname = 'localhost';

//const session = require('express-session');

// Sessions
// app.use(session({
//   secret: 'secret',
//   //store: new MongoStore({ mongooseConnection: mongoose.connection }),
//   resave: false,
//   saveUninitialized: true,
//   //cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 }
// }));

app.listen(port, function() { 
  console.log(`Server running at http://${hostname}:${port}/`); 
});

app.engine('hbs', exphbs.create({
  extname: 'hbs',
  helpers: {
    formattingDate: function(string){
      let date = new Date(string)
      return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
    },
    formatDate: function(string){
      let date = new Date(string)
      var month = date.toLocaleString('default', { month: 'long' })
      return (month + ' ' + date.getDate() + ', ' + date.getFullYear());
    },
    format_Date: function(string){
      let date = new Date(string)
      var month = date.toLocaleString('default', { month: 'long' })
      return (month + ' ' + date.getFullYear());
    },
    addZeroes: function(num){
      // Convert input string to a number and store as a variable.
      var value = parseFloat(num).toFixed(2);      
      var formattedString= value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      return formattedString;
    },
    addCommas: function(num){
      // Convert input string to a number and store as a variable.
      var value = parseFloat(num);      
      var formattedString= value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      return formattedString;
    }
  },
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts'), 
  partialsDir: path.join(__dirname, '/views/partials'),
}).engine);

app.set('view engine', 'hbs');

// Configuration for handling API endpoint data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'/')));
app.use('/', indexRouter); // Routes

