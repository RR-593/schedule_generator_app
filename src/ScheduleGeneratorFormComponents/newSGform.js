import React, { useEffect, useState } from 'react';
import EditableTextSpan from './EditableTextSpan';
import '../StyleSheets/formSheet.css';
import ExerciseCard from './ExerciseCard';
// import $ from 'jquery';

const TaskForm = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);



  const fetchEvents = async () => {
    try {
      const dbFns = window.db.dataBaseFns();
      const result = await dbFns.selectAll('events');
      if (result.length > 0) {
        console.log(result);
        setEvents(result);
        localStorage.setItem('currentCalenderEvents', JSON.stringify(result));
      } else {
        console.log("No data found in the events table.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (newText) => {
    console.log('Saved text:', newText);
  };

  const handleNewEvent = () => {
    fetchEvents();
  };

  return (
    <div className='formBox'>
      <div className="formHeading">
        <EditableTextSpan onSave={handleSave} />
      </div>
      <div className='formBody'>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          [...events.map(event => (
            <ExerciseCard
              key={event.id}
              excerciseId={event.id}
              escerciseTitle={event.name}
              resSet={event.rep_set}
              onSave={handleNewEvent}
            />
          )), <ExerciseCard key={events.length+1} onSave={handleNewEvent} />]
        )}


      </div>
    </div>
  );
};

export default TaskForm;
