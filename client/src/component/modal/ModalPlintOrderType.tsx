import React, { ReactEventHandler, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import './modal.css'

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalPlintOrderType: React.FC<InputModalProps> = ({ isOpen, onClose }) => {
  const modalStyles = {
    display: isOpen ? 'block' : 'none',
    color: " rgba(255, 255, 255, .55)",
    transform: 'translate(-200%)',
    width: '400px',
    padding: '20px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',

  };
  const [status, setStatus] = useState("")

  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();
  const handleClose = () => {
    onClose();
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedStatus = event.currentTarget.value;
    setStatus(selectedStatus);
  };



  const handleSave = () => {
    if (status === "retail") {
      navigate("/plint/plintRetailOrder")
    } else if (status === "wholesale") {
      navigate("/plint/plintWholesaleOrder")
    } else (
      alert("Ընտրեք")
    )
    onClose();
  };


  return (
    <div style={modalStyles} className='divModal'>
      <div className='cencel'>
        <h2>Վաճառքի տեսակ</h2>
        <button className='btn' onClick={handleClose}>X</button>
      </div>
      <div>
        <select
          style={{ border: "1px solid black" }}
          id="status"
          onChange={handleSelectChange}
        >
          <option value={""}>Ընտրեք Տեսակը</option>
          <option value={"retail"}>Մանրածախ</option>
          <option value={"wholesale"}>Մեծածախ</option>
        </select>

        <button className='btn' onClick={handleSave}>Գրանցել</button>
      </div>
    </div>
  );
};

export default ModalPlintOrderType;
