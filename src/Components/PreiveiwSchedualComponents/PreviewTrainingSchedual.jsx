import React, { useState, useRef, useEffect } from "react";
import ExerciseTimeCard from './ExerciseTimeCard'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

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
  },
  {
    id: "2",
    title: "Push-Ups",
    reps: "20×4",
    start: "7:23 AM",
    end: "7:38 AM",
  },
  {
    id: "3",
    title: "Sit-Ups",
    reps: "20×4",
    start: "7:38 AM",
    end: "7:53 AM",
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


// 📦 Make each block sortable
const SortableExercise = ({ item, onResize }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <ExerciseTimeCard
      item={item}
      listeners={listeners}
      attributes={attributes}
      setNodeRef={setNodeRef}
      transform={transform}
      transition={transition}
      onResize={(newHeight) => onResize(item.id, newHeight)}
    />
  );
};

const SessionView = () => {
  const [sessionData, setSessionData] = useState(initialSessionData);
  const [bodyHeight, setBodyHeight] = useState(window.innerHeight);
  const myRef = useRef(null);

  const handleResize = (id, newHeight) => {
    setSessionData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, height: newHeight } : item
      )
    );
  };

  useEffect(() => {
    console.log(myRef);
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sessionData.findIndex((i) => i.id === active.id);
      const newIndex = sessionData.findIndex((i) => i.id === over?.id);
      setSessionData((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

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
          <div className="timmings">
            {createTimeSlots("05:50", 12, 10).map((time, idx) => (
              <TimeSlot key={idx} label={time} />
            ))}
          </div>

          {/* Exercise Timeline */}
          <div className="timeCards">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sessionData.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="">
                  {sessionData.map((item) => (
                    <SortableExercise
                      key={item.id}
                      item={item}
                      onResize={handleResize}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionView;
