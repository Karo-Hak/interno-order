import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { deletOrder, updateStretchPayed } from '../../strechCeining/features/stretchCeilingOrder/stretchOrderApi';

interface DeletOrderProps {

}

const DeletOrder: React.FC<DeletOrderProps> = () => {

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const params = useParams();
    const navigate = useNavigate();

    const handleConfirmation = () => {
        const isConfirmed = window.confirm("Հաստատ !!!!? Հեռացնելուց հետո անհնար կլինի վերականգնելը");
        if (isConfirmed) {
            dispatch(deletOrder({ cookies, params })).unwrap().then(res => {
                if ("error" in res) {
                    alert(res.error)
                }
            });
            navigate("/stretchceiling/viewStretchOrdersList")
        }
    };

    return (
        <div>
            <button onClick={handleConfirmation}>Հռացնել (Պատվերը)</button>
        </div>
    );
};

export default DeletOrder;
