import React, { useState } from "react";
import EditableTextSpan from "./EditableTextSpan";
import "../StyleSheets/ExerciseCard.css";

const ExerciseCard = ({ excerciseId = 0, escerciseTitle = '', resSet = '', onSave }) => {
  const [eTitle, setETitle] = useState(escerciseTitle.trim() !== '' ? escerciseTitle : 'excercsie');
  const [eRepSet, setERepSet] = useState(resSet.trim() !== '' ? resSet : 'n×n or just n ...');

  const dbFns = window.db.dataBaseFns();

  const patterns = [
    {
      regex: /^(\d+)x(\d+)$/,
      replacer: ([, sets, reps]) => `${reps} reps x ${sets} sets`
    },
    {
      regex: /^(\d+)$/,
      replacer: ([, sets]) => `${sets} sets`
    },
    {
      regex: /^(\d+)\s*(x?w|w|week)$/i,
      replacer: ([, num]) => {
        const number = parseInt(num);
        if (number === 1) return "Once a week";
        if (number === 2) return "Twice a week";
        return `${number} Times a week`;
      }
    }
  ];

  const formatRepSet = (patterns) => {
    return function format(input) {
      for (const { regex, replacer } of patterns) {
        const match = input.match(regex);
        if (match) {
          return replacer(match);
        }
      }
      return input; // default return if no pattern matches
    };
  }

  const formatExercise = formatRepSet(patterns);

  const handleTitleSave = (data) => {
    setETitle(data);
    saveData({ name: data })
  }

  const handleRepSetSave = (data) => {
    data = formatExercise(data);
    setERepSet(data);
    saveData({ rep_set: data })
  }

  const saveData = (data) => {
    const eventsJSON = localStorage.getItem('currentCalenderEvents');
    const events = eventsJSON ? JSON.parse(eventsJSON) : [];

    let updatedEvents;
    let newId = 1;

    if (events.some(event => event.id === excerciseId)) {
      // Update existing event
      updatedEvents = events.map(event => event.id === excerciseId ? { ...event, ...data } : event);

      dbFns.updateRow({ tableName: 'events', data: updatedEvents.find(event => event.id === excerciseId), where: { id: excerciseId } });
    } else {
      const existingIds = events.map(event => event.id);
      while (existingIds.includes(newId)) newId++;

      const newEvent = {
        id: newId,
        name: data.name || eTitle,
        rep_set: data.rep_set || eRepSet,
        start: 0,
        end: 0,
        notes: '',
        flags: ''
      };

      updatedEvents = [...events, newEvent];
      dbFns.insertInto({ tableName: 'events', data: updatedEvents.find(event => event.id === newId) });
    }

    localStorage.setItem('currentCalenderEvents', JSON.stringify(updatedEvents));

    console.log(`Exercise ID: ${newId}`);

    if (typeof onSave === 'function') onSave();
  }

  return (
    <div className="container">
      {false ? (
        <div className="card"> {/* Pull-Ups Card */}
          <div className="details">
            <h3>Pull-Ups</h3>
            <p>10 reps x 10 sets</p>
            <p>(Twice a Week)</p>
          </div>
          <textarea placeholder="Notes..." />
        </div>
      ) : (
        < div className="card" > {/* Generic Card */}
          <div className="details">
            <h3>
              <EditableTextSpan initialText={eTitle} onSave={handleTitleSave} />
            </h3>
            <p> </p>
            <EditableTextSpan initialText={eRepSet} onSave={handleRepSetSave} />
            {/* <label>Repeat:</label>
            <select>
              <option>None</option>
              <option>Once</option>
              <option>Twice</option>
            </select> */}
          </div>
          <textarea placeholder="Notes..." />
        </div>
      )}

      {/* Campus Board Card */}
      {/* <div className="card">
        <div className="details">
          <h3>Campus board</h3>
          <input type="text" placeholder="Type 3×10 or 3 sets..." />
          <select>
            <option>Once a Week</option>
            <option>Twice a Week</option>
            <option>Three Times a Week</option>
          </select>
        </div>
        <textarea placeholder="Notes..." />
      </div> */}

    </div>
  );
};

export default ExerciseCard;
