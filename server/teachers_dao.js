'use-strict';

//here there are all the methods useful to the teacher
const moment = require('moment');
const Teacher = require('./teacher.js');
const Student = require('./classes/student');
const StudentDetail = require('./classes/studentDetail');
const Slot = require("./classes/slot");
const db = require('./db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createTeacher = function(row){
    const teacherId = row.teacherId;
    const name = row.name;
    const surname = row.surname;
    const courseId = row.courseId
    const email = row.email;
    const hash = row.hash;
    const courseDescription = row.courseDescription;
    
    return new Teacher(teacherId,name,surname,courseId,email,hash,courseDescription);
}
const createStudent = function(row){
    const studentId = row.studentId;
    const name = row.name;
    const surname = row.surname;
    const selected = row.selected;
    return new Student(studentId,name,surname,selected);
}

const createStudentDetail = function(row){
    const studentId = row.studentId;
    const name = row.name;
    const surname = row.surname;
    const booking = row.booking;
    const result = row.result;
    const examState = row.examState;
    return new StudentDetail(studentId,name,surname,booking,result,examState);
}

const createSlot = function(row){
    const courseId = row.courseId;
    const dateAndTime = row.dateAndTime;
    return new Slot(courseId,dateAndTime);
}

exports.getTeacherById = function(teacherId){
    console.log("received teacher = "+teacherId);
    return new Promise((resolve, reject) =>{
        const sql = "SELECT teacherId,name,surname,courseId, email, hash, courseDescription FROM teachers WHERE teacherId = ?";
        db.all(sql,[teacherId],(err,rows) =>{
            if(err){
                reject(err);
            }else if(rows.length === 0){
                resolve(undefined);
            }else{

                const teacher = createTeacher(rows[0]);
                resolve(teacher);
            }
        });

    });
};
exports.getTeacherByUsername = function(email){
    return new Promise((resolve,reject) =>{
        const sql = "SELECT teacherId, name, surname, courseId, email, hash, courseDescription FROM teachers WHERE email = ?";
        db.all(sql,[email], (err,rows) =>{
            if(err){
                console.log("after db call error");
                reject(err);
            }else if(rows.length === 0){
                resolve(undefined);
            }else{
                const teacher = createTeacher(rows[0]);
                console.log(teacher);
                resolve(teacher);
            }
        });
    });
};

exports.checkPassword = function(teacher,password){
    console.log("hash of "+ password);
    let hash = bcrypt.hashSync(password,saltRounds);
    console.log(hash + " DONE");
    console.log("in check psw received hash "+ teacher.hash);
    result = bcrypt.compareSync(password,teacher.hash);
    console.log("result of comparing hash = "+result);
    return result;
}

//to be used in select students when creating an exam
//da modificare sql, aggiungi AND e.result IS NULL AND e.booking IS NULL
exports.getAllStudentsPerCourse = function(courseId){

    return new Promise((resolve,reject) =>{
        
        const sql = "SELECT s.studentId,s.name,s.surname, e.selected FROM enrolled as e, students as s WHERE e.studentId = s.studentId AND e.courseId = ? AND e.booking IS NULL AND e.result IS NULL";
        db.all(sql,[courseId],(err,rows) =>{
            if(err){
                console.log("error");
                reject(err);
            }else{
                let students = rows.map((row) => createStudent(row));
                resolve(students);
            }
        });
    });
}

exports.getCurrentSlots = function(courseId){
    return new Promise((resolve,reject) =>{
        const sql = "SELECT courseId, dateAndTime FROM slots WHERE courseId = ? AND studentId IS NULL";
        db.all(sql,[courseId],(err,rows) =>{
            if(err){
                console.log("error");
                reject(err);
            }else{
                let slots= rows.map((row) => createSlot(row));
                resolve(slots);
            }
        });
    });
   
}

//to be used in view results
exports.getStudentResults = function(courseId){
    return new Promise((resolve,reject) =>{
        const sql = "SELECT s.studentId,s.name,s.surname, e.booking, e.result, e.examState FROM enrolled as e, students as s WHERE e.studentId = s.studentId AND e.courseId = ? AND e.selected = 1";
        db.all(sql,[courseId],(err,rows) =>{
            if(err){
                console.log("error");
                reject(err);
            }else{
                let students = rows.map((row) => createStudentDetail(row));
                resolve(students);
            }
        });
    });
}

exports.getStudentsToBeExamined = function(courseId){
    return new Promise((resolve,reject) =>{
        let examState = "not taken";
        const sql = "SELECT s.studentId,s.name,s.surname, e.booking, e.result,e.examState FROM enrolled as e, students as s WHERE e.studentId = s.studentId AND e.courseId = ? AND e.examState= ? AND e.selected = 1 AND e.result IS NULL AND e.booking IS NOT NULL";
        db.all(sql,[courseId,examState],(err,rows) =>{
            if(err){
                console.log("error");
                reject(err);
            }else{
                let students = rows.map((row) => createStudentDetail(row));
                resolve(students);
            }
        });
    });
}

exports.setSelectedStudents = function(courseId,studentId,selected){
    return new Promise((resolve,reject) =>{
        const sql = "UPDATE enrolled SET selected = ? WHERE courseId = ? AND studentId = ?";
        db.run(sql,[selected,courseId,studentId],(err) =>{
            if(err){
                console.log(err);
                reject(err);
            }else{
                resolve(null);
            }
        });
    });
}



exports.setExamResult = function(studentId,courseId,result){
    return new Promise((resolve,reject) =>{   
        if(result === "absent" || result === "withdrawn" || result ==="Fail"){
            let state = result;
            const sql = "UPDATE enrolled SET examState = ? WHERE studentId = ? AND courseId = ?";
            db.run(sql,[state,studentId,courseId],(err) =>{
                if(err){
                    console.log(err);
                    reject(err);
                }else{
                    resolve(null);
                }
            });
        }else{
            const state = 'passed';            
            let sql = "UPDATE enrolled SET result = ?, examState = ? WHERE studentId = ? AND courseId = ?";
            db.run(sql,[result,state,studentId,courseId],(err) =>{
                if(err){
                    console.log(err);
                    reject(err);
                }else{
                    resolve(null);
                }
            });
        }
               
       
    });
}

exports.createSessionSlots = function(session){
    const sql = "INSERT INTO slots(courseId, dateAndTime, studentId) VALUES(?,?,NULL)";
    return new Promise((resolve,reject) =>{
        db.run(sql,[session.courseId,session.dateAndTime,], (err) =>{
            if(err){
                reject(err);
            }else{
                resolve(null); 
            }
        });
    });    
}




