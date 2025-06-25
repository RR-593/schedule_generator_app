import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import FrequencyWeek from "../PreiveiwSchedualComponents/HeaderGenerationOptionComponents/FrequencyWeek";

import EditableTextSpan from "./EditableTextSpan";
import logo1 from "../../Assests/Logo1.png";

import "../StyleSheets/CalanderHeaderSheet.css";

function CalanderHeader({ calendar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isPreview = location.pathname === "/preview";

  // const calanderObj = newCalanderEvent({ ...exerciseData });

  return (
    <div className="calenderHeader">
      <div className="row">
        <div className="backButton" style={isPreview ? { width: "unset" } : { width: "55px" }} onClick={() => navigate("/")}>
          {!isPreview ? (
            <img alt="Back Button" src={logo1} />
          ) : (
            <i className="fa fa-chevron-left" style={{ fontSize: "20px" }} aria-hidden="true"></i>
          )}
        </div>

        <div className="calenderName">
          <h2>
            <EditableTextSpan
              initialText={calendar.data.name}
              onSave={(newName) => {
                calendar.data.name = newName;
                calendar.save();
              }}
            />
          </h2>
        </div>

        {!isPreview ? (
          <div className="previewCalenderButton">
            <span onClick={() => navigate("/preview")}>Preview</span>
          </div>
        ) : (
          <div className="syncCalenderButton">
            <span>Sync</span>
          </div>
        )}
      </div>
      {!isPreview ? (
        <></>
      ) : (
        <>
          <hr />
          <div className="row">
            <FrequencyWeek calendar={calendar} />
          </div>
        </>
      )}
    </div>
  );
}

export default CalanderHeader;
