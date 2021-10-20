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
    var create_student_info = "CREATE TABLE IF NOT EXISTS student_personal_info (id_num INT PRIMARY KEY, student_first_name VARCHAR(45), student_last_name VARCHAR(45), student_middle_name VARCHAR(45), student_type VARCHAR(45), student_grade VARCHAR(45), student_section VARCHAR(45))";
    var create_users = "CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY, first_name VARCHAR(45), last_name VARCHAR(45), email VARCHAR(45), password VARCHAR(45), role VARCHAR(45))";
    var insert = "INSERT IGNORE INTO users (id, first_name, last_name, email, password, role) VALUES ?";
    var users = [
        ['1', 'Jazz', 'Ilagan', 'jazz@gmail.com', '12345', 'Registrar'],
        ['2', 'Jhose', 'De Asis', 'jhose@gmail.com', '12345', 'Clinician']
    ]; 

    connection.query(create_student_info, function (err, result) {
        if (err) throw err;
        console.log("Student personal info table created!");
        console.log(result);
    });

    connection.query(create_users, function (err, result) {
        if (err) throw err;
        console.log("Users table created!");
        console.log(result);
    });

    connection.query(insert, [users], function (err, results) {
        if (err) throw err;
        console.log("Users added!");
        console.log(results);
        });
    });

    var add = "INSERT IGNORE INTO student_personal_info (id_num, first_name, last_name, middle_name, student_type, grade, section)" + 
    "VALUES ('119', 'Tom', 'Erichsen', 'Tan', 'new', '3', 'respect');";

    connection.query(add, function(err, results) {
        if (err) throw err;
        console.log("Record added!");
        console.log(results);
    });

module.exports = connection;