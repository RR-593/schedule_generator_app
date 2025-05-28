tell application "Calendar"
  set eventList to {}
  repeat with cal in calendars
    set eventList to eventList & (summary of every event of cal whose start date is greater than (current date))
  end repeat
  return eventList
end tell
