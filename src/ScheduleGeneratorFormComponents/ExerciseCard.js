import React, { useState } from "react";
import EditableTextSpan from "./EditableTextSpan";
import "../StyleSheets/ExerciseCard.css";

const ExerciseCard = ({ excerciseId = 0, escerciseTitle = '', resSet = '' }) => {
  const [eTitle, setETitle] = useState(escerciseTitle.trim() !== '' ? escerciseTitle : 'excercsie');
  const [eRepSet, setERepSet] = useState(resSet.trim() !== '' ? resSet : 'n×n or just n ...');

  const dbFns = window.db.dataBaseFns();

  // const dbFns = window.db.dataBaseFns();
  const handleTitleSave = (data) => {
    setETitle(data);
    saveData({ name: data })
  }

  const handleRepSetSave = (data) => {
    setERepSet(data);
    saveData({ rep_set: data })
  }

  const saveData = (data) => {

    let name = 'name' in data ? data.name : eTitle
    let rep_set = 'rep_set' in data ? data.rep_set : eRepSet


    console.log(data);

    excerciseId = 1;

    const eventsJSON = localStorage.getItem('currentCalenderEvents');
    const events = eventsJSON ? JSON.parse(eventsJSON) : [];

    if (events.length > 0) {
      const existingIds = events.map(event => event.id);
      while (existingIds.includes(excerciseId)) excerciseId++;
    }


    const params = { id: excerciseId, name: name, start: 0, end: 0, rep_set: rep_set, notes: '', flags: '' }

    events.push(params)
    localStorage.setItem('currentCalenderEvents', JSON.stringify(events));
    dbFns.insertInto({ tableName: 'events', data: params });



    console.log(excerciseId);
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
            <EditableTextSpan initialText={eTitle} onSave={handleTitleSave} />
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
