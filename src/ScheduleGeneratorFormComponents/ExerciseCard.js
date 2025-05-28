import React from "react";
import "../StyleSheets/ExerciseCard.css";

const ExerciseCard = () => {
  return (
    <div className="container">
      {/* Pull-Ups Card */}
      <div className="card">
        <h2>Pull-Ups</h2>
        <p>10 reps x 10 sets</p>
        <p>(Twice a Week)</p>
        <textarea placeholder="Notes..." />
      </div>

      {/* Campus Board Card */}
      <div className="card">
        <h2>Campus board</h2>
        <input type="text" placeholder="Type 3×10 or 3 sets..." />
        <select>
          <option>Once a Week</option>
          <option>Twice a Week</option>
          <option>Three Times a Week</option>
        </select>
        <textarea placeholder="Notes..." />
      </div>

      {/* Generic Card */}
      <div className="card">
        <div className="input-row">
          <input type="text" placeholder="Input" />
        </div>
        <div className="input-row">
          <input type="text" placeholder="Set" />
          <input type="text" placeholder="Reps" />
        </div>
        <label>Repeat:</label>
        <select>
          <option>None</option>
          <option>Once</option>
          <option>Twice</option>
        </select>
        <textarea placeholder="Notes..." />
      </div>
    </div>
  );
};

export default ExerciseCard;
