import React, { useEffect, useState } from 'react';
import EditableTextSpan from './EditableTextSpan';
import '../StyleSheets/formSheet.css';
import ExerciseCard from './ExerciseCard';

const TaskForm = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchEvents();
  }, []);

  const handleSave = (newText) => {
    console.log('Saved text:', newText);
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
          events.length > 0 ? (
            events.map(event => (
              <ExerciseCard
                key={event.id}
                excerciseId={event.id}
                escerciseTitle={event.name}
                resSet={event.notes}
              />
            ))
          ) : (<></>
          )

        )}
        <ExerciseCard />
      </div>
    </div>
  );
};

export default TaskForm;
