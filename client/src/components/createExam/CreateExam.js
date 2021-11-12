import React from 'react';
import {Container,Row, Form,Button,Col,  Alert} from 'react-bootstrap';
import SelectStudents from './SelectStudents';
import SlotForm from './SlotForm';
import CreateSession from './CreateSession';
import {Redirect} from 'react-router-dom';
import moment from 'moment';
import API from '../../api/Api';
class CreateExam extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            submitted: false,
            countSelected :0,
            slotDuration: 0,
            showSessionForm: false,
            currentSlots: 0,
            newSessionNeeded: true,
            selectedInDb: 0,
            slotsInDb: 0
        }
    }

    componentDidMount(){
        let sel = this.props.students.filter((s) => s.selected).length;
        let nSlot = this.props.slots.length;
        console.log("selected and slots = " +sel+ " "+ nSlot);
        this.setState({selectedInDb : sel, slotsInDb : nSlot});
    }

    changeView = () =>{
        let lastView = this.state.showSessionForm;
        this.setState({showSessionForm : !lastView});
    }
    
    updateCurrentSlots = (newSlots) =>{
        console.log("newSlots = "+ newSlots);
        let newValue = this.state.currentSlots + newSlots;
        console.log("newValue = "+ newValue);
        this.setState({currentSlots: newValue });
        
        if(newValue >= this.state.countSelected){
            console.log("new number of slots = " + newValue);
            this.setState({newSessionNeeded : false});
        }
     
    }

    updateSelected = (selected,studentId) =>{
        let newValue = this.state.countSelected;
        if(selected){
            newValue+=1;
            this.setState({countSelected : newValue});
        }
        else{
            newValue-=1;
            this.setState({countSelected : newValue});
        }
        if(newValue > this.state.currentSlots){
            this.setState({newSessionNeeded : true});
        }
        this.props.changeSelected(studentId,selected);
       
    }

    updateSlotDuration = (value) =>{
        console.log("updating slot duration with "+ value);
        this.setState({slotDuration: value});
    }

    confirmSubmit = () =>{       
        this.props.update();
        this.setState({submitted : true});
    }

    getDifference = ()=>{
        return (this.state.countSelected-this.state.currentSlots);
    }

    saveSessionSlots = (session) =>{
        console.log("creating new slots in createExam");
        let call = moment(session.date + " " + session.startTime );
        console.log("nSlots = "+ session.nSlots);
         for(let i = 0; i < session.nSlots; i++){
            let startSlot = i * this.state.slotDuration;
            let newCall = moment(call).add(startSlot,'minutes');
            let dateAndTime = moment(newCall).format('YYYY-MM-DD HH:mm:ss');
           
            API.addSession(dateAndTime).then(() =>{                
                this.updateCurrentSlots(1);              
              }).catch((err) =>{
                this.updateCurrentSlots(0);              
                alert(err.msg);
                if(err.status === 401){
                  this.props.teacherLogout();
                }
              });
        }

       this.props.update();
    }
    

    render(){
       if(this.props.authTeacher === null){
            return <Redirect to = '/teacher/login' />
        } 
        if(this.state.submitted){
            return <Redirect to = {'/teacher/home'} />
        } 
        return (
            <>
           
            <Container fluid className = "below-nav"> 
            <Row>
               <Col>                
             
                <Form>
                    <Form.Label size="lg"><h4>Select the students that will take the oral exam</h4></Form.Label>
                    <Form.Group>
                        <SelectStudents students = {this.props.students} updateSelected = {this.updateSelected}/>                         
                    </Form.Group>
                    
                    <Form.Group controlId = "slotDuration">
                        <Form.Label size="lg"><h4>Define the duration of an oral exam (in minutes)</h4></Form.Label>
                        <SlotForm  updateSlotDuration = {this.updateSlotDuration} slotDuration= {this.state.slotDuration} />
                       
                    </Form.Group>

                </Form> 
                 <CreateSession slotDuration = {this.state.slotDuration} 
                                updateCurrentSlots = {this.updateCurrentSlots}
                                newSession = {this.props.newSession}
                                showSessionForm = {this.state.showSessionForm}
                                changeView = {this.changeView}
                                saveSessionSlots = {this.saveSessionSlots}/>  

              </Col>

              <Col>
                    <Alert key="students-slots-db" variant="danger">
                        <Alert.Heading>Number of students already selected {this.state.selectedInDb}</Alert.Heading>
                        <Alert.Heading>Number of slots already created: {this.state.slotsInDb}</Alert.Heading>

                    </Alert>
                    <Alert key="students-slots" variant="warning">
                        <Alert.Heading>Currently selected students: {this.state.countSelected}</Alert.Heading>
                        <Alert.Heading>Current number of available slots: {this.state.currentSlots}</Alert.Heading>
                        <Alert.Heading>Difference between currently selected students and new slots {this.getDifference()}</Alert.Heading>

                    </Alert>             

                    {!this.state.newSessionNeeded &&
                        <Button variant = "success" onClick = {() => this.confirmSubmit()}>Confirm exam</Button>
                    }
                          
              </Col>

            </Row>

            </Container>

            
            </>

        )
    }
}



export default CreateExam;

