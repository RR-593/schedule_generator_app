import React, { useState, useRef, useEffect } from "react";
import DisplayTrainingCard from "./DisplayTrainingCard";


import CalanderHeader from "../ScheduleGeneratorFormComponents/CalanderHeader";
import "../StyleSheets/PreviewTrainingSchedual.css";

// Initial session data
const initialSessionData = [
  {
    id: "1",
    title: "Pull-Ups",
    reps: "10×10",
    start: "6:30 AM",
    end: "7:23 AM",
    note: "notes...",
    highlight: false,
    span: 7,
  },
  {
    id: "2",
    title: "Push-Ups",
    reps: "20×4",
    start: "7:23 AM",
    end: "7:38 AM",
    span: 4,
  },
  {
    id: "6",
    title: "Sit-Ups",
    reps: "20×4",
    start: "7:38 AM",
    end: "7:53 AM",
    span: 3,
  },
];

const createTimeSlots = (startTime, numOfMakrs = 12, interval = 10) => {
  const timeSlots = [];
  const start = new Date(`1970-01-01T${startTime}`);

  let time = start;
  while (numOfMakrs-- > 0) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
    timeSlots.push(formattedTime);
    time.setMinutes(time.getMinutes() + interval);
  }

  return timeSlots;
};

const TimeSlot = ({ label }) => (
  <div className="timeMark">
    <span>{label}</span>
    <hr />
  </div>
);

const SessionView = () => {
  const displayCardAmount = 8;
  const [bodyHeight, setBodyHeight] = useState(window.innerHeight);
  const cardHeight = () => bodyHeight / displayCardAmount;

  // const totalSpanCovered = initialSessionData.reduce((a, i) => a + i.span, 0);

  const sData = initialSessionData.map((item) => {
    const resultArr = Array.from(
      { length: (displayCardAmount - 1) * 5 - item.span },
      (v, k) => k + 1
    ).map((numberId) => {
      return item.id === numberId + ""
        ? {
            ...item,
            height: item.span ? item.span * (cardHeight() / 5) : cardHeight(),
          }
        : { id: numberId };
    });
    return resultArr;
  });

  const myRef = useRef(null);

  useEffect(() => {
    // console.log(myRef);
    if (myRef.current) {
      const style = window.getComputedStyle(myRef.current);
      const y = myRef.current.getBoundingClientRect().top;
      const newHeight =
        window.innerHeight -
        y -
        style.paddingBottom.slice(0, -2) -
        style.paddingTop.slice(0, -2);
      setBodyHeight(newHeight);
    }
  }, []);

  return (
    <>
      <CalanderHeader />
      <div
        ref={myRef}
        className="previewBody"
        style={{ height: `${bodyHeight}px` }}
      >
        {/* View Controls */}
        <div className="previewContols">
          <h2>Session 1</h2>
        </div>

        <div className="exerciseTimeline">
          {/* Time Labels */}
          <div className="timmings" style={{ gap: `${cardHeight() - 40}px` }}>
            {createTimeSlots("05:50", displayCardAmount, 30).map(
              (time, idx) => (
                <TimeSlot key={idx} label={time} />
              )
            )}
          </div>
          
          {sData.map((data,idx) => (
            <DisplayTrainingCard key={idx} data={data} cardHeight={cardHeight}/>
          ))}
        </div>
      </div>
    </>
  );
};

export default SessionView;
