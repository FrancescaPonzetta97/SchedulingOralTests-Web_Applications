class Teacher{
    constructor(teacherId,name,surname,courseId,email,hash,courseDescription){
        if(teacherId){
            this.teacherId = teacherId;
        }
        this.name = name;
        this.surname = surname;
        this.courseId = courseId;
        this.email = email;
        this.courseDescription = courseDescription;
        this.hash = hash;
    }
}

module.exports = Teacher;