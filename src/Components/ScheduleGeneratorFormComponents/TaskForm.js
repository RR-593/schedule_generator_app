import React, { useEffect, useState } from 'react';
import '../StyleSheets/formSheet.css';
import ExerciseCard from './ExerciseCard';
import fetchEvents from '../../StanderdisedObjects/fectchEvents'


import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { CSS } from '@dnd-kit/utilities';


// Sortable ExerciseCard wrapper
const SortableExerciseCard = ({ event, onSave }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: event.id.toString()
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ExerciseCard
        exerciseData={{ ...event }}
        onSave={onSave}
      />
    </div>
  );
};

const TaskForm = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    fetchEvents(setEvents, setLoading);
  }, []);

  const handleNewEvent = () => {
    fetchEvents(setEvents, setLoading);
  };


  const reOrderEvents = () => {
    // console.log('reordering');
    const dbFns = window.db.dataBaseFns();
    const eventsJSON = localStorage.getItem('currentCalenderEvents');
    const storedeEvents = eventsJSON ? JSON.parse(eventsJSON) : [];

    storedeEvents.forEach((event, index) => {
      if (event.item_order !== index)
        dbFns.updateRow({
          tableName: 'events',
          data: { item_order: index },
          where: { id: event.id }
        });
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = events.findIndex(e => e.id.toString() === active.id);
    const newIndex = events.findIndex(e => e.id.toString() === over.id);
    const newEvents = arrayMove(events, oldIndex, newIndex);

    setEvents(newEvents);
    localStorage.setItem('currentCalenderEvents', JSON.stringify(newEvents));

    reOrderEvents();
  };

  let key = 0
  const getUniqueKey = (extraKey = 0) => {
    key = key + extraKey + 1;
    return Date.now() + key;
  }

  return (
    <div className='formBody'>
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
          <SortableContext key={getUniqueKey()} items={events.map(e => e.id.toString())} strategy={verticalListSortingStrategy}>
            {events.map(event => (
              <SortableExerciseCard key={getUniqueKey(event.id)} event={event} onSave={handleNewEvent} />
            ))}
          </SortableContext>
        </DndContext>
      )}
      <ExerciseCard key={getUniqueKey()} onSave={handleNewEvent} newCard={true}/>
    </div>
  );
};

export default TaskForm;
