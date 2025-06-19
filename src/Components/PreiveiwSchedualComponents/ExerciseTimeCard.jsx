import React, { useRef, useState } from "react";

import { CSS } from "@dnd-kit/utilities";

export default function ExerciseTimeCard({
  item,
  listeners,
  attributes,
  setNodeRef,
  transform,
  transition,
  onResize,
  isDragging,
  isOverlay = false,
}) {
  const cardRef = useRef(null);
  const [, setResizing] = useState(false);

  // console.log(item);

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

  // console.log(isOverlay);


  if (isOverlay)
    return (
      <div
        className="exercise-block"
        style={{
          height: item.height ?? "10px",
          left: "15px",
        }}
      >
        <div className="exercise-block-header">
          <span>{item.name}</span>
          <span>{item.rep_set}</span>
        </div>
        <div className="exercise-block-time">
          🕒 {item.start} - {item.end}
        </div>
        {item.note && <div className="exercise-block-note">{item.note}</div>}
      </div>
    );


  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        cardRef.current = el;
      }}
      {...attributes}
      {...listeners}
      className={`exercise-block`}
      style={{
        opacity: isDragging ? 0.3 : 1,
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? transition : "none",
        height: item.height ?? "80px",
      }}
    >
      <div hidden={isDragging}>
        <div className="exercise-block-header">
          <span>{item.name}</span>
          <span>{item.rep_set}</span>
        </div>
        <div className="exercise-block-time">
          🕒 {item.start} - {item.end}
        </div>
        {item.note && <div className="exercise-block-note">{item.note}</div>}
        <div className="resize-handle" onMouseDown={startResize} />
      </div>
    </div>
  );
}
