import React, { useState } from 'react';
import './modal.css'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { updatePrepayment } from '../../features/order/orderApi';
interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InputModal: React.FC<InputModalProps> = ({ isOpen, onClose }) => {
  const modalStyles = {
    display: isOpen ? 'block' : 'none',
    color: " rgba(255, 255, 255, .55)",
    transform: 'translate(100%, -100%)',
    width: '400px',
    padding: '20px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',

  };
  const [inputValue, setInputValue] = useState<number>();
  const dispatch = useAppDispatch()
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();
  const params = useParams()
  const [prepayment, setPrepayment] = useState<number>(0)

  const handleClose = () => {
    onClose();
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(+event.target.value);
  };

  const handleSave = () => {
    console.log(inputValue);

    dispatch(updatePrepayment({ params, cookies })).unwrap().then(res => {
      if ("error" in res) {
        // setCookie("access_token", '', { path: '/' })
        // navigate("/")
        alert(res)
      }
      window.location.reload()
    })
    onClose();
  };
  

  return (
    <div style={modalStyles} className='divModal'>
      <div className='cencel'>
        <h2>Վճարում</h2>
        <button className='btn' onClick={handleClose}>X</button>
      </div>
      <div>
        <label htmlFor="pay">Մուտք</label>
        <input type="number" id='pay' className="form-control selectFilter" onChange={handleInputChange} />
      </div>
      <button className='btn' onClick={handleSave}>Գրանցել</button>
    </div>
  );
};

export default InputModal;
