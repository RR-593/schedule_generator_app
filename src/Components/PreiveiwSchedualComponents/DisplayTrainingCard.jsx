import React, { useState } from "react";

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
          opacity: 0,
          zIndex:-1,
          pointerEvents: "none",
          backgroundColor: "white",
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      ></div>
    );
};

const DisplayTrainingCard = ({ data, cardHeight }) => {
  const [sessionData, setSessionData] = useState(data);
  const [activeId, setActiveId] = useState(null);
  const activeItem = sessionData.find((item) => item.id === activeId);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  return (
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
                height: item.height ?? cardHeight(),
              }}
              onResize={() => {}}
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
  );
};

export default DisplayTrainingCard;
