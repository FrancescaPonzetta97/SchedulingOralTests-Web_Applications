import React from 'react';
import {Button,Container,Col,Row} from 'react-bootstrap';
import {Link, Redirect} from 'react-router-dom';

function TeacherHome(props){
    let {authTeacher} = props;

    if(authTeacher === null){
        return <Redirect to = '/teacher/login' />
    }
    
    return (
        <>
        
            
       
        <Container fluid>
            <Row className = "justify-content-md-center">
                <Col className = "button-group col-3" >
                   <Link to={`/teacher/exam/create`}><Button className = "my-button" size = "sm" block> Create Exam</Button></Link> 
                   <Link to={`/teacher/exam/execute`}><Button className = "my-button" size = "sm" block> Execute Oral Test</Button></Link> 
                   <Link to={`/teacher/exam/results`}><Button className = "my-button" size = "sm" block> View Results</Button></Link> 
                </Col>
            </Row>
            

        </Container>
            
        </>
    )
}


export default TeacherHome;