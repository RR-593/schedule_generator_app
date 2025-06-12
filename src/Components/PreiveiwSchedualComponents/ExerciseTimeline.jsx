import React, { useState, useRef, useEffect } from "react";
import DisplayTrainingCard from "./DisplayTrainingCard";
import TimeMarkings from "./TimeMarkings";
// import newCalanderEvent from "../../StanderdisedObjects/newCalanderEvent";
import fetchEvents from "../../StanderdisedObjects/fectchEvents";
import { DateTime } from "luxon";

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

const ExerciseTimeline = ({ displayCardAmount = 12, timeInterval = 10 }) => {
  const [loading, setLoading] = useState(true);
  const [sData, setSData] = useState([]);
  const [bodyHeight, setBodyHeight] = useState(window.innerHeight);
  const [cardSlotHeight, setCardSlotHeight] = useState((bodyHeight - 40) / displayCardAmount);

  // console.log("bodyHeight: " + bodyHeight);
  // console.log("displayCardAmount: " + displayCardAmount);
  // console.log(cardSlotHeight);
  const startTime = DateTime.fromFormat("6:30 AM", "h:mm a");

  const myRef = useRef(null);

  // useEffect(() => {
  //   setCardSlotHeight(bodyHeight / displayCardAmount);
  // }, [displayCardAmount, bodyHeight]);

  useEffect(() => {
    if (!myRef.current) return;
    // const style = window.getComputedStyle(myRef.current);

    const y = myRef.current.getBoundingClientRect().top;
    const newHeight = window.innerHeight - y - 10;

    const usf = newHeight / displayCardAmount;

    setBodyHeight(newHeight);
    setCardSlotHeight(newHeight / displayCardAmount);

    fetchEvents((fetchedEvents) => {
      // setEvents(fetchedEvents);
      let st = startTime;
      st = st.plus({ minute: timeInterval });
      const numOfInBetweenCardSlotIntervals = 10;
      // let interval = 605000;

      const structuredData = fetchedEvents.map((item) => {
        let interval = item.total_time;

        // let hourDiff = (st.hour - startTime.hour) ;
        let minDiff = st.diff(startTime, "minute").minutes;

        // console.log(minDiff);

        let endTime = st.plus({ millisecond: interval });

        let startSpan = Math.floor((minDiff / timeInterval) * numOfInBetweenCardSlotIntervals) + 1;
        let span = Math.round((interval / 1000 / 60 / timeInterval) * numOfInBetweenCardSlotIntervals);

        // console.log(minDiff);

        item = { ...item, start: st.toFormat("h:mm a"), end: endTime.toFormat("h:mm a"), startPan: startSpan, span: span };

        st = st.plus({ millisecond: interval });
        const resultArr = Array.from({ length: (displayCardAmount - 1) * numOfInBetweenCardSlotIntervals - item.span + 1 }, (v, k) => k + 1).map(
          (arrayorder) => {
            return item.startPan === arrayorder
              ? {
                  ...item,
                  id: item.id + "",
                  height: item.span ? item.span * (usf / numOfInBetweenCardSlotIntervals) : usf,
                }
              : { id: arrayorder, height: usf / numOfInBetweenCardSlotIntervals };
          }
        );
        return resultArr;
      });

      console.log(structuredData);

      setSData(structuredData);
    }, setLoading);

    // eslint-disable-next-line
  }, []);

  return (
    <div ref={myRef} className="exerciseTimeline" style={{ height: `${bodyHeight}px` }}>
      {/* Time Labels */}
      {!loading && (
        <TimeMarkings startDate={startTime} displayCardAmount={displayCardAmount} cardHeight={cardSlotHeight} interval={timeInterval} />
      )}

      {!loading && sData.map((data, idx) => <DisplayTrainingCard key={idx} data={data} />)}
    </div>
  );
};

export default ExerciseTimeline;
