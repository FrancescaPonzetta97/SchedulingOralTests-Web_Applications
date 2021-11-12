import React from 'react';
import {Form} from 'react-bootstrap';

class SlotForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {submitted: false};
    }

    handleSubmit = (event) =>{
        event.preventDefault();
        this.setState({submitted : true});
    }

  
  
    render(){
        return (
            <>
               {!this.state.submitted &&
                   <Form.Control type = "number" min = "0" name = "slotDuration" value = {this.props.slotDuration} onChange = {(ev) =>this.props.updateSlotDuration(ev.target.value) } />

                }    
            </>
        )
    }
}
export default SlotForm;

