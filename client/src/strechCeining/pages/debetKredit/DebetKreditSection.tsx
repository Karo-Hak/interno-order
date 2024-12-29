import React, { FC, useState } from 'react';
import BuyerDebetKreditSection from './BuyerDebetKreditSection';
import AddPayment from '../../../component/confirmButten/AddPayment';
import AddStretchPayment from '../../../component/confirmButten/AddStretchPayment';

interface DebetKredit {
    type: string;
    amount: number;
}

interface Order {
    _id: string;
    buyerName: string;
    buyerPhone1: string;
    debetKredit: DebetKredit[];
    sumKredit: number;
    buy: number;
    payment: number;
    order:[]
}

interface DebetKreditSectionProps {
    ordersList: Order[];
    parseDate: (date: string) => string;
}

const DebetKreditSection: FC<DebetKreditSectionProps> = ({ ordersList, parseDate }) => {

    const type = "tage"

    const updatedOrdersList = ordersList.map(order => {
        let sumBuy = 0;
        let sumPayment = 0;
        order.debetKredit.forEach(e => {
            if (e.type === "Գնում") sumBuy += e.amount;
            else if (e.type === "Վճարում") sumPayment += e.amount;
        });
        return {
            ...order,
            buy: sumBuy,
            payment: sumPayment,
        };
    });

    const [showOrderMaterialList, setShowOrderMaterialList] = useState<{ [key: string]: boolean }>(() => {
        const initialState: { [key: string]: boolean } = {};
        ordersList.forEach((order: Order) => {
            initialState[order._id] = false;
        });
        return initialState;
    });

    const toggleOrderMaterialList = (orderId: string) => {
        setShowOrderMaterialList(prevState => ({
            ...prevState,
            [orderId]: !prevState[orderId],
        }));
    };

    const isOrderMaterialListVisible = (orderId: string) => {
        return showOrderMaterialList[orderId];
    };

    function viewOrder(id: string) {
        window.open('/stretchceiling/viewStretchOrder/' + id, '_blank');
    }
console.log(updatedOrdersList);

    return (
        <div>
            {ordersList.length > 0 && (
                <div>
                    <div className='newStretchOrderSection_head'>
                        <div className='newStretchOrderSection_head_name'>
                            Ձգվող առաստաղ (Դեբет/Կրեդիտ)
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
                                        <th>Գնում</th>
                                        <th>Վճարում</th>
                                        <th>Մնացորդ</th>
                                        <th>Մուտք</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {updatedOrdersList.map((e: Order) => (
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
                                                <td><p>{e.buy}</p></td>
                                                <td><p>{e.payment}</p></td>
                                                {
                                                    e.sumKredit <= 0 ?
                                                        <td style={{ backgroundColor: "lightgreen" }}>
                                                            <p>{e.sumKredit}</p>
                                                        </td>
                                                        :
                                                        <td style={{ backgroundColor: "red" }}>
                                                            <p>{e.sumKredit}</p>
                                                        </td>
                                                }
                                                <td><AddStretchPayment id={e.order} /></td>
                                            </tr>
                                            {showOrderMaterialList[e._id] && (
                                                <BuyerDebetKreditSection order={e.debetKredit} parseDate={parseDate} />
                                            )}
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
