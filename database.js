const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    database: 'clinical_informatics',
    user: 'root',
    password: 'p@ssword', 
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var create = "CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY, first_name VARCHAR(45), last_name VARCHAR(45), email VARCHAR(45), password VARCHAR(45), role VARCHAR(45))";
    var insert = "INSERT INTO users (id, first_name, last_name, email, password, role) VALUES ?";
    var users = [
        ['1', 'Jazz', 'Ilagan', 'jazz@gmail.com', '12345', 'Registrar'],
        ['2', 'Jhose', 'De Asis', 'jhose@gmail.com', '12345', 'Clinician']
    ]; 

    connection.query(create, function (err, result) {
      if (err) throw err;
      console.log("Table created!");
      console.log(result);
    });

    connection.query(insert, [users], function (err, results) {
        if (err) throw err;
        console.log("Users added!");
        console.log(results);
      });
  });

module.exports = connection;