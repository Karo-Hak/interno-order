import React, { ReactEventHandler, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { updateStatuse } from '../../strechCeining/features/stretchCeilingOrder/stretchOrderApi';
import './modal.css'

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalStretchStatus: React.FC<InputModalProps> = ({ isOpen, onClose }) => {
  const modalStyles = {
    display: isOpen ? 'block' : 'none',
    color: " rgba(255, 255, 255, .55)",
    transform: 'translate(100%, -100%)',
    width: '400px',
    padding: '20px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',

  };
  const [status, setStatus] = useState("")

  const dispatch = useAppDispatch()
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();
  const params = useParams()
  const handleClose = () => {
    onClose();
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedStatus = event.currentTarget.value;
    setStatus(selectedStatus);
  };
  


  const handleSave = () => {
    dispatch(updateStatuse({ params, status, cookies })).unwrap().then(res => {
      if ("error" in res) {
        setCookie("access_token", '', { path: '/' })
        navigate("/")
        alert(res)
      }
    })
    onClose();
  };


  return (
    <div style={modalStyles} className='divModal'>
      <div className='cencel'>
        <h2>Կարգավիճակ</h2>
        <button className='btn' onClick={handleClose}>X</button>
      </div>
      <div>
        <select
          style={{ border: "1px solid black" }}
          id="status"
          onChange={handleSelectChange}
        >
          <option value={"progress"}>Գրանցված</option>
          <option value={"measurement"}>Չափագրում</option>
          <option value={"installation"}>Տեղադրում</option>
          <option value={"dane"}>Ավարտված</option>
        </select>

      </div>
      <button className='btn' onClick={handleSave}>Գրանցել</button>
    </div>
  );
};

export default ModalStretchStatus;
