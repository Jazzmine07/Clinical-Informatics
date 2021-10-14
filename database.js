const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    database: 'clinical_informatics',
    user: 'root',
    password: 'p@ssword', 
});

module.exports = connection;