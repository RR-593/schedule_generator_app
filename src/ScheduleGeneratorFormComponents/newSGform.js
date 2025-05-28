import EditableTextSpan from './edibleTextSapn';
import '../StyleSheets/formSheet.css'
import ExerciseCard from './ExerciseCard';
import React, { useEffect } from 'react';

const TaskForm = () => {
  const dbFns = window.db.dataBaseFns();

  const handleSave = (newText) => {
    console.log('Saved text:', newText);
  };

  useEffect(() => {

    dbFns.selectAll('events')
      .then(result => {
        if (result.length > 0) {
          console.log(result);
          localStorage.setItem('currentCalenderEvents', JSON.stringify(result));
        } else {
          console.log("No data found in the events table.");
        }
      })
      .catch(error => {
        console.error(error); // This will run if the promise is rejected
      });

  }, [dbFns]);

  const ecards = () => {
    let cards = []
    const events = JSON.parse(localStorage.getItem('currentCalenderEvents'));
    if (events == null) return <ExerciseCard />

    for (let event of events){
      console.log(event);

      cards.push(<ExerciseCard key={event.id} escerciseTitle={event.name} resSets={event.notes} />)
    }
    return cards
  }

  return (
    <div className='formBox'>
      <div className="formHeading">
        <EditableTextSpan onSave={handleSave} />
      </div>
      <div className='formBody'>
        {ecards()}
      </div>
    </div>
  );
};

export default TaskForm;
