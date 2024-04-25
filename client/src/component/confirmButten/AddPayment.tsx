import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { addPayed } from '../../strechCeining/features/debetKredit/debetKreditApi';


const AddPayment: React.FC<any> = () => {
    const [sum, setSum] = useState<number | string>('');
    const [showInput, setShowInput] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const params = useParams()


    const handleConfirmation = () => {
        {
            const sum = window.prompt()
            const sumToSend: number = typeof sum === 'string' ? parseFloat(sum) : sum || 0; 
            dispatch(addPayed({ cookies, params, sum: sumToSend })).unwrap().then(res => {
                if ("error" in res) {
                    alert(res.error)
                }
            });
            

        };

    }

    return (
        <div>
            <button onClick={handleConfirmation}>Կատարել Վճարում</button>
        </div>
    );

}

export default AddPayment
