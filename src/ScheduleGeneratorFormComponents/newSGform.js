import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import EditableTextSpan from './EditableTextSpan';
import '../StyleSheets/formSheet.css';
import ExerciseCard from './ExerciseCard';
import logo1 from '../Assests/Logo1.png';


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

/**
 * @typedef {Object} Event
 * @property {number} id - Unique identifier for the event
 * @property {string} name - Name of the exercise/event
 * @property {string} rep_set - Reps and sets string for the exercise
 */

/**
 * @param {{ event: Event, onSave: () => void }} props
 */
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
  const navigate = useNavigate();

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
      if (event.item_order !== index)
        dbFns.updateRow({
          tableName: 'events',
          data: { item_order: index },
          where: { id: event.id }
        });
    });
  };

  const handleSave = (newText) => {
    console.log('Saved text:', newText);
  };

  const handleNewEvent = () => {
    fetchEvents();
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
    <motion.div
      className="formBox"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      <div className='navBar'>
        <div className='backButton' onClick={() => navigate('/appleCalendar')}>
          <img alt='Back Button' src={logo1} />
        </div>
        <div className="formHeading">
          <h2>
            <EditableTextSpan onSave={handleSave} />
          </h2>
        </div>
      </div>

      <div className='formBody'>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext key={getUniqueKey()} items={events.map(e => e.id.toString())} strategy={verticalListSortingStrategy}>
              {events.map(event => (
                <SortableExerciseCard key={getUniqueKey(event.id)} event={event} onSave={handleNewEvent} />
              ))}
            </SortableContext>
          </DndContext>
        )}
        <ExerciseCard key={getUniqueKey()} onSave={handleNewEvent} />
      </div>
    </motion.div>
  );
};

export default TaskForm;
