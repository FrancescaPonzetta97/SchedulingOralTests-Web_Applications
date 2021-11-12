
import React from 'react';
import { Button, Table, Image,Container,Row,Col,Alert} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import moment from 'moment';
import ResultExamForm from './ResultExamForm';
class ExecuteExam extends React.Component{
    constructor(props){
        super(props);
        this.state = {showForm : false, studentId: ''}
    }

    
    
    changeView = () =>{
        let oldView = this.state.showForm;
        this.setState({showForm : !oldView});
    }

    setInfoStudent = (studentId) =>{
        this.setState({studentId: studentId});
    }
    registerMark = (result) =>{
        this.props.registerResult(this.state.studentId,result);
    }

    render(){
        if(this.props.authTeacher === null){
            return <Redirect to = '/teacher/login' />
        } 
        return (
                <>
                <Container fluid className = "below-nav">
                    <h3>Booked students to be examined</h3>
                    {this.props.bookedStudents.length === 0 &&
                        <Row>
                            <Col>
                                <Alert key="noExams" variant="primary">
                                    There are not booked students for this exam
                                </Alert>
                            </Col>
                        </Row>
                    }
                    {this.props.bookedStudents &&
                    <>
                    <Table striped bordered hover size="sm">
                        <thead>
                             <tr>
                                 <th>Slot date and time</th>
                                 <th>StudentId</th>
                                 <th>Surname</th>
                                 <th>Name</th>
                                 <th>Set Result</th>
                             </tr>
                        </thead>
                         <tbody>
                            {this.props.bookedStudents.map((s) =><BookedStudentRow key = {s.booking} 
                                                                             student = {s} 
                                                                             changeView = {this.changeView}
                                                                             setInfoStudent = {this.setInfoStudent}/>)}
     
                         </tbody>
                    </Table>
     
                     <ResultExamForm showForm = {this.state.showForm} 
                                     registerMark = {this.registerMark}
                                     changeView = {this.changeView}/>
                    </>
                    }
                    
                    <h4>Defined slots</h4>
                    {this.props.currentSlots &&
                        <Table>
                            <thead>
                                <tr>
                                    <th>Current slots not already booked</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.currentSlots.map((s) => {return (<tr><td>{moment(s.dateAndTime).format('MMMM Do YYYY, h:mm:ss a')}</td></tr>)})}
                            </tbody>
                        </Table>
                    }   


                </Container>
            </>
        )
    }
}


function BookedStudentRow(props){
    let {student,changeView, setInfoStudent} = props;
    let date = moment(student.booking).format('MMMM Do YYYY, h:mm:ss a');
    
    const handleClick = (studentId) =>{     
        setInfoStudent(studentId);
        changeView();
    }

    return(
        <>
            <tr>
                <td>{date}</td>
                <td>{student.studentId}</td>
                <td>{student.surname}</td>
                <td>{student.name}</td>
                <td>
                <Button onClick = {(ev) => handleClick(student.studentId)}><Image width="20" height="20" className="img-button" src="/svg/edit.svg" alt ="" /></Button>

                </td>
            </tr>

        </>
    )
}

export default ExecuteExam;

