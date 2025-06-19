import React, { useState, useRef, useEffect } from "react";
import ExerciseTimeline from "./ExerciseTimeline";
import "../StyleSheets/PreviewTrainingSchedual.css";

// Initial session data
const initialSessionData = [
  {
    id: "1",
    title: "Pull-Ups",
    reps: "10x10",
    start: "6:30 AM",
    end: "7:30 AM",
    note: "notes...",
    highlight: false,
    total_time: 1800000,
    startPan: 5 * 3 + 1,
    span: 4 * 2,
  },
  {
    id: "2",
    title: "Push-Ups",
    reps: "20x4",
    start: "7:30 AM",
    end: "9:00 AM",
    total_time: 1800000,
    startPan: 5 * 5 + 1,
    span: 4 * 3,
  },
  {
    id: "6",
    title: "Sit-Ups",
    reps: "20x4",
    start: "9:30 AM",
    end: "10:00 AM",
    total_time: 1800000,
    startPan: 5 * 8 + 1,
    span: 4 * 3,
  },
];

if (initialSessionData) console.log();

const SessionView = () => {
  const [bodyHeight, setBodyHeight] = useState(window.innerHeight);

  const myRef = useRef(null);

  useEffect(() => {
    // console.log(myRef);
    if (myRef.current) {
      const style = window.getComputedStyle(myRef.current);
      const y = myRef.current.getBoundingClientRect().top;
      const newHeight = window.innerHeight - y - style.paddingBottom.slice(0, -2) - style.paddingTop.slice(0, -2);
      setBodyHeight(newHeight);
    }
  }, []);

  return (
    <>
      <div ref={myRef} className="previewBody" style={{ height: `${bodyHeight}px` }}>
        {/* View Controls */}
        <div className="previewContols" style={{ height: "40px" }}>
          <h2>Session 1</h2>
        </div>

        <ExerciseTimeline />
      </div>
    </>
  );
};

export default SessionView;
