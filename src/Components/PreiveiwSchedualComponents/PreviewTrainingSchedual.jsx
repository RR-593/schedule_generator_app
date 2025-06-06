import React, { useState, useRef, useEffect } from "react";
import DisplayTrainingCard from "./DisplayTrainingCard";
import { DateTime } from "luxon";

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
    span: 8,
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

const createTimeSlots = (startTime, numOfMarks = 12, interval = 10) => {
  const timeSlots = [];

  startTime = startTime.minus({ hours: 1, minutes: 30 });

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

const SessionView = () => {
  const displayCardAmount = 12;
  const [bodyHeight, setBodyHeight] = useState(window.innerHeight);
  const cardHeight = () => (bodyHeight - 30) / displayCardAmount;

  const parsedTimes = initialSessionData.map((t) => ({
    ...t,
    dt: DateTime.fromFormat(t.start, "h:mm a"),
  }));

  // Find the earliest time
  const startDate = parsedTimes.reduce((earliestSoFar, current) =>
    current.dt < earliestSoFar.dt ? current : earliestSoFar
  ).dt;

  // const totalSpanCovered = initialSessionData.reduce((a, i) => a + i.span, 0);

  const sData = initialSessionData.map((item) => {
    const resultArr = Array.from(
      { length: (displayCardAmount - 1) * 5 - item.span -1},
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
        <div className="previewContols" style={{ height: "40px" }}>
          <h2>Session 1</h2>
        </div>

        <div className="exerciseTimeline">
          {/* Time Labels */}
          <div className="timmings" style={{ gap: `${cardHeight() - 40}px` }}>
            {createTimeSlots(startDate, displayCardAmount, 30).map(
              (time, idx) => (
                <TimeSlot key={idx} label={time} />
              )
            )}
          </div>

          {sData.map((data, idx) => (
            <DisplayTrainingCard
              key={idx}
              data={data}
              cardHeight={cardHeight}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SessionView;
