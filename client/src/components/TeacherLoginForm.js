import React from 'react';
import Form from 'react-bootstrap/Form';
import {Container, Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';


class TeacherLoginForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {username: '', password: '', submitted: false};
    }
    
    handleSubmit = (event, onLogin) =>{
        event.preventDefault();
        onLogin(this.state.username, this.state.password);
        this.setState({submitted:true});
    }

    inputUsername = (event) =>{
        this.setState({username: event.target.value});
    }

    inputPassword = (event) =>{
        this.setState({password : event.target.value});
    }

    render(){
        if(this.state.submitted && this.props.authTeacher !== null){
            return <Redirect to = '/teacher/home'/>;
        }
        return (
    
                <>
                   
                    <Container fluid>
                        <div className = "wrapper">
                            <div className = "form-wrapper">
                                <Form method = "POST" onSubmit = {(event) =>this.handleSubmit(event, this.props.login)}>
                                    <Form.Group controlId = "username">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type = "email" placeholder= "Username" value = {this.state.username} onChange = {(ev) =>this.inputUsername(ev)} required autoFocus />
                                    </Form.Group>

                                    <Form.Group controlId = "password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type = "password" name = "password" placeholder = "Password" value = {this.state.password} onChange = {(ev) => this.inputPassword(ev)} required />
                                    </Form.Group>
                        
                                    <Button className = "my-button" type = "submit">Login</Button>
                                </Form>
                                
                               
                                   
                            </div>
                    
                        </div>
                    </Container>
                </>
     

        );
    }
}


export default TeacherLoginForm;

