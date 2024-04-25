import React, { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { allStretchWorker } from '../../features/StrechWorker/strechWorkerApi';
import OrderMaterialListSection from './BuyerDebetKreditSection';

interface DebetKreditSectionProps {
    ordersList: any;
    parseDate: any;
}

const DebetKreditSection: FC<DebetKreditSectionProps> = ({
    ordersList,
    parseDate
}: DebetKreditSectionProps) => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(allStretchWorker(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
    }, []);

    const [showOrderMaterialList, setShowOrderMaterialList] = useState<{ [key: string]: boolean }>(() => {
        const initialState: { [key: string]: boolean } = {};
        ordersList.forEach((order: any) => {
            initialState[order._id] = false;
        });
        return initialState;
    });


    const toggleOrderMaterialList = (orderId: string) => {
        setShowOrderMaterialList(prevState => ({
            ...prevState,
            [orderId]: !prevState[orderId]
        }));
    };

    const isOrderMaterialListVisible = (orderId: string) => {
        return showOrderMaterialList[orderId];
    };

    function viewOrder(id: any) {
        window.open('/stretchceiling/viewStretchOrder/' + id, '_blank');
    }

    return (
        <div>
            {ordersList.length > 0 && (
                <div>
                    <div className='newStretchOrderSection_head'>
                        <div className='newStretchOrderSection_head_name'>
                            Ձգվող առաստաղ (Դեբետ/Կրեդիտ)
                        </div>
                    </div>
                    <div className=''>
                        <div className=''>
                            <table className="newStretchOrders">
                                <thead>
                                    <tr>
                                       <th></th>
                                        <th>Անուն Ազգանուն</th>
                                        <th>Հեռախոս</th>
                                        <th>Դեբետ/Կրեդիտ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordersList.map((e: any) => (
                                        <React.Fragment key={e._id}>
                                            <tr>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!isOrderMaterialListVisible(e._id)}
                                                        onChange={() => toggleOrderMaterialList(e._id)}
                                                    />
                                                </td>
                                                <td><p>{e.buyerName}</p></td>
                                                <td>
                                                    <div style={{ display: "flex", border: "none", gap: "5px" }}>
                                                        <p style={{ minWidth: "100px" }}>{e.buyerPhone1}</p>
                                                    </div>
                                                </td>
                                                <td><p>{e.sumKredit}</p></td>
                                            </tr>
                                            {showOrderMaterialList[e._id] && <OrderMaterialListSection order={e.debetKredit} parseDate={parseDate} />}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebetKreditSection;
