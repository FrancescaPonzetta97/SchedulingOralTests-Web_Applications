import Student from './Student';
import StudentDetail from './StudentDetail';
import StudentBooking from './StudentBooking';
import Course from './Course';
import Slot from './Slot';
const baseURL = "/api";

async function teacherIsAuthenticated(){
    return new Promise((resolve,reject) =>{
        let url = "/teacher";
        fetch(baseURL + url).then((res) =>{
            if(res.ok){
                res.json().then((teacher) => resolve(teacher)).catch((err) => reject(err));
            } else {
                reject(res.status);
            }
        }).catch((err) => reject(err));
    });

}

async function teacherLogin(username,password){
    console.log("in api received "+ username+" "+ password);
    return new Promise((resolve,reject) =>{
        let url = '/teacher/login';
        fetch(baseURL+url,{
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
        }).then((response) =>{
            if(response.ok){
                console.log("response ok");
                response.json().then((user) =>{
                    console.log("in api returned user = "+ user.teacherId);
                    resolve(user);
                });
            }else{
              
                    let err = {status: response.status, msg:"Login failed"};
                    reject(err);
            }
        }).catch((err) => {
            reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function teacherLogout(username, password) {
    return new Promise((resolve, reject) => {
        let url = '/teacher/logout';
        fetch(baseURL + url, {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                let err = {status: response.status, msg:"Logout failed"};
                reject(err);
            }
        });
    });
}

async function getStudentsPerCourse(){
    let url = "/teacher/exam/create/students";
    const response = await fetch(baseURL+url);
    const studentsJson = await response.json();
    if(response.ok){
        return studentsJson.map((s) => new Student(s.studentId,s.name,s.surname,s.selected));
    }else{
        let err = {status : response.status, errorObj: studentsJson};
        throw err;
    }
}

async function changeSelectedStudent(studentId,selected){
   const studentObj = {
       "studentId": studentId,
       "selected" : selected,
   }
    
    return new Promise((resolve,reject) =>{
        let url = "/teacher/exam/create/select";
        fetch(baseURL+url,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentObj),
        }).then((response) =>{
            if(response.ok){
                console.log("selected student updated");
            }else{
               let err = {status : response.status, msg :"Cannot change the selected student"};
               reject(err);
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
    
}
async function addSession(dateAndTime){
    return new Promise((resolve,reject) =>{
        let url = "/teacher/exam/create/newsession";
        fetch(baseURL+url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({dateAndTime : dateAndTime}),
        }).then((response) =>{
            if(response.ok){
                resolve(null);
            }else{
                let err = {status: response.status, msg:"Problems occured while addding the slots in the db"};
                reject(err);
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}



async function getCurrentSlots(){    
    let url = "/teacher/exam/create/current-slots";
    const response = await fetch(baseURL+url);
    const slotsJson = await response.json();
    if(response.ok){
        return slotsJson.map((s) => new Slot(s.courseId, s.dateAndTime));
    }else{
        let err = {status:response.status, errObj: slotsJson};
        throw err;
    }
}


async function getStudentsToBeExamined(){
    let url = "/teacher/exam/execute/bookedstudents";
    const response = await fetch(baseURL+url);
    const studentsJson = await response.json();
    if(response.ok){
        return studentsJson.map((s) => new StudentDetail(s.studentId,s.name,s.surname,s.booking,s.result,s.examState));
    }else{
        let err = {status: response.status, errObj:studentsJson};
        throw err;
    }
}

async function getExamResults(){
    let url = "/teacher/exam/results";
    const response = await fetch(baseURL+url);
    const studentsJson= await response.json();
    if(response.ok){
        return studentsJson.map((s) => new StudentDetail(s.studentId,s.name,s.surname,s.booking,s.result,s.examState));
    }else {
        let err = {status: response.status, errObj:studentsJson};
        throw err;
    }
}




async function setExamResult(studentId,result){
    let resultObj = {
        "studentId" : studentId,
        "result": result,
    };
    console.log("received result = "+result);
    return new Promise((resolve,reject) =>{
        let url = "/teacher/exam/execute/set-result";
        fetch(baseURL+url,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultObj),
        }).then((response) =>{
            if(response.ok){
                console.log("result updated");
            }else{
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); 
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });  
}



//STUDENT


async function studentLogin(studentId){
    return new Promise((resolve,reject) =>{
        let url = "/student/login";
        fetch(baseURL+url, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({studentId : studentId}),
        }).then((response) =>{
            if(response.ok){
                response.json().then((student) =>{
                    console.log("logged = "+student.studentId);
                    resolve(student);
                });
            }else{
                    let err = {status: response.status, msg:"Login failed"};
                    reject(err);
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })

}

async function getCurrentlyBookedSlots(studentId){
    let url = "/student/home/bookings";
    const queryParams = "?studentId="+studentId;
    url+= queryParams;
    const response = await fetch(baseURL+url);
    const bookingsJson = await response.json();
    if(response.ok){
        return bookingsJson.map((b) => new StudentBooking(b.courseId,b.courseDescription,b.booking,b.result, b.examState));
    }else{
        let err = {status:response.status, errObj: bookingsJson};
        throw err;
    }
}

async function getAvailableCoursesPerStudent(studentId){
    let url = "/student/home/courses";
    const queryParams = "?studentId="+studentId;
    url+= queryParams;
    const response = await fetch(baseURL+url);
    const coursesJson = await response.json();
    if(response.ok){
        return coursesJson.map((c) => new Course(c.courseId,c.courseDescription));
    }else{
        let err = {status:response.status, errObj: coursesJson};
        throw err;
    }
}

async function getSlotsPerCourse(courseId){    
    let url = "/student/home/slots";
    const queryParams = "?courseId="+courseId;
    url+= queryParams;
    const response = await fetch(baseURL+url);
    const slotsJson = await response.json();
    if(response.ok){
        return slotsJson.map((s) => new Slot(s.courseId, s.dateAndTime));
    }else{
        let err = {status:response.status, errObj: slotsJson};
        throw err;
    }
}





async function deleteBooking(courseId,dateAndTime,studentId){
    const requestObj = {
        "courseId": courseId,
        "dateAndTime": dateAndTime,
        "studentId": studentId
    };

    return new Promise((resolve,reject) =>{
        let url = "/student/home/deletebooking";
        fetch(baseURL+url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestObj),
        }).then((response)=>{
            if(response.ok){
                console.log("booking deleted");
            }else{
               let err = {state: response.state, msg : "A problem occured in deleting the booking"};
               reject(err);
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });

}

async function setBooked(studentId,courseId,dateAndTime){
    const bookedSlot = {
        "studentId": studentId,
        "courseId": courseId,
        "dateAndTime": dateAndTime,
    };
    return new Promise((resolve,reject) =>{
        let url = "/student/home/savebooking";
        fetch(baseURL+url,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookedSlot),
        }).then((response) =>{
            if(response.ok){
                console.log("update done");
            }else{
                let err = {state: response.state, msg : "A problem occured in booking the exam"};
                reject(err);
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); 
    });

}



const API = {teacherIsAuthenticated,teacherLogin, teacherLogout,getStudentsPerCourse,
                getCurrentlyBookedSlots,changeSelectedStudent,deleteBooking,
                getAvailableCoursesPerStudent,getSlotsPerCourse,setBooked,
                getStudentsToBeExamined,getExamResults,setExamResult,addSession, studentLogin,
                getCurrentSlots};
export default API;