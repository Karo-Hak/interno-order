import React, { FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { allStretchWorker } from '../../features/StrechWorker/strechWorkerApi';
import OrderMaterialListSection from './OrderMaterialListSection';

interface MaterialListSectionProps {
    ordersList: any;
    parseDate: any;
}

const MaterialListSection: FC<MaterialListSectionProps> = ({
    ordersList,
    parseDate
}: MaterialListSectionProps) => {
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
                            Ձգվող առաստաղ (Պատվերներ)
                        </div>
                    </div>
                    <div className=''>
                        <div className=''>
                            <table className="newStretchOrders">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Կոդ</th>
                                        <th>Գրնցման/ԱԱ</th>
                                        <th>ԱԱ/Տեղադրում</th>
                                        <th>Անուն Ազգանուն</th>
                                        <th>Հասցե</th>
                                        <th>Հեռախոս</th>
                                        <th>Գումար</th>
                                        <th>Աշխատակից</th>
                                        <th>Աշխատավարձ</th>
                                        <th>Դիտել</th>
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
                                                <td><p>{e.code}</p></td>
                                                <td><p style={{ width: "100px" }}>{parseDate(e.date)}</p></td>
                                                <td><p style={{ width: "100px" }}>{e.installDate ? parseDate(e.installDate) : "---------"}</p></td>
                                                <td><p>{e.buyer.buyerName}</p></td>
                                                <td><p style={{ minWidth: "300px" }}>{e.buyer.buyerRegion} {e.buyer.buyerAddress}</p></td>
                                                <td>
                                                    <div style={{ display: "flex", border: "none", gap: "5px" }}>
                                                        <p style={{ minWidth: "100px" }}>{e.buyer.buyerPhone1}</p>
                                                    </div>
                                                </td>
                                                <td><p style={{ minWidth: "80px" }}>{e.balance}</p></td>
                                                <td><p style={{ minWidth: "80px" }}>{e.stWorker ? e.stWorker.name : "---------"}</p></td>
                                                {
                                                    e.payed ?
                                                        <td><p style={{ minWidth: "80px", backgroundColor:"red" }}>{e.stWorker ? e.salary : "---------"}</p></td>

                                                        :
                                                        <td><p style={{ minWidth: "80px" }}>{e.stWorker ? e.salary : "---------"}</p></td>

                                                }
                                                <td><button onClick={() => viewOrder(e._id)}>Ավելին</button></td>
                                            </tr>
                                            {showOrderMaterialList[e._id] && <OrderMaterialListSection order={e} parseDate={parseDate} />}
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

export default MaterialListSection;
