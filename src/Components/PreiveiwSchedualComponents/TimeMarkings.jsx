const createTimeSlots = (startTime, numOfMarks = 12, interval = 10) => {
  const timeSlots = [];

  startTime = startTime.minus({ hours: 1 });

  for (let i = 0; i < numOfMarks; i++) {
    timeSlots.push(startTime.toFormat("h:mm a"));
    startTime = startTime.plus({ minutes: interval });
  }

  return timeSlots;
};

const TimeSlot = ({ label }) => (
  <div className="timeMark">
    <span>{label}</span>
    <hr />
  </div>
);

const TimeMarkings = ({startDate,displayCardAmount,cardHeight}) => {
  return (
    <div className="timmings" style={{ gap: `${cardHeight() - 40}px` }}>
      {createTimeSlots(startDate, displayCardAmount, 30).map((time, idx) => (
        <TimeSlot key={idx} label={time} />
      ))}
    </div>
  );
};

export default TimeMarkings;


