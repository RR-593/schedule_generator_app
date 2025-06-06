import React, { useState, useRef, useEffect } from "react";
import DisplayTrainingCard from "./DisplayTrainingCard";
import TimeMarkings from "./TimeMarkings";
// import newCalanderEvent from "../../StanderdisedObjects/newCalanderEvent";
import fetchEvents from "../../StanderdisedObjects/fectchEvents";
import { DateTime } from "luxon";

import CalanderHeader from "../ScheduleGeneratorFormComponents/CalanderHeader";
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
  const [loading, setLoading] = useState(true);
  const [sData, setSData] = useState([]);
  const [bodyHeight, setBodyHeight] = useState(window.innerHeight);

  const displayCardAmount = 12;
  const cardHeight = () => (bodyHeight - 30) / displayCardAmount;
  const startTime = DateTime.fromFormat("6:30 AM", "h:mm a");

  const myRef = useRef(null);

  useEffect(() => {
    fetchEvents((fetchedEvents) => {
      // setEvents(fetchedEvents);
      let st = startTime;
      let interval = 60;

      const structuredData = fetchedEvents.map((item) => {
        st = st.plus({ minutes: interval });
        let hourDiff = (st.hour - startTime.hour) * 2;
        let minDiff = st.minute - startTime.minute;

        let endTime = st.plus({ millisecond: 315000 });

        console.log(endTime.toFormat("h:mm a"));
        item = { ...item, start: st.toFormat("h:mm a"), end: endTime.toFormat("h:mm a"), startPan: 5 * (hourDiff + minDiff) + 1, span: 4 * 2 };
        const resultArr = Array.from({ length: (displayCardAmount - 1) * 5 - item.span - 1 }, (v, k) => k + 1).map((arrayorder) => {
          return item.startPan === arrayorder
            ? {
                ...item,
                id: item.id + "",
                height: item.span ? item.span * (cardHeight() / 5) : cardHeight(),
              }
            : { id: arrayorder };
        });
        return resultArr;
      });

      setSData(structuredData);
      setLoading(false);
    }, setLoading);

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
      <CalanderHeader />
      <div ref={myRef} className="previewBody" style={{ height: `${bodyHeight}px` }}>
        {/* View Controls */}
        <div className="previewContols" style={{ height: "40px" }}>
          <h2>Session 1</h2>
        </div>

        <div className="exerciseTimeline">
          {/* Time Labels */}
          {!loading && <TimeMarkings startDate={startTime} displayCardAmount={displayCardAmount} cardHeight={cardHeight} />}

          {sData.map((data, idx) => (
            <DisplayTrainingCard key={idx} data={data} cardHeight={cardHeight} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SessionView;
