import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import TaskForm from './Components/ScheduleGeneratorFormComponents/newSGform';
import CalendarEvents from './Components/UserCalanderComponents/CalendarEvents'; // <-- Create this page
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<TaskForm />} />
        <Route path="/appleCalendar" element={<CalendarEvents />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  localStorage.clear();

  return (
    <div className="App">
      <Router>
        <AnimatedRoutes />
      </Router>
    </div>
  );
}

export default App;
