import React, { useState, useRef, useEffect } from "react";
import ExerciseTimeCard from "./ExerciseTimeCard";

import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

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

// 📦 Make each block sortable
const SortableExercise = ({ item, onResize }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  if (transform) transform.scaleY = 1;

  if (item.title)
    return (
      <ExerciseTimeCard
        item={item}
        listeners={listeners}
        attributes={attributes}
        setNodeRef={setNodeRef}
        transform={transform}
        transition={transition}
        isDragging={isDragging}
        onResize={(newHeight) => onResize(item.id, newHeight)}
      />
    );
  else
    return (
      <div
        ref={(el) => {
          setNodeRef(el);
        }}
        {...listeners}
        {...attributes}
        style={{
          height: `${item.height / 5}px`,
          opacity: 0.2,
          backgroundColor: "white",
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      ></div>
    );
};

const SessionView = () => {
  const displayCardAmount = 8;
  const [bodyHeight, setBodyHeight] = useState(window.innerHeight);

  const totalSpanCovered = initialSessionData.reduce((a, i) => a + i.span, 0);
  const sData = Array.from(
    { length: (displayCardAmount - 1) * 5 - totalSpanCovered },
    (v, k) => k + 1
  ).map((numberId) => {
    let found = initialSessionData.find((item) => item.id === numberId + "");
    return found
      ? {
          ...found,
          height: found.span
            ? found.span * (bodyHeight / displayCardAmount / 5)
            : bodyHeight / displayCardAmount,
        }
      : { id: numberId };
  });

  const [sessionData, setSessionData] = useState(sData);
  const [activeId, setActiveId] = useState(null);
  const activeItem = sessionData.find((item) => item.id === activeId);

  const myRef = useRef(null);

  const handleResize = (id, newHeight) => {
    setSessionData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, height: newHeight } : item
      )
    );
  };

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    console.log(event.active);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
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
          <div
            className="timmings"
            style={{ gap: `${bodyHeight / displayCardAmount - 40}px` }}
          >
            {createTimeSlots("05:50", displayCardAmount, 30).map(
              (time, idx) => (
                <TimeSlot key={idx} label={time} />
              )
            )}
          </div>

          {/* Exercise Timeline */}
          <div className="timeCards">
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={sessionData.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {sessionData.map((item) => (
                  <SortableExercise
                    key={item.id}
                    item={{
                      ...item,
                      height: item.height ?? bodyHeight / displayCardAmount,
                    }}
                    onResize={handleResize}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeItem ? (
                  <ExerciseTimeCard item={activeItem} isOverlay={true} />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionView;
