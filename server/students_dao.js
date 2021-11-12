'use strict';

const db = require("./db");
const StudentBooking = require("./classes/studentBooking");
const Course = require("./classes/course");
const Slot = require("./classes/slot");
const Student = require("./classes/student");

const createStudentBooking = function(row){
    const courseId = row.courseId;
    const courseDescription = row.courseDescription;
    const booking = row.booking;
    const result = row.result;
    const examState = row.examState;
    return new StudentBooking(courseId,courseDescription,booking,result,examState);
}

const createCourse = function(courseId,courseDescription){
    
    return new Course(courseId,courseDescription);
}

const createSlot = function(row){
    const courseId = row.courseId;
    const dateAndTime = row.dateAndTime;
    return new Slot(courseId,dateAndTime);
}
const createStudent = function(row){
    console.log("row "+ row.studentId);
    const studentId = row.studentId;
    const name = row.name;
    const surname = row.surname;
    return new Student(studentId,name,surname);
}

exports.getCurrentBookings = function(studentId){
    return new Promise((resolve,reject) =>{
        const sql = "SELECT e.courseId, t.courseDescription, e.booking, e.result, e.examState FROM teachers as t, enrolled as e WHERE e.studentId = ? AND t.courseId = e.courseId AND e.selected = 1 AND e.booking IS NOT NULL";
        db.all(sql,[studentId],(err,rows) =>{
            if(err){
                console.log("error");
                reject(err);
            }else{
                let bookings = rows.map((row) => createStudentBooking(row));
                resolve(bookings);
            }
        });
    });
}

exports.getAvailableCourses = function(studentId){
    return new Promise((resolve,reject) =>{
        const sql = "SELECT e.courseId, t.courseDescription,e.booking,e.examState FROM teachers as t, enrolled as e WHERE e.studentId = ? AND t.courseId = e.courseId AND e.selected = 1 AND e.examState <> 'passed' ";
        db.all(sql,[studentId],(err,rows) =>{
            if(err){
                console.log("error");
                reject(err);
            }else{
                //filter the received courses in order to include the courses where the student has taken the exam but he hasn't passed it (either because it was absent or withdrawn or because the mark was <18)
                let courses = rows.filter((r) =>{
                    return !(r.booking && r.examState === 'not taken');
                }).map((r) =>createCourse(r.courseId,r.courseDescription));
                
                resolve(courses);
            }
        });
    });
}

exports.getAvailableSlots = function(courseId){
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

//this function saves the studentId in the choosen slot
exports.setBookedStudent = function(courseId,studentId,dateAndTime){
    return new Promise((resolve,reject) =>{
        const sql = "UPDATE slots SET studentId = ? WHERE courseId = ? AND dateAndTime = ?";
        db.run(sql,[studentId,courseId,dateAndTime],(err) =>{
            if(err){
                console.log(err);
                reject(err);
            }else{
                resolve(null);
            }
        });
    });
}

//this function saves the choosen dateAndTime of the slot in the enrolled table on the row corresponding to the student and the choosen course
exports.setBookedSlot = function(courseId,studentId,dateAndTime){
    return new Promise((resolve,reject) =>{
        let examState = "not taken";
        const sql = "UPDATE enrolled SET booking = ?, examState = ? WHERE courseId = ? AND studentId = ?";
        db.run(sql,[dateAndTime,examState,courseId,studentId],(err) =>{
            if(err){
                console.log(err);
                reject(err);
            }else{
                resolve(null);
            }
        });
    });
}

exports.getStudentById = function(studentId){
    return new Promise((resolve,reject) =>{
        console.log("in dao received" + studentId);
        const sql = "SELECT studentId,name,surname FROM students WHERE studentId = ?";
        db.all(sql,[studentId],(err,rows) =>{
            if(err){
                console.log("error");
                reject(err);
            }else if(rows.length === 0){
                console.log("undefined");
                resolve(undefined);
            }else{
                console.log("found");
                const student = createStudent(rows[0]);
                console.log("created student: "+ student.studentId+ " "+ student.name+ " "+ student.surname);
                resolve(student);
                //return student;
            }
        });
    });
}

exports.deleteBookingFromSlots = function(courseId,dateAndTime){
    return new Promise((resolve,reject) =>{        
        const sql = "UPDATE slots SET studentId = null WHERE courseId = ? AND dateAndTime = ?";
        db.run(sql,[courseId, dateAndTime],(err) =>{
            if(err){
                reject(err);
            }else{
                resolve(null);
            }
        });
    });
}

exports.deleteBookingFromEnrolled = function(courseId,studentId){
    return new Promise((resolve,reject) =>{
        const sql = "UPDATE enrolled SET booking = null WHERE courseId = ? AND studentId = ?";
        db.run(sql,[courseId, studentId],(err) =>{
            if(err){
                reject(err);
            }else{
                resolve(null);
            }
        });
    });
}