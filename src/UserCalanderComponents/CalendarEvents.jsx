import React, { useEffect, useState } from "react";

export default function CalendarEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    window.calendarAPI
      .getEvents()
      .then((res) => setEvents(res))
      .catch((err) => console.error("Calendar error:", err));
  }, []);

  return (
    <div>
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
    </div>
  );
}
