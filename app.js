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