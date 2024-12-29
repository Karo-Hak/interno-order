import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { addPayed } from '../../strechCeining/features/debetKredit/debetKreditApi';
import { addCoopPayed } from '../../strechCeining/coopStretch/features/coopDebetKredit/coopDebetKreditApi';


const AddPayment: React.FC<any> = (type: any) => {
    const [sum, setSum] = useState<number | string>('');
    const [showInput, setShowInput] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const params = useParams()


    const handleConfirmation = () => {
        if (type.type === "tag") {
            {
                const sum = window.prompt()
                const sumToSend: number = typeof sum === 'string' ? parseFloat(sum) : sum || 0;
                if (sumToSend === 0) {
                    alert("0 chi karox linel")

                } else {
                    dispatch(addPayed({ cookies, params, sum: sumToSend })).unwrap().then(res => {
                        if ("error" in res) {
                            alert(res.error)
                        }
                    });
                }
            };
        } else if (type.type === "coop") {
            {
                const sum = window.prompt()
                const sumToSend: number = typeof sum === 'string' ? parseFloat(sum) : sum || 0;
                if (sumToSend === 0) {
                    alert("0 chi karox linel")
                } else {
                    dispatch(addCoopPayed({ cookies, params, sum: sumToSend })).unwrap().then(res => {
                        if ("error" in res) {
                            alert(res.error)
                        }
                    });
                }
            };
        }

    }

    return (
        <div>
            <button onClick={handleConfirmation}>Կատարել Վճարում</button>
        </div>
    );

}

export default AddPayment
