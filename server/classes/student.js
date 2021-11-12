class Student{
    constructor(studentId,name,surname,selected){
        this.studentId = studentId;
        this.name = name;
        this.surname = surname;
        if(selected === 1){
            this.selected = true;
        }else{
            this.selected = false;
        }
    }
}

module.exports = Student;