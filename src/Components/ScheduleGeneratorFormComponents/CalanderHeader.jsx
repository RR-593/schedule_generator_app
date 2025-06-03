import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

import EditableTextSpan from "./EditableTextSpan";
import logo1 from "../../Assests/Logo1.png";

import "../StyleSheets/CalanderHeaderSheet.css";

function CalanderHeader() {
  // const calanderObj = newCalanderEvent({ ...exerciseData });

  const [isPreview, setIsPreview] = useState(true);
  return (
    <div className="calenderHeader">
      <div className="row">
        <div className="backButton">
          {/*onClick={() => navigate("/appleCalendar")}*/}
          <img alt="Back Button" src={logo1} />
        </div>

        <div className="calenderName">
          <h2>
            <EditableTextSpan />
          </h2>
        </div>

        {isPreview ? (
          <div className="previewCalenderButton">
            <span>Preview</span>
          </div>
        ) : (
          <div className="syncCalenderButton">
            <span>Sync</span>
          </div>
        )}
      </div>
      <hr/>
      <div className="row">

      </div>
    </div>
  );
}

export default CalanderHeader;
