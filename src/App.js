import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import TaskForm from './Components/ScheduleGeneratorFormComponents/TaskForm';
import CalendarEvents from './Components/UserCalanderComponents/CalendarEvents';
import PreviewTrainingSchedual from './Components/PreiveiwSchedualComponents/PreviewTrainingSchedual'
import CalenderCRUD from './Components/CalenderCRUD'
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <CalenderCRUD>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<TaskForm />} />
          <Route path="/appleCalendar" element={<CalendarEvents />} />
          <Route path="/preview" element={<PreviewTrainingSchedual />} />
        </Routes>
      </CalenderCRUD>
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
