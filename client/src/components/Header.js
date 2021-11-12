import React from 'react';
import {NavLink} from 'react-router-dom';
import {Navbar,Nav} from 'react-bootstrap';
const Header = (props) =>{
    const getLinkHome = ()=>{
        if(props.isStudent){
            return "/student/home";
        }else if(props.isTeacher){
            return "/teacher/home";
        }else{
            return "/";
        }
    }
    const getLinkLog = () =>{
        if(props.isStudent){
            return "/student/login";
        }else if(props.isTeacher){
            return "/teacher/login";
        }
    }
    return(
        <>
        <Navbar className = "nav" expand = "lg">
            <Navbar.Brand>Oral test manager</Navbar.Brand>
            <Nav className = "mr-auto">
                <Nav.Link as = {NavLink} to = {getLinkHome()} >Home</Nav.Link>
            </Nav>            
            <Nav className = "ml-md-auto">
                {props.authUser &&
                <>
                    <Navbar.Brand> Welcome {props.authUser.name + " " + props.authUser.surname}</Navbar.Brand>
                    <Nav.Link as = {NavLink} to={getLinkLog()} onClick = {() => {props.logout()}}>Logout</Nav.Link>
                </>    
                }
            </Nav>

        </Navbar>

    </>

    )
}

export default Header;