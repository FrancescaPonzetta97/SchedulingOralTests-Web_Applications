import React from 'react';
import {Button,Container,Col,Row, Table,Image, Alert} from 'react-bootstrap';
import BookingSlotsForm from './BookingSlotsForm';
import {Redirect} from 'react-router-dom';
import moment from 'moment';
class StudentHome extends React.Component{
    constructor(props){
        super(props);
        this.state = {selectedCourse:'',
                        showForm: false };
    }   

    changeMode =() =>{
        let currentMode = this.state.showForm;
        this.setState({showForm: !currentMode});
    }
    setSelectedCourse = (courseId) =>{
        this.setState({selectedCourse: courseId});
    }


    render(){
        if(!this.props.student){
            return <Redirect to = "/student/login" />
        }
        return (
            <>
        
            <Container fluid className = "below-nav">
                <Row>
                    <Col>
                        <h4>Current bookings</h4>
                        <CurrentBookings bookings = {this.props.bookings} deleteBooking = {this.props.deleteBooking} update = {this.props.updateBookedSlots} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h4>Select the exam you want to book</h4>
                        <AvailableCourses courses = {this.props.courses} 
                                          getSlots = {this.props.getSlots} 
                                          setSelectedCourse = {this.setSelectedCourse} 
                                          changeMode = {this.changeMode}/>
                    </Col>
                    <BookingSlotsForm slots = {this.props.slots} 
                                      student = {this.props.student} 
                                      courseId = {this.state.selectedCourse} 
                                      setBooked = {this.props.setBooked} 
                                      changeMode = {this.changeMode} 
                                      showForm = {this.state.showForm} 
                                      update = {this.props.updateBookedSlots}/>
                   
                </Row>
                
    
            </Container>
            </>
        )
    }

   
}


function CurrentBookings(props){
    let {bookings, deleteBooking, update} = props;
   
    if(bookings.length === 0){
        return (
            <Alert key="noExams" variant="primary">
                There are not available exams to be booked
            </Alert>
        )
    }
    return(
        <>
            
               <Table striped bordered hover size="sm">
                   <thead>
                       <tr>
                           <th >Course</th>
                           <th >Date and Time of the oral exam</th>
                           <th>Result</th>
                           <th >Delete booking</th>
                           
                       </tr>
                   </thead>
                   <tbody>
                       {bookings.map((b) => <BookingRow key = {b.courseId+b.booking} 
                                                        booking = {b} 
                                                        deleteBooking = {deleteBooking} 
                                                        update = {update}/>)}

                   </tbody>

               </Table>

        </>
    )
}

function BookingRow(props){
    let {booking, deleteBooking,update} = props;
    let date = moment(booking.booking).format("dddd, MMMM Do YYYY, h:mm:ss a");
    const handleDelete = (booking)=>{
        deleteBooking(booking);
        update();
    }
    if(booking.result || !booking.result && booking.examState !== 'not taken'){
        let result;
        if(booking.examState !== 'not taken' && booking.examState !== 'passed'){
            result = booking.examState;
        }else{
            result = booking.result
        }

       
        return (
            <>
               <tr>
                    <td>{booking.courseDescription}</td>
                    <td>{date} </td>                  
                    <td>{result}</td>
                    <td></td>
               </tr>
    
            </>
        )

    }else{
        return (
            <>
               <tr>
                    <td>{booking.courseDescription}</td>
                    <td>{date} </td>                  
                    <td></td>
                    <td>
                    <Image width="20" height="20" className="img-button" src="/svg/delete.svg" alt ="" onClick={() => handleDelete(booking)}/>
                    </td>
                   
                                      
               </tr>
    
            </>
        )

    }
    
}

function AvailableCourses(props){
    let {courses,getSlots,setSelectedCourse,changeMode} = props;
    if(courses.length === 0){
        return (
            <Alert key="noExams" variant="primary">
                There are not available exams to be booked
            </Alert>
        )
    }else{
    
       return (
        <>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Available exams</th>
                        </tr>
                    </thead>
                    <tbody>                    
                        {courses.map((c) => <CourseRow key = {c.courseId+"c"} course = {c} getSlots = {getSlots} setSelectedCourse = {setSelectedCourse} changeMode = {changeMode}/>)}
                    </tbody>
                </Table>

        </>
    )
    }
}

function CourseRow(props){
    let {course, getSlots,setSelectedCourse,changeMode} = props;

    const handleClick = ()=>{
        setSelectedCourse(course.courseId);
        getSlots(course.courseId);
        changeMode();
    }

    return (
        <>
            <tr>
                <th>
                    <Button className = "my-button" onClick = {() =>handleClick()}>{course.courseDescription}</Button>
                </th>
            </tr>

        </>
    )
  
}

export default StudentHome;


