import React from 'react';
import {Form,Button,Col} from 'react-bootstrap';

class CreateSession extends React.Component{
    constructor(props){
        super(props);           
        this.state = {
            startingDate: null, 
            startingTime: null,
            currentDuration: 0,
            errorDuration: false,
            };
    }

  
    handleSubmit = (ev) =>{
        ev.preventDefault();
        let newSlots = this.state.currentDuration / this.props.slotDuration;       
        const session = {
            "date": this.state.startingDate,
            "startTime": this.state.startingTime,
            "duration": this.state.currentDuration,
            "nSlots": newSlots,
        }
        this.props.saveSessionSlots(session);
        this.props.changeView();
              
    }




    updateDate = (value) =>{
        console.log("date = "+ value);
        this.setState({startingDate : value});
    }
    updateTime = (value) =>{
        console.log("starting time = "+ value);
        this.setState({startingTime : value});
    }
    updateDuration = (value)=>{
        console.log("duration = " + value);
        if(value%this.props.slotDuration !== 0){
            this.setState({errorDuration : true});
        }else{
            this.setState({errorDuration : false});
        }
        this.setState({currentDuration: value});
    }


    render(){
        if(!this.props.showSessionForm){
            return (
                <>
                <Col>
                <h4> Create a new exam session</h4>
                </Col>
                <Col>
                    <Button variant = "primary" onClick = {() => this.props.changeView()}>Add session</Button>
                </Col>
                   
                </>
            )
        }
        return (
            <>
            <Form method = "POST" onSubmit = {(ev) => this.handleSubmit(ev)}> 
                <Form.Label size="lg"><h4> Create a new exam session</h4></Form.Label>
           
                <Form.Group controlId = "start-date">
                    <Form.Label>Define the date of a session</Form.Label>
                    <Form.Control type = "date" label = "Date of the session" name = "startingDate"  onChange={(ev) => this.updateDate(ev.target.value)} required/>
                </Form.Group>
    
                <Form.Group controlId = "start-time">
                    <Form.Label>Define the starting time of a session</Form.Label>
                    <Form.Control type = "time" label = "Starting time" name = "startingTime"  onChange = {(ev) => this.updateTime(ev.target.value)} required/>
                </Form.Group>
    
                <Form.Group controlId = "duration-time">
                    <Form.Label>Define the duration of a session (multiple of the slot duration)</Form.Label>
                        <Form.Control type = "number" min = "0" step = {this.props.slotDuration} label = "Duration of a session" name = "durationSession"   onChange = {(ev => this.updateDuration(ev.target.value))} required/>
                </Form.Group>
            <Button type = "submit" variant= "primary" disabled = {this.state.errorDuration}>Confirm session</Button>
            </Form>

            </>
           
            
        )
    }
}


export default CreateSession;

