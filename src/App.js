import TaskForm from './schedule_generator_form/newSGform';
import CustomTitleBar from './windowComponents/CustomTitleBar';
import './App.css';

function App() {
  return (
    <div className="App">
      <CustomTitleBar></CustomTitleBar>
      <TaskForm></TaskForm>
    </div>
  );
}

export default App;
