import React from 'react';
import { FC, useEffect, useState } from 'react';

interface AllCoopDebetKreditSectionProps {
    ordersList: Array<object>;
}

const AllCoopDebetKreditSection: FC<AllCoopDebetKreditSectionProps> = ({
    ordersList,
}: AllCoopDebetKreditSectionProps) => {


    const [orderSum, setOrderSum] = useState<any>({});

    useEffect(() => {
        if (ordersList.length > 0) {
            const newOrderSum: any = {};
            ordersList.forEach((element: any) => {
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
    }, [ordersList]);

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

export default AllCoopDebetKreditSection;
