import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { addPayed } from '../../strechCeining/features/debetKredit/debetKreditApi';


const AddStretchPayment: React.FC<any> = (id: string) => {

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const params = useParams()


    const handleConfirmation = () => {

        const sum = window.prompt()
        const sumToSend: number = typeof sum === 'string' ? parseFloat(sum) : sum || 0;
        if (sumToSend === 0) {
            alert("0 chi karox linel")

        } else {
            dispatch(addPayed({ cookies, params: id, sum: sumToSend })).unwrap().then(res => {
                if ("error" in res) {
                    alert(res.error)
                }
            });
        }



    }

    return (
        <div>
            <button onClick={handleConfirmation}>Կատարել Վճարում</button>
        </div>
    );

}

export default AddStretchPayment
