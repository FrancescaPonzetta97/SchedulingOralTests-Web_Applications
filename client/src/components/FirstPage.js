import React from 'react';
import {Container, Row,Col, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

function FirstPage(){
    return(
        <>
        
        <Container fluid>
                <Row className = "vheight-100">
                    
                    <Col sm = {6} className = "below-nav">
                        <Link to = {`/teacher/login`}><Button className = "home-button" size = "lg">Teacher</Button> </Link>                
                    </Col>

                    <Col sm = {6} className = "below-nav">
                        <Link to = {`/student/login`}><Button className = "home-button" size = "lg">Student</Button> </Link>                
                        
                    </Col>

                </Row>
            </Container>

    </> 
    
    )
    
}

/*
<Navbar className bg="primary" variant = "dark" expand= "sm" fixed = "top">
            <Navbar.Brand className = "teacher-title">Oral test Manager</Navbar.Brand>
            
        </Navbar>

        */


export default FirstPage;