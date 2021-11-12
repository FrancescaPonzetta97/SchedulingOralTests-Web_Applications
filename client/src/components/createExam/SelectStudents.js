import React from 'react';
import {Form,Table} from 'react-bootstrap';

class SelectStudents extends React.Component{
  constructor(props){
    super(props);
    this.state = {submitted: false};
  }

  handleSubmit = (event) =>{
    event.preventDefault();
    this.setState({submitted : true});
  }
 
  render(){
    
    return(
        <>      
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Enrolled students</th>
            </tr>
          </thead>
         
         <tbody>
          {this.props.students &&                 
              this.props.students.map((s) => <StudentItem key = {s.studentId} student = {s} updateSelected = {this.props.updateSelected} />)
          }    

         </tbody>
        
        
        </Table>        
        </>
    )
  }

}





function StudentItem(props){
  let {student, updateSelected} = props;

  const onChangeSelected = (ev) =>{
    console.log("selected = "+ student.selected);
    let selected;
      if(ev.target.checked){
          student.selected = true;
          selected = true;
      }else{
          student.selected = false;
          selected = false;
      }
      
      updateSelected(selected,student.studentId);
  }

  return(
      <>
          <tr>
            <td>
                <Form.Check type = "checkbox" label = {student.name + " " + student.surname + " " + student.studentId} checked = {student.selected} disabled = {student.selected} onChange = {(ev) => onChangeSelected(ev,student)} />
            </td>
          </tr>
      </>
  )
}


export default SelectStudents;

