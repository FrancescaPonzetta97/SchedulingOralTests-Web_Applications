import React from 'react';
import {Container, Form, Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';

class StudentAccessForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {username: '', submitted: false};
    }

    handleSubmit = (event) =>{
        event.preventDefault();
        console.log("student "+ this.state.username+ "is logging in");
        this.props.studentLogin(this.state.username);
        this.setState({submitted: true});
    }

    inputUsername = (event) =>{
        console.log("received studentId = "+ event.target.value);
        this.setState({username: event.target.value});
    }

    render(){
        
        if(this.state.submitted === true && this.props.authStudent !== null){
            return <Redirect to = '/student/home' />;
        }
        return (
            <>
                <Container fluid>
                    <div className = "wrapper">
                        <div className = "form-wrapper">
                            <Form method = "POST" onSubmit = {this.handleSubmit}>
                                <Form.Group controlId = "username">
                                    <Form.Label>Student ID</Form.Label>
                                    <Form.Control type = "text" placeholder= "Student ID" value = {this.state.username} onChange = {(ev) =>this.inputUsername(ev)} required autoFocus />
                                </Form.Group>
                                <Button className = "my-button" type = "submit">Login</Button>
                            </Form>
                        </div>
                    </div>
                </Container>


            </>
        )
    }
}


//                                <Link to = {`/student/home`}><Button variant = "primary" type = "submit">Login</Button></Link>

export default StudentAccessForm;