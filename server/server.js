const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const students_dao = require('./students_dao');
const teachers_dao = require('./teachers_dao');
const secret = require('./secret');

const jwtSecret = secret.getSecret;
const expireTime = 300; //seconds

app = new express();
const PORT = 3001;

app.use(morgan('tiny'));
app.use(express.json());

//authorization error
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };

//STUDENT

app.post('/api/student/login', (req,res) =>{
    const studentId = req.body.studentId;
    students_dao.getStudentById(studentId)
        .then((student) =>{
            if(student === undefined){
                res.status(404).send({
                    errors: [{ 'param': 'Server', 'msg': 'Invalid studentId' }] 
                });
            }else{
                res.json({studentId: student.studentId, name: student.name, surname: student.surname});
            }
        }).catch(
             // Delay response when wrong user/pass is sent to avoid fast guessing attempts
            (err) => {
                new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
            }
        );
});

//get all the current bookings of the student
app.get('/api/student/home/bookings',(req,res) =>{
    const studentId = req.query.studentId;
    console.log("student = " +studentId);
    students_dao.getCurrentBookings(studentId)
        .then((bookings) =>{
            res.json(bookings);
        })
        .catch((err) => {
            res.status(500).json({
                errors:[{'msg': err}],
            });
        });
});

app.get('/api/student/home/courses',(req,res) =>{
    const studentId = req.query.studentId;
    students_dao.getAvailableCourses(studentId)
        .then((courses) =>{
            res.json(courses);
        })
        .catch((err) => {
            res.status(500).json({
                errors:[{'msg': err}],
            });
        });
});

//get the available slots for the exam of the choosen course
app.get('/api/student/home/slots',(req,res) =>{
    const course = req.query.courseId;
    console.log(course);
    students_dao.getAvailableSlots(course)
        .then((slots) =>{
            res.json(slots);
        })
        .catch((err) =>{
            res.status(500).json({
                errors:[{'msg':err}],
            });
        });
});

app.put('/api/student/home/deletebooking',(req,res) =>{
    const courseId = req.body.courseId;
    const dateAndTime = req.body.dateAndTime;
    const studentId = req.body.studentId;
    console.log(courseId);
    console.log(dateAndTime);
    console.log(studentId);
    if(!courseId || !dateAndTime || !studentId){
        res.status(400).end();
    }else{
        students_dao.deleteBookingFromEnrolled(courseId,studentId)        
        .then(() => {
            students_dao.deleteBookingFromSlots(courseId,dateAndTime)
                .then(() =>{
                    res.status(200).json({msg: "booking deleted"});
                }).catch((err) =>{
                    res.status(500).json({
                        errors: [{'param': 'Server','msg': err}],
                    });
                });
        })
        .catch((err) =>{
            res.status(501).json({
                errors: [{'param': 'Server','msg': err}],
            });
            
        });
    
    }
    
});


app.put('/api/student/home/savebooking', (req,res) =>{
    const studentId = req.body.studentId;
    const courseId = req.body.courseId;
    const dateAndTime = req.body.dateAndTime;
    console.log(studentId);
    console.log(dateAndTime);
    console.log(courseId);
    
    if(!courseId || !dateAndTime || !studentId){
        res.status(400).end();
    }else{
      
        students_dao.setBookedSlot(courseId,studentId,dateAndTime)        
            .then(() => {
                console.log("updated external");
                students_dao.setBookedStudent(courseId, studentId, dateAndTime)
                    .then((result) => {
                        console.log("updated internal");
                        res.status(200).end();
                    })
                    .catch((err) => res.status(500).json({
                        errors: [{'param': 'Server','msg': err}],
                    }));

            }).catch((err) => res.status(500).json({
                errors: [{'param': 'Server','msg': err}],
            }));        
    }
});

//TEACHER


app.post('/api/teacher/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("in server received usr and psw = "+username+" "+ password);
    teachers_dao.getTeacherByUsername(username)
      .then((teacher) => {        
        if(teacher === undefined) {
            res.status(404).send({
                errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }] 
              });
        } else {
            if(!teachers_dao.checkPassword(teacher, password)){
                res.status(401).send({
                    errors: [{ 'param': 'Server', 'msg': 'Wrong password' }] 
                  });
            } else {
                const user = {
                    teacher: teacher.teacherId,
                    course: teacher.courseId
                };
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({teacher: teacher.teacherId,course: teacher.courseId}, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({teacherId: teacher.teacherId, name: teacher.name, surname :teacher.surname, courseId:teacher.courseId, courseDescription:teacher.courseDescription});
            }
        } 
      }).catch(      
          // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            console.log("ERROR");
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json({ errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] }));
        }
      );
  });


app.use(cookieParser());

app.post('/api/teacher/logout', (req,res) =>{
    res.clearCookie('token').end();
});

// For the rest of the code, all APIs require authentication

app.use(
    jwt({
      secret: jwtSecret,
      getToken: req => req.cookies.token
    })
  );



  //check if the user has a valid token
app.get('/api/teacher',(req,res) =>{
    const id = req.user && req.user.teacher;
    const course = req.user && req.user.course;
    console.log("user from cookie = " + id+" course "+course);
    teachers_dao.getTeacherById(id)
        .then((teacher) =>{
            res.json({teacherId: teacher.teacherId, name: teacher.name, surname :teacher.surname, courseId:teacher.courseId, courseDescription:teacher.courseDescription})
        }).catch(
            (err) =>{
                res.status(401).json({msg:err});
            }
        )
})

  //authenticated REST API endpoints


app.get("/api/teacher/exam/create/students",(req,res) =>{
    const course = req.user && req.user.course;
    teachers_dao.getAllStudentsPerCourse(course)
        .then((students) =>{
            res.json(students);
        })
        .catch((err) => {
            res.status(500).json({
                errors:[{'msg': err}],
            });
        });
});



app.get('/api/teacher/exam/results',(req,res) =>{
    const course = req.user && req.user.course;
    teachers_dao.getStudentResults(course)
        .then((students) =>{
            res.json(students);
        })
        .catch((err) => {
            res.status(500).json({
                errors:[{'msg': err}],
            });
        });
});


app.get('/api/teacher/exam/execute/bookedstudents',(req,res) =>{
    const course =req.user && req.user.course;
    teachers_dao.getStudentsToBeExamined(course)
        .then((students) =>{
            res.json(students);
        })
        .catch((err) => {
            res.status(500).json({
                errors:[{'msg': err}],
            });
        });
});

app.get('/api/teacher/exam/create/current-slots',(req,res) =>{
    const course =req.user && req.user.course;
    teachers_dao.getCurrentSlots(course)
        .then((slots) =>{
            res.json(slots);
        }) .catch((err) =>{
            res.status(500).json({
                errors:[{'msg':err}],
            });
        });      
});

app.put('/api/teacher/exam/execute/set-result',(req,res) =>{
    
    if(!req.body.result){
        res.status(400).end();
    }else{
        const courseId = req.user && req.user.course;
        const examResult = req.body.result;
        const studentId = req.body.studentId;
        console.log(examResult);
        teachers_dao.setExamResult(studentId,courseId,examResult)
            .then(() => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            }));
    }
});

app.post('/api/teacher/exam/create/newsession',(req,res) =>{
    

    let session = {
        "courseId"  : req.user && req.user.course,
        "dateAndTime" : req.body.dateAndTime
    };
    teachers_dao.createSessionSlots(session)
        .then((dateAndTime) => res.status(201).json({"id":dateAndTime}))
        .catch((err) =>{
            res.status(500).json({errors:[{'param': 'Server', 'msg':err}],})
        });
})

//create the slots and insert them in the db
/*
app.post('/api/teacher/exam/create/newsession',(req,res) =>{
    const courseId = req.user && req.user.course;
    const date = req.body.date;
    const startTime = req.body.startTime;
    const duration = req.body.duration;
    const nSlots = req.body.nSlots;
    const slotDuration = req.body.slotDuration;

    if(!date || !startTime){
        res.status(400).end();
    } else{
        let session = {
            "courseId" : courseId,
            "date": date,
            "startTime": startTime,
            "duration": duration,
            "nSlots": nSlots
        }
        console.log(session);
        teachers_dao.createSessionSlots(session,slotDuration)
            .then((dateAndTime) => res.status(201).json({"id":dateAndTime}))
            .catch((err) =>{
                res.status(500).json({errors:[{'param': 'Server', 'msg':err}],})
            });
    }
});

*/

//update the selected field in the enrolled table
app.put('/api/teacher/exam/create/select',(req,res)=>{
    const courseId = req.user && req.user.course;
    const studentId = req.body.studentId;
    const selected = req.body.selected;
    if(courseId === null || studentId === null || selected === null){
        res.status(400).end();
    }else{
        teachers_dao.setSelectedStudents(courseId,studentId,selected)
            .then((res.status(200).end()))
            .catch((err) =>{
                res.status(500).json({
                    errors:[{'msg': err}],
                });
            });
    }
});


app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));