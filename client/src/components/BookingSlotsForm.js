import React from 'react';
import {Button,Form,Container,Col} from 'react-bootstrap';
import moment from 'moment';

class BookingSlotsForm extends React.Component{
   constructor(props){
       super(props);
       this.state = {submitted : false,
                    dateAndTime: '',
                };
   }

  
   handleSubmit = (event) =>{
    event.preventDefault();
    this.setState({submitted : true});
    console.log("submitted = "+ this.state.submitted);
    this.props.setBooked(this.props.student.studentId, this.props.courseId, this.state.dateAndTime);
    this.props.update();
    this.props.changeMode();
    this.setState({submitted : false});
    
  }

  setSelectedSlot = (dateAndTime) =>{
      this.setState({dateAndTime : dateAndTime});
  }
 
   render(){   
       if(!this.props.showForm){
          return null;
        }
        return (
            <>
           <Col>
            <Container fluid>
                <h5>Select the slot in which the exam will be taken</h5>
                {this.props.slots &&
                    <Form className = "slot-list" onSubmit = {(event) => this.handleSubmit(event)}>
                     {this.props.slots.map((s) => <SlotRow key = {s.dateAndTime} slot = {s}  setSelectedSlot = {this.setSelectedSlot} /> )}
                    
                    <Button className = "my-button" type="submit"> Confirm</Button>
                    </Form>

                }
            </Container>
            </Col>

            </>
        )
        
    }
    

}


function SlotRow(props){
    let {slot, setSelectedSlot} = props;

   const onChangeSelected = (dateAndTime) =>{
        setSelectedSlot(dateAndTime);
    }

    let date = moment(slot.dateAndTime).format('MMMM Do YYYY, h:mm:ss a');

    return (
        <>
            <Form.Group controlId = {slot.dateAndTime} className = "list-group-item">
                <Form.Check type = "radio" label = {date} id = "formHorizontalRadios" name = "formHorizontalRadios" onClick = {() => onChangeSelected(slot.dateAndTime)} />
            </Form.Group>
        </>
    )
}


export default BookingSlotsForm;