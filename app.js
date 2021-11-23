const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const db = require('./firebase');
// const gmail = require('./gmail');

//Routes imports
const indexRouter = require('./routes/index');

const app = express();
const port = 3000;
const hostname = 'localhost';

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
    getDay: function(string){
      let date = new Date(string)
      var day = date.toLocaleString('default', {day: 'long'})
      return (day);
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'/')));
app.use('/', indexRouter); // Routes

