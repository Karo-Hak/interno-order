import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { updateStretchPayed } from '../../strechCeining/features/stretchCeilingOrder/stretchOrderApi';

interface ConfirmationButtonProps {
    payed?: boolean; // Optional prop
}

const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({ payed = false }) => {
    const [confirmed, setConfirmed] = useState<boolean>(payed);

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const params = useParams()

    const handleConfirmation = () => {
        const isConfirmed = window.confirm("Հաստատ !!!!?");
        if (isConfirmed) {
            setConfirmed(true);
            dispatch(updateStretchPayed({ cookies, params })).unwrap().then(res => {
                if ("error" in res) {
                    alert(res.error)
                }
            });
        }
    };

    return (
        <div>
            {!confirmed && (
                <button onClick={handleConfirmation}>Վճարված(Աշխատավարձ)</button>
            )}
            {confirmed && (
                <p style={{color:"green"}}>Վճարված</p>
            )}
        </div>
    );
};

export default ConfirmationButton;
