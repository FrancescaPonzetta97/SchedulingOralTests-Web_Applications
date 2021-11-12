import React from 'react';
import FirstPage from './components/FirstPage';
import TeacherHome from './components/TeacherHome';
import StudentHome from './components/StudentHome';
import TeacherLoginForm from './components/TeacherLoginForm';
import StudentAccessForm from './components/StudentAccessForm';
import CreateExam from './components/createExam/CreateExam';
import { withRouter, Route} from 'react-router-dom';
import {Switch} from 'react-router';
import API from './api/Api';
import ExecuteExam from './components/ExecuteExam';
import TeacherViewResults from './components/TeacherViewResults';
import Header from './components/Header';
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      authTeacher:null,
      authStudent: null,
      authErr:null,
      students: [],
      currentSlots:[],
      bookedStudents: [],
      examResults: [],    //for teacher and students
      courses :[],   //used by student
      currentBookings:[], //used by student
      availableSlots:[],  //used by student
    }
  }



  handleErrors(err) {
    if (err) {
        if (err.status && err.status === 401) {
          this.setState({authErr: err.errorObj});
          this.props.history.push("/teacher/login");
        }
    }
}

componentDidMount(){
  API.teacherIsAuthenticated().then(
    (teacher) =>{
      this.setState({authTeacher : teacher });
      API.getStudentsPerCourse().then((students) => this.setState({students: students}));

      API.getStudentsToBeExamined().then((students) => this.setState({bookedStudents: students}));

      API.getCurrentSlots().then((slots) => this.setState({currentSlots : slots}));

      API.getExamResults().then((results) => this.setState({examResults: results}));

      this.props.history.push("/teacher/home");
    }
  ).catch((err) => {
    console.log(err.status);
    this.props.history.push("/");
  });
}



  teacherLogin = (username,password) =>{
    API.teacherLogin(username,password)
    .then((teacher) =>{
        this.setState({authTeacher : teacher});

        API.getStudentsPerCourse(this.state.authTeacher.courseId).then((students) => this.setState({students: students})).catch((err) => console.log(err));

        API.getStudentsToBeExamined(this.state.authTeacher.courseId).then((students) => this.setState({bookedStudents: students})).catch((err) => console.log(err));

        API.getCurrentSlots().then((slots) => this.setState({currentSlots : slots})).catch((err) => console.log(err));

        API.getExamResults().then((results) => this.setState({examResults: results})).catch((err) => console.log(err));
        
        this.props.history.push("/teacher/home");
      }).catch((err) =>{
        alert(err.msg);
        this.props.history.push("/");

      });
  }

  teacherLogout = () =>{
    API.teacherLogout().then(() =>{
      this.setState({authTeacher:null,
                      authErr:null,
                      students:[],
                      bookedStudents:[],
                      currentSlots:[],
                      examResults:[]
                    });
    }).catch((err) => {
      alert(err.msg);
      this.props.history.push("/teacher/login");
    });
  }

  studentLogin = (studentId) =>{
    API.studentLogin(studentId).then((student) =>{
      this.setState({authStudent : student});
      API.getCurrentlyBookedSlots(this.state.authStudent.studentId).then((bookings) => this.setState({currentBookings : bookings}));
      API.getAvailableCoursesPerStudent(this.state.authStudent.studentId).then((courses) => this.setState({courses: courses}));
    }).catch((err) =>{
        alert(err.msg);
    })
  }

  studentLogout = ()=>{
      this.setState({
        authStudent : null,
        currentBookings: [],
        courses: [],
        availableSlots:[],
      });
  }

 userLogout = ()=>{
   if(this.state.authTeacher){
     this.teacherLogout();
   }else if(this.state.authStudent){
     this.studentLogout();
   }
 }

  changeSelected = (studentId,selected) =>{
    let selValue = 0;
    if(selected === true){
      selValue = 1;
    }
    API.changeSelectedStudent(studentId,selValue)
    .then(
    ).catch((err) => {
     console.log(err.msg);
      if(err.status === 401){
        this.teacherLogout();
      }
    });
     
    
  }

  updateTeacherState = ()=>{
    console.log("updating state");
    API.getStudentsPerCourse().then((students) => this.setState({students: students})).catch((err) => console.log(err));

    API.getStudentsToBeExamined().then((students) => this.setState({bookedStudents: students})).catch((err) => console.log(err));

    API.getCurrentSlots().then((slots) => this.setState({currentSlots : slots})).catch((err) => console.log(err));

    API.getExamResults().then((results) => this.setState({examResults: results})).catch((err) => console.log(err));
  }

  deleteBooking = (booking) =>{
    API.deleteBooking(booking.courseId,booking.booking,this.state.authStudent.studentId).then(
      API.getCurrentlyBookedSlots(this.state.authStudent.studentId).then((bookings) =>{ this.setState({currentBookings : bookings})
      API.getAvailableCoursesPerStudent(this.state.authStudent.studentId).then((courses) => this.setState({courses: courses}));
      })
    ).catch((err) =>{
      alert(err.msg);
    });
  }

  setBooked = (studentId,courseId,dateAndTime) =>{
    API.setBooked(studentId,courseId,dateAndTime).then(
      API.getCurrentlyBookedSlots(this.state.authStudent.studentId).then((bookings) =>{ this.setState({currentBookings : bookings})
      API.getAvailableCoursesPerStudent(this.state.authStudent.studentId).then((courses) => this.setState({courses: courses}));
      })
    ).catch((err)=>{
        alert(err.msg);    
    });
  }

  updateBookedSlots=() =>{
    API.getCurrentlyBookedSlots(this.state.authStudent.studentId)
    .then((bookings) => this.setState({currentBookings : bookings}))
    .catch((err) =>{
      console.log(err.status);
    });
  }
  
  registerResult =(studentId,result) =>{
     API.setExamResult(studentId,result).then(
       API.getExamResults().then((results) =>{ 
         this.setState({examResults:results});
         API.getStudentsToBeExamined().then((students) => this.setState({bookedStudents: students}));
       })     
      ).catch((err)=>{       
        if(err.status === 401){
          this.teacherLogout();
        }
      });
  }

  getSlotsPerCourse = (courseId)=>{
    API.getSlotsPerCourse(courseId)
    .then((slots) => this.setState({availableSlots : slots}))
    .catch((err) =>{
      console.log(err.status);
    });
  }

  

  render(){
    
    return(
    <>
      <Header authUser =  {this.state.authStudent ? this.state.authStudent : this.state.authTeacher} 
              logout = {this.userLogout}
              isStudent = {this.state.authStudent ? true : false} 
              isTeacher = {this.state.authTeacher ? true : false} />
      <Switch>
      <Route exact path = "/">
          <FirstPage />
        </Route>

        <Route exact path = "/teacher/home" >
          <TeacherHome authTeacher = {this.state.authTeacher}/>
        </Route>
       

        <Route exact path = "/teacher/login" >
          <TeacherLoginForm login = {this.teacherLogin} authTeacher = {this.state.authTeacher}/>
        </Route>

        <Route exact path = "/teacher/exam/create" >
          <CreateExam students = {this.state.students} 
                      changeSelected = {this.changeSelected}  
                      newSession = {this.newSession} 
                      slots = {this.state.currentSlots}
                      authTeacher = {this.state.authTeacher}
                      logout = {this.teacherLogout}
                      update = {this.updateTeacherState}
                      teacherLogout = {this.teacherLogout}/>
        </Route>
        <Route exact path = "/teacher/exam/execute">
          <ExecuteExam bookedStudents = {this.state.bookedStudents} 
                        registerResult = {this.registerResult} 
                        authTeacher = {this.state.authTeacher}
                        currentSlots = {this.state.currentSlots}
                        logout = {this.teacherLogout}/>
          
        </Route>

        <Route exact path = "/teacher/exam/results">
          <TeacherViewResults results = {this.state.examResults} authTeacher = {this.state.authTeacher} logout = {this.teacherLogout}/>
        </Route>

        <Route exact path = "/student/login">
          <StudentAccessForm studentLogin = {this.studentLogin}  authStudent = {this.state.authStudent}/>
        </Route>

        <Route exact path="/student/home">
          <StudentHome student = {this.state.authStudent} 
                        logout = {this.studentLogout}
                        bookings = {this.state.currentBookings} 
                        deleteBooking = {this.deleteBooking} 
                        courses = {this.state.courses} 
                        getSlots = {this.getSlotsPerCourse}
                        slots = {this.state.availableSlots}
                        setBooked = {this.setBooked}
                        updateBookedSlots = {this.updateBookedSlots} />
        </Route>


      </Switch>
    </>
    )
  }
}

export default withRouter(App);
