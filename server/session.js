class Session{
    constructor(courseId,date,startTime,duration,slotDuration,nSlots){
        this.courseId = courseId;
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
        this.slotDuration = slotDuration;
        this.nSlots = nSlots;
    }
}

module.exports = Session;