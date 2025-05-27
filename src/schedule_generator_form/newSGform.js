import EditableTextSpan from './edibleTextSapn';
import '../StyleSheets/formSheet.css'

const TaskForm = () => {

  const handleSave = (newText) => {
    console.log('Saved text:', newText);
  };

  return (
    <div className='formBox'>
      <div className="formHeading">
        <EditableTextSpan onSave={handleSave} />
      </div>
      <div className='formBody'>
        <EditableTextSpan onSave={handleSave} />
      </div>
    </div>
  );
};

export default TaskForm;
