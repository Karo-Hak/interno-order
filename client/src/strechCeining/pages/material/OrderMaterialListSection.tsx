import React from 'react';
import { FC, useEffect, useState } from 'react';

interface OrderMaterialListProps {
    order: any;
    parseDate: any;
}

const OrderMaterialListSection: FC<OrderMaterialListProps> = ({
    order,
    parseDate
}: OrderMaterialListProps) => {

    const [rooms, setRooms] = useState<any>(() => {
        let initialState: any = {}
        if (order.rooms && typeof order.rooms === "object") {
            initialState = Object.values(order.rooms);
        }
        return initialState
    });

    const [orderObj, setOrderObj] = useState<any>(() => {
        let initialState: any[] = [];
        if (rooms.length > 0) {
            rooms.forEach((order: any, index: number) => {
                for (const [elWork, valueWork] of Object.entries(order)) {

                    if (valueWork !== null && typeof valueWork === "object" && !Array.isArray(valueWork)) {
                        const initialObj: any = {}
                        initialObj[elWork] = valueWork
                        initialState.push(...Object.values(valueWork));
                    }
                }
            });
        }
        return initialState;
    });

    const [orderSum, setOrderSum] = useState<any>({});

    useEffect(() => {
        if (orderObj.length > 0) {
            const newOrderSum: any = {};
            orderObj.forEach((element: any) => {
                if (!newOrderSum[element.type]) {
                    newOrderSum[element.type] = [];
                }
                let existingItem = newOrderSum[element.type].find((item: any) => item.name === element.name);
                if (!existingItem) {
                    newOrderSum[element.type].push({ "name": element.name, "quantity": parseFloat(element.quantity) });
                } else {
                    const totalQuantity = (parseFloat(existingItem.quantity) * 100 + parseFloat(element.quantity) * 100) / 100;
                    existingItem.quantity = totalQuantity.toFixed(2); 
                }
            });
            setOrderSum(newOrderSum);
        }
    }, [orderObj]);

    return (
        <>
            {order &&
                <tr style={{ marginTop: "15px" }}>
                    <td colSpan={11}>
                        <div style={{ margin: "15px", border: "3px solid black",width:"500px" }}>
                            <div>
                                <div >
                                    <table className="tableName">
                                        <thead>
                                            <tr>
                                                <th>Տեսակ</th>
                                                <th>Անվանում</th>
                                                <th>Քանակ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(orderSum).length > 0 &&
                                                Object.entries(orderSum).map((el: any, index: number) => (
                                                    <React.Fragment key={index}>
                                                        {el[1].map((item: any, itemIndex: number) => (
                                                            <tr key={itemIndex}>
                                                                {itemIndex === 0 && <td rowSpan={el[1].length}>{el[0]}</td>}
                                                                <td>{item.name}</td>
                                                                <td>{item.quantity}</td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            }
        </>
    );
};

export default OrderMaterialListSection;
