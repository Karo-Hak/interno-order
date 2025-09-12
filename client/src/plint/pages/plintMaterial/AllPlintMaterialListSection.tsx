import React from 'react';
import { FC, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface AllPlintMaterialListProps {
    ordersList: Array<object>;
}

const AllPlintMaterialListSection: FC<AllPlintMaterialListProps> = ({ ordersList }: AllPlintMaterialListProps) => {
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
                const existingItemIndex = newOrderSum[element.type].findIndex(
                    (item: any) => item.name === element.name
                );
                if (existingItemIndex === -1) {
                    newOrderSum[element.type].push({ name: element.name, quantity: element.quantity });
                } else {
                    newOrderSum[element.type][existingItemIndex].quantity =
                        +newOrderSum[element.type][existingItemIndex].quantity +
                        parseInt(element.quantity);
                }
            });
            setOrderSum(newOrderSum);
        }
    }, [orderObj]);

    const exportToExcel = () => {
        const excelData: any[] = [];
        Object.entries(orderSum).forEach(([type, items]: any) => {
            items.forEach((item: any, index: number) => {
                excelData.push({
                    Տեսակ: index === 0 ? type : '',
                    Անվանում: item.name,
                    Քանակ: item.quantity,
                });
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Materials');

        XLSX.writeFile(workbook, 'materials_list.xlsx');
    };

    return (
        <div style={{ width: "50%", margin: "auto" }}>
            {ordersList && (
                <>
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
                                                {itemIndex === 0 && (
                                                    <td rowSpan={el[1].length}>{el[0]}</td>
                                                )}
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                        </tbody>
                    </table>
                    <button onClick={exportToExcel} style={{ marginTop: "20px" }}>
                         Excel
                    </button>
                </>
            )}
        </div>
    );
};

export default AllPlintMaterialListSection;
