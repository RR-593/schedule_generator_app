import React, { useState, useRef, useEffect } from 'react';
import '../StyleSheets/EditableTextSpan.css';

const EditableTextSpan = ({ initialText = 'New Training Schedule...', onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      handleFocus();
    }
  }, [isEditing]);

  const handleFocus = () => {
    inputRef.current.select();
  };

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text.trim() === "") onSave(initialText);
    else saveText();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { // Save on 'enter'
      setIsEditing(false);
      saveText();
    } else if (e.key === 'Escape') { // Revert changes on 'esc'
      setIsEditing(false);
      setText(initialText);
    }
  };

  const saveText = () => {
    // console.log(text);
    if (text === initialText) return;
    if (onSave) onSave(text);
    else console.error('onSave !== `function`');
  }

  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
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
