import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';

interface PlintDoneProps {
    done?: boolean;
}

const PlintDone: React.FC<PlintDoneProps> = ({ done = false }) => {
    const [confirmed, setConfirmed] = useState<boolean>(done);

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const params = useParams()
console.log(params);

    const handleConfirmation = () => {
        const isConfirmed = window.confirm("Հաստատ !!!!?");
        if (isConfirmed) {
            setConfirmed(true);
            // dispatch(updatePlintDone({ cookies, params })).unwrap().then(res => {
            //     if ("error" in res) {
            //         alert(res.error)
            //     }
            // });
        }
    };

    return (
        <div>
            {!confirmed && (
                <button onClick={handleConfirmation}>Ավարտված</button>
            )}
            {confirmed && (
                <p style={{color:"green"}}>Ավարտված</p>
            )}
        </div>
    );
};

export default PlintDone;
