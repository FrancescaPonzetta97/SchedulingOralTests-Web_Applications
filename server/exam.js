class Exam{
    constructor(courseId,date,startTime,endTime,studentId,isPresent){
        this.courseId = courseId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.studentId = studentId;
        this.isPresent = isPresent;
    }
}

module.exports = Exam;