import React from 'react';
import {ListGroup, Button} from 'react-bootstrap';

function CourseItem(props){
    let {course} = props;

    return(
        <>
        <Button className = "my-button">{course.description}</Button>


        </>
    )

}