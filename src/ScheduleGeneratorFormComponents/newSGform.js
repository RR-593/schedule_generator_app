import React, { useEffect, useState } from 'react';
import EditableTextSpan from './EditableTextSpan';
import '../StyleSheets/formSheet.css';
import ExerciseCard from './ExerciseCard';

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
        excerciseId={event.id}
        escerciseTitle={event.name}
        resSet={event.rep_set}
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
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const dbFns = window.db.dataBaseFns();
      const result = await dbFns.selectAll('events');
      if (result.length > 0) {
        setEvents(result);
        localStorage.setItem('currentCalenderEvents', JSON.stringify(result));
      } else {
        localStorage.removeItem('currentCalenderEvents');
        setEvents([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reOrderEvents = () => {
    // console.log('reordering');
    const dbFns = window.db.dataBaseFns();
    const eventsJSON = localStorage.getItem('currentCalenderEvents');
    const storedeEvents = eventsJSON ? JSON.parse(eventsJSON) : [];

    storedeEvents.forEach((event, index) => {
      dbFns.updateRow({
        tableName: 'events',
        data: { ...event, item_order: index },
        where: { id: event.id }
      });
    });
  };

  const handleSave = (newText) => {
    console.log('Saved text:', newText);
  };

  const handleNewEvent = () => {
    try {
      reOrderEvents();
    } catch (error) {
      console.log(error);
    } finally {
      fetchEvents();
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = events.findIndex(e => e.id.toString() === active.id);
    const newIndex = events.findIndex(e => e.id.toString() === over.id);
    const newEvents = arrayMove(events, oldIndex, newIndex);

    setEvents(newEvents);
    localStorage.setItem('currentCalenderEvents', JSON.stringify(newEvents));
    handleNewEvent();
  };

  let key = 0;
  const getUniqueKey = () => {
    return Date.now() + key++;
  }

  return (
    <div className='formBox'>
      <div className="formHeading">
        <h2>
          <EditableTextSpan onSave={handleSave} />
        </h2>
      </div>
      <div className='formBody'>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext key={getUniqueKey} items={events.map(e => e.id.toString())} strategy={verticalListSortingStrategy}>
              {events.map(event => (
                <SortableExerciseCard key={getUniqueKey + event.id} event={event} onSave={handleNewEvent} />
              ))}
            </SortableContext>
          </DndContext>
        )}
        <ExerciseCard key={getUniqueKey} onSave={handleNewEvent} />
      </div>
    </div>
  );
};

export default TaskForm;
