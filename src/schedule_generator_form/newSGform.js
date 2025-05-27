import React, { useState } from 'react';
import EditableTextSpan from './edibleTextSapn';

const TaskForm = () => {
  const [title, setTitle] = useState('');

  const handleSave = (newText) => {
    console.log('Saved text:', newText);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <EditableTextSpan onSave={handleSave} />
    </div>
  );
};

export default TaskForm;
