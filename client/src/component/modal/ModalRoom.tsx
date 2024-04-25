import React, { Dispatch, SetStateAction, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './modal.css';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRoom: React.Dispatch<React.SetStateAction<{ id: string; name: string; isChecked: boolean; sum: number }[]>>;
  room: { id: string; name: string; isChecked: boolean }[];
}

const ModalRoom: React.FC<InputModalProps> = ({ isOpen, onClose, setRoom, room }) => {
  const modalStyles = {
    display: isOpen ? 'block' : 'none',
    color: 'rgba(255, 255, 255, .55)',
    transform: 'translate(100%, -100%)',
    width: '400px',
    padding: '20px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const [inputValue, setInputValue] = useState<string>('');

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSave = () => {
    if (inputValue) {
      const newRoom = {
        id: uuidv4(),
        name: inputValue,
        isChecked: false,
        sum: 0
      };

      setRoom((prevRoom) => [...prevRoom, newRoom]);
      onClose();
    }
  };

  return (
    <div style={modalStyles} className='divModal'>
      <div className='cencel'>
        <h2>Անվանում</h2>
        <button type='button' className='btn' onClick={handleClose}>
          X
        </button>
      </div>
      <div>
        <input type='text' id='roomName' onChange={handleInputChange} />
      </div>
      <button className='btn' type='button' onClick={handleSave}>
        Գրանցել
      </button>
    </div>
  );
};

export default ModalRoom;
