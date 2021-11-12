class StudentBooking{
    constructor(courseId, courseDescription,booking,result,examState){
        this.courseId = courseId;
        this.courseDescription = courseDescription;
        this.booking = booking;
        this.result = result;
        this.examState = examState;
    }
}

module.exports = StudentBooking;