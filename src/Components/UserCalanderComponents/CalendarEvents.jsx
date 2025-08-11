import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';

export default function CalendarEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    window.calendarAPI
      .getEvents()
      .then((res) => {
        console.log(res);
        setEvents(res)
      })
      .catch((err) => console.error("Calendar error:", err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Upcoming Apple Calendar Events</h2>
      {events.length === 0 ? (
        <p>No upcoming events or permission denied.</p>
      ) : (
        <ul>
          {events.map((event, i) => (
            <li key={i}>{event}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
