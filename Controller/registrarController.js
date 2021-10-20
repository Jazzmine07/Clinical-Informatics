const connection = require('../database');

exports.addStudent = function (req, res){ 
    var add = "INSERT IGNORE INTO student_personal_info (id_num, first_name, last_name, middle_name, student_type, grade, section)" + 
    "VALUES ('119', 'Tom', 'Erichsen', 'Tan', 'new', '3', 'respect');";

    connection.query(add, function(err, results) {
        if (err) throw err;
        console.log("Record added!");
        console.log(results);
        
    });

    var historyRec;
    connection.query(add, function(err, results) {
        if (err) throw err;
        console.log("Record added!");
        console.log(results);
        
    });

};

exports.getStudent = function (req, res){ 
    var id_num = req.body.id;
    var get = "SELECT * FROM student_personal_info WHERE id_num = ?";
  
    connection.query(get, [id_num], function(err, result, fields) {
        // const studentObject = [];
      
        // student.forEach(function(doc) {
        //   productsObjects.push(doc.toObject());
        // });
          
        // callback(productsObjects);
        console.log("get student info controller");
        console.log(result);
        var student = ({
            id: result[0].id_num,
            firstName: result[0].first_name,
            lastName: result[0].last_name,
            middleName: result[0].middle_name,
            studentType: result[0].student_type,
            grade: result[0].grade,
            section: result[0].section
        })
        console.log(student);
        res(student);
    });
};