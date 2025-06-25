import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CalanderHeader from "./ScheduleGeneratorFormComponents/CalanderHeader";
import fetchCalender from "../StanderdisedObjects/fetchCalender";
import newCalander from "../StanderdisedObjects/newCalander";

const CalenderCRUD = ({ children }) => {
  /**
   * React state hook for managing the current calendar object.
   *
   * @type {[ReturnType<typeof newCalander> | undefined, React.Dispatch<React.SetStateAction<ReturnType<typeof newCalander> | undefined>>]}
   */
  const [calendar, setcalendar] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalender(setcalendar, setLoading, 1);
  }, []);

  return loading ? (
    <p>Loading events...</p>
  ) : (
    <motion.div
      className="formBox"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      <CalanderHeader calendar={calendar} />
      {children}
    </motion.div>
  );
};

export default CalenderCRUD;
