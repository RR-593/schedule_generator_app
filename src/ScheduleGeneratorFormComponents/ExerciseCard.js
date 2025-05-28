import React, { useState, useEffect } from "react";
import EditableTextSpan from "./edibleTextSapn";
import "../StyleSheets/ExerciseCard.css";

const ExerciseCard = ({ escerciseTitle = '', resSets = '' }) => {
  const [eTitle, setETitle] = useState('excercsie');
  const [eRepSet, setERepSet] = useState('n×n or just n ...');

  // const dbFns = window.db.dataBaseFns();

  useEffect(() => {
    if (escerciseTitle.trim() !== '') setETitle(escerciseTitle);
    if (resSets.trim() !== '') setERepSet(resSets);
  }, [escerciseTitle, resSets]);

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
            <EditableTextSpan initialText={eTitle} />
            <p> </p>
            <EditableTextSpan initialText={eRepSet} />
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
