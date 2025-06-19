import React, {useState, useEffect} from 'react';
import { motion } from "framer-motion";
import CalanderHeader from "./ScheduleGeneratorFormComponents/CalanderHeader";
import fetchCalender from "../StanderdisedObjects/fetchCalender";

const CalenderCRUD = ({ children }) => {
  const [calendar, setcalendar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalender(setcalendar, setLoading);
  }, []);

  return (
    <motion.div
      className="formBox"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      <CalanderHeader />
      {children}
    </motion.div>
  );
};

export default CalenderCRUD;
