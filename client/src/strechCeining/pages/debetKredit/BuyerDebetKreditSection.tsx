import React, { FC, useEffect, useState } from 'react';
import { findDebetByBuyer } from '../../features/debetKredit/debetKreditApi';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../../app/hooks';
import DeleteCredit from '../../../component/confirmButten/DeleteCredit';

interface OrderDebetKreditListProps {
    order: any;
    parseDate: any;
}

interface DebetKreditData {
    _id: string;
    date: Date;
    type: string;
    amount: number;
    sumDebet: number;
    kredit: number;
    order: string;
    buyer: string;
}

const BuyerDebetKreditSection: FC<OrderDebetKreditListProps> = ({
    order,
    parseDate
}: OrderDebetKreditListProps) => {

    const [kredit, setKredit] = useState<number>(0);
    const [debet, setDebet] = useState<number>(0);


    useEffect(() => {
        let kredit = 0;
        let debet = 0;
        const uniqueBuyerIds = new Set<string>();
        order && order.forEach((element: DebetKreditData) => {
            uniqueBuyerIds.add(element.buyer);
            if (element.type === "Գնում") {
                kredit += element.amount;
            } else {
                debet += element.amount;
            }
        });
        setKredit(kredit);
        setDebet(debet);
    }, [order]);

    function viewOrder(id: string) {
        window.open('/stretchceiling/viewStretchOrder/' + id, '_blank');
    }

    return (
        <>
            {order &&
                <tr style={{ marginTop: "15px" }}>
                    <td colSpan={11}>
                        <div style={{ margin: "15px", border: "3px solid black", width: "500px" }}>
                            <div>
                                <div >
                                    <table className="tableName">
                                        <thead>
                                            <tr>
                                                <th>Ամսաթիվ</th>
                                                <th>Գնում</th>
                                                <th>Վճարում</th>
                                                <th>Դիտել</th>
                                                <th>Հեռացնել</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.map((element: DebetKreditData) => (
                                                <tr key={element._id}>
                                                    <td>{parseDate(element.date)}</td>
                                                    <td>{element.type === "Գնում" && element.amount}</td>
                                                    <td>{element.type === "Վճարում" && element.amount}</td>
                                                    <td>
                                                        <button type='button' className='btn' style={{ color: "black" }}
                                                            onClick={() => viewOrder(element.order)}>
                                                            Ավելին
                                                        </button>
                                                    </td>
                                                    <td>
                                                        {element.type !== 'Գնում' && (
                                                            <DeleteCredit
                                                                buyerId={element.buyer}
                                                                creditSum={element.amount}
                                                                creditDate={element.date?.toString()}
                                                                orderId = {element.order}
                                                            />

                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td>Ընդամենը ( )</td>
                                                <td>{kredit}</td>
                                                <td>{debet}</td>
                                                <td>{kredit - debet}</td>
                                            </tr>
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

export default BuyerDebetKreditSection;
