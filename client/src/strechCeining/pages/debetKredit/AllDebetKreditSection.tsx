import React from 'react';
import { FC, useEffect, useState } from 'react';

interface AllDebetKreditSectionProps {
    ordersList: Array<object>;
}

const AllDebetKreditSection: FC<AllDebetKreditSectionProps> = ({
    ordersList,
}: AllDebetKreditSectionProps) => {

    const [rooms, setRooms] = useState<any>(() => {
        let initialState: any[] = [];
        ordersList.forEach((obj: { rooms?: object }) => {
            if (obj.rooms) {
                initialState = initialState.concat(Object.values(obj.rooms));
            }
        });
        return initialState;
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
                let existingItemIndex = newOrderSum[element.type].findIndex((item: any) => item.name === element.name);
                if (existingItemIndex === -1) {
                    newOrderSum[element.type].push({ "name": element.name, "quantity": element.quantity });
                } else {
                    newOrderSum[element.type][existingItemIndex].quantity = +newOrderSum[element.type][existingItemIndex].quantity + parseInt(element.quantity);
                }
            });
            setOrderSum(newOrderSum);
        }
    }, [orderObj]);
    

    return (
        <div style={{width:"50%", margin:"auto"}}>
            {ordersList &&
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
            }
        </div>
    );
};

export default AllDebetKreditSection;
