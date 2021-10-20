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
    });

    var create_student_info = "CREATE TABLE IF NOT EXISTS student_personal_info (id_num INT PRIMARY KEY, first_name VARCHAR(45), last_name VARCHAR(45), middle_name VARCHAR(45), student_type VARCHAR(45), grade VARCHAR(45), section VARCHAR(45))";
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


    var add = "INSERT IGNORE INTO student_personal_info (id_num, first_name, last_name, middle_name, student_type, grade, section)" + 
    "VALUES ('118', 'Vin', 'Groot', 'Diesel', 'new', '4', 'fidelity');";

    connection.query(add, function(err, results) {
        if (err) throw err;
        console.log("Record added!");
        console.log(results);
    });


    //healthy history table
    var create_student_health_history = "CREATE TABLE IF NOT EXISTS health_history (idhealth_history INT NOT NULL AUTO_INCREMENT,id_num INT NOT NULL,curr_height DOUBLE NULL,curr_weight DOUBLE NULL,curr_bmi DOUBLE NULL,lab_results BLOB NULL, PRIMARY KEY (idhealth_history), INDEX student_id_idx (id_num ASC) VISIBLE, CONSTRAINT student_id FOREIGN KEY (id_num) REFERENCES clinical_informatics.student_personal_info (id_num) ON DELETE NO ACTION ON UPDATE NO ACTION);";

    var insert = "INSERT IGNORE INTO health_history (id_num) VALUES ('118')";
    
    connection.query(create_student_health_history, function (err, result) {
        if (err) throw err;
        console.log("Health History table created!");
        console.log(result);
    });

    connection.query(insert, function (err, result) {
        if (err) throw err;
        console.log("118 added!");
        console.log(result);
    });


module.exports = connection;