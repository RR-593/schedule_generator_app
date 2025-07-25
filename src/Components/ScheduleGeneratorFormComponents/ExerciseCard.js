import React, { useState } from "react";
import EditableTextSpan from "./EditableTextSpan";
import "../StyleSheets/ExerciseCard.css";
import newCalanderEvent from "../../StanderdisedObjects/newCalanderEvent"
import getExerciseDefaultRepTime from "../../StanderdisedObjects/getExerciseDefaultRepTime"

const ExerciseCard = ({ exerciseData = { id: 0 }, onSave, newCard = false }) => {
  const eventObj = newCalanderEvent({ ...exerciseData });

  const [calEvent, setcalendarEvent] = useState({ ...eventObj.data });

  const dbFns = window.db.dataBaseFns();

  const patterns = [
    {
      regex: /^(\d+)x(\d+)$/,
      replacer: ([, reps, sets]) => `${reps} reps x ${sets} sets`
    },
    {
      regex: /^(\d+)$/,
      replacer: ([, reps]) => `${reps} reps`
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
    if (data === calEvent.name) return;
    let repT = getExerciseDefaultRepTime(data)
    console.log(repT);
    saveData({ name: data, rep_time: repT })
  }

  const handleRepSetSave = (data) => {
    data = formatExercise(data);
    if (data === calEvent.rep_set) return;
    saveData({ rep_set: data })
  }

  const handleNotesSave = (e) => {
    let data = e.target.value.trim();
    if (data === '') return;
    saveData({ note: data })
  }

  const saveData = (data) => {
    eventObj.data = { ...eventObj.data, ...data };
    eventObj.saveEvent();

    setcalendarEvent({ ...eventObj.data })

    if (typeof onSave === 'function') onSave();
    else console.error('onSave !== `function`');

  }


  // styles that are applied to the svg element
  const iconStyles = {
    width: "12px",
    height: "12px",
    viewBox: "0 0 12 12",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  // styles that are applied to the ICON svg element
  const hoverStyles = {
    className: "controlButtonIcon",
  };

  const deleteData = () => {
    console.log('Deleting: ' + calEvent.id);
    dbFns.deleteRow({ tableName: 'events', where: { id: calEvent.id } });
    if (typeof onSave === 'function') onSave();
  }

  // helper component to help you understand
  const Icon = ({ children, ...props }) => <svg {...props}>{children}</svg>;


  return (
    <div className="exerciseCard">
      <div className="cardControls" hidden={newCard}>
        <div className="delete" onClick={deleteData}>
          <Icon {...iconStyles}>
            <circle cx="6" cy="6" r="6" fill="#aacbce" />
          </Icon>
          <Icon {...iconStyles} {...hoverStyles}>
            <path
              opacity="0.5"
              d="M6.70432 5.99957L8.85224 3.85634C8.9463 3.76227 8.99915 3.63467 8.99915 3.50163C8.99915 3.36859 8.9463 3.241 8.85224 3.14692C8.75818 3.05285 8.63061 3 8.49759 3C8.36456 3 8.23699 3.05285 8.14293 3.14692L6 5.29515L3.85707 3.14692C3.76301 3.05285 3.63544 3 3.50241 3C3.36939 3 3.24182 3.05285 3.14776 3.14692C3.0537 3.241 3.00085 3.36859 3.00085 3.50163C3.00085 3.63467 3.0537 3.76227 3.14776 3.85634L5.29568 5.99957L3.14776 8.14281C3.10094 8.18925 3.06378 8.24451 3.03842 8.30538C3.01306 8.36626 3 8.43156 3 8.49752C3 8.56347 3.01306 8.62877 3.03842 8.68965C3.06378 8.75052 3.10094 8.80578 3.14776 8.85222C3.19419 8.89905 3.24944 8.93622 3.31031 8.96158C3.37118 8.98694 3.43647 9 3.50241 9C3.56836 9 3.63365 8.98694 3.69452 8.96158C3.75539 8.93622 3.81063 8.89905 3.85707 8.85222L6 6.70399L8.14293 8.85222C8.18937 8.89905 8.24461 8.93622 8.30548 8.96158C8.36635 8.98694 8.43164 9 8.49759 9C8.56353 9 8.62882 8.98694 8.68969 8.96158C8.75056 8.93622 8.80581 8.89905 8.85224 8.85222C8.89906 8.80578 8.93622 8.75052 8.96158 8.68965C8.98694 8.62877 9 8.56347 9 8.49752C9 8.43156 8.98694 8.36626 8.96158 8.30538C8.93622 8.24451 8.89906 8.18925 8.85224 8.14281L6.70432 5.99957Z"
              fill="black"
            />
          </Icon>
        </div>
      </div>
      < div className={`card ${newCard?'newCard':''}`} > 
        <div className="details">
          <h3>
            <EditableTextSpan initialText={calEvent.name} onSave={handleTitleSave} />
          </h3>
          <p> </p>
          <EditableTextSpan initialText={calEvent.rep_set} onSave={handleRepSetSave} />
        </div>
        {/* <EditableTextSpan className="noteBox" initialText={eNote} onSave={handleNoteSave} /> */}
        <textarea
          placeholder="Notes..."
          value={calEvent.note}
          onChange={(e) => setcalendarEvent({ ...calEvent, note: e.target.value })}
          onBlur={(e) => handleNotesSave(e)}
        />
      </div>
    </div>
  );
};

export default ExerciseCard;
