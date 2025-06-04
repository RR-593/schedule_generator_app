import React, { useState, useRef, useEffect } from "react";
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
import { CSS } from "@dnd-kit/utilities";

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

const timeSlots = [
  "5:50 am",
  "6:00 am",
  "6:10 am",
  "6:20 am",
  "6:30 am",
  "6:40 am",
  "6:50 am",
  "7:00 am",
  "7:10 am",
  "7:20 am",
  "7:30 am",
  "7:40 am",
  "7:50 am",
  "8:00 am",
  "8:20 am",
];

const TimeSlot = ({ label }) => (
  <div className="timeMark">
    <span>{label}</span>
    <hr />
  </div>
);

// 🧱 Sortable Exercise Block
const ExerciseBlock = ({
  item,
  listeners,
  attributes,
  setNodeRef,
  transform,
  transition,
  onResize,
}) => {
  const cardRef = useRef(null);
  const [resizing, setResizing] = useState(false);

  const startResize = (e) => {
    e.preventDefault();
    setResizing(true);
    const startY = e.clientY;
    const startHeight = cardRef.current.offsetHeight;

    const handleMouseMove = (e) => {
      const newHeight = startHeight + (e.clientY - startY);

      // Snap height to nearest 40px
      const snappedHeight = Math.round(newHeight / 40) * 40;
      onResize(snappedHeight);
    };

    const stopResize = () => {
      setResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResize);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        cardRef.current = el;
      }}
      {...attributes}
      {...listeners}
      className={`exercise-block ${item.highlight ? "highlight" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        height: item.height ?? "80px",
      }}
    >
      <div className="exercise-block-header">
        <span>{item.title}</span>
        <span>{item.reps}</span>
      </div>
      <div className="exercise-block-time">
        🕒 {item.start} - {item.end}
      </div>
      {item.note && <div className="exercise-block-note">{item.note}</div>}
      <div className="resize-handle" onMouseDown={startResize} />
    </div>
  );
};

// 📦 Make each block sortable
const SortableExercise = ({ item, onResize }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <ExerciseBlock
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
            {timeSlots.map((time, idx) => (
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
