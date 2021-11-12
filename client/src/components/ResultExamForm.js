import React from 'react';
import {Form,Button} from 'react-bootstrap';
class ResultExamForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showWithdrawn: true,
            showMark: true,
            absent: false,
            mark: 0,
            withdrawn: false,
            failed:false,
        }
    }

    updateMark = (value) =>{
        console.log("mark = " + value);
        this.setState({mark: value});
    }

    updateField = (ev,name) =>{
        let lastValue = this.state[name];     
        this.setState({[name]: !lastValue});    
       
        if(name === 'absent'){
            this.updateWithdrawnView();
        }else if(name === 'withdrawn'){
            this.updateMarkView();
        }
    }

    handleSubmit =(ev)=>{
        ev.preventDefault();
        this.props.changeView();
        let result = '';
        if(this.state.absent){
            result = "absent";
        }else if(this.state.withdrawn){
            result = "withdrawn";
        }else{
            result = this.state.mark;
        }
        console.log("result = "+ result);
        this.props.registerMark(result);
    }

    updateWithdrawnView = ()=>{
        let current = this.state.showWithdrawn;
        this.setState({showWithdrawn: !current});
    }
    updateMarkView = ()=>{
        let current = this.state.showMark;
        this.setState({showMark: !current});
    }

    onChangeMark = (e)=>{
        this.setState({mark : e.target.value});
    }


    render(){

    if(this.props.showForm === false){
        return null;
    }else{
        return (
            <div className = {'jumbotron'}>
                <Form onSubmit = {(ev) => this.handleSubmit(ev)}>
                    <Form.Row>
                        <Form.Group controlId = "absent">
                           <Form.Check type = "checkbox" label = "Absent" id = "absent" name = "absent" defaultChecked = {this.state.absent} onChange = {(ev) => this.updateField(ev,ev.target.name)} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        {this.state.showWithdrawn && 
                        
                        <Form.Group>
                            <Form.Check type = "checkbox" label = "Withdrawn" id = "withdrawn" name = "withdrawn" checked = {this.state.withdrawn} onChange = {(ev) =>this.updateField(ev,ev.target.name)} />
                        </Form.Group>
                                             
                        }
                    </Form.Row>
                    <Form.Row>
                        {this.state.showWithdrawn && this.state.showMark &&
                            <Form.Group>
                                <Form.Label>Mark</Form.Label>
                                <div>
                                    <select id = "dropdown" onChange = {this.onChangeMark}>
                                        <option value = "0">Select mark:</option>
                                        <option value = "Fail">Fail</option>
                                        <option value = "18">18</option>
                                        <option value = "19">19</option>
                                        <option value = "20">20</option>
                                        <option value = "21">21</option>
                                        <option value = "22">22</option>
                                        <option value = "23">23</option>
                                        <option value = "24">24</option>
                                        <option value = "25">25</option>
                                        <option value = "26">26</option>
                                        <option value = "27">27</option>
                                        <option value = "28">28</option>
                                        <option value = "29">29</option>
                                        <option value = "30">30</option>
                                        <option value = "30L">30L</option>

                                    </select>
                                </div>
                            </Form.Group>
                        }
                        
                    </Form.Row>

                    <Button className = "my-button" type = "submit" >Submit</Button>
                </Form>
            </div>
        )
    }
}
}

export default ResultExamForm;

//<Form.Control type = "number" min = "0" max = "31" name= "mark" onChange = {(ev) =>this.updateMark(ev.target.value)}/>
