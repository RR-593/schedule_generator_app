import React, { useState, useRef, useEffect } from 'react';
import '../StyleSheets/EditableTextSpan.css';

const EditableTextSpan = ({ initialText = 'New Training Schedule...', onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(true);
    if (onSave) onSave(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (onSave) onSave(text);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setText(initialText); // Revert changes
    }
  };

  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span onClick={handleTextClick} style={{ cursor: 'pointer' }}>
          {text}
        </span>
      )}
    </>
  );
};

export default EditableTextSpan;
