import React from 'react';
import {Table,Container,Row,Alert,Col} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import moment from 'moment';
function TeacherViewResults(props){
    let {results,authTeacher} = props;
    console.log("lenght of results array = "+ results.lenght);
    if(authTeacher === null){
        return <Redirect to = '/teacher/login' />
    } 
    if(results.length === 0){
        return (
            <Container fluid className = "below-nav">
                <h3>Exam results</h3>
                 <Row>
                <Col>
                    <Alert key="noExams" variant="primary">
                       No exams taken
                    </Alert>
                </Col>
            </Row>
            </Container>
        )
    }
    return(
        
        <>
       
        <Container fluid className = "below-nav">
            <h3>Exam results</h3>
            
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Booking</th>
                        <th>Mark</th>
                        <th>Exam state</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {
                        results.map((r) => <ResultsRow key = {r.studentId} result = {r}/>)
                    }
                </tbody>
            </Table>

        </Container>

           
        </>
    )
}

function ResultsRow(props){
    let {result} = props;
    let date;
    if(result.booking === null){
        date = "Not booked";
    }else{
        date = moment(result.booking).format("dddd, MMMM Do YYYY, h:mm:ss a");

    }
    return <tr>
        <td>{result.studentId}</td>
        <td>{result.name}</td>
        <td>{result.surname}</td>
        <td>{date}</td>
        <td>{result.result}</td>
        <td>{result.examState}</td>
       
    </tr>
}

export default TeacherViewResults;