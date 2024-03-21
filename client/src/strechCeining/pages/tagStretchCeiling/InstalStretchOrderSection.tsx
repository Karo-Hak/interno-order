import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { useCookies } from 'react-cookie';
import { viewNewInstalOrders } from '../../features/stretchCeilingOrder/stretchOrderApi';
import { useNavigate } from 'react-router-dom';


const InstalStretchOrderSection: React.FC<any> = () => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const [newInstalOrder, setNewInstalOrder] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stretchOrderResult = await dispatch(viewNewInstalOrders(cookies)).unwrap();
                handleResult(stretchOrderResult);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        const handleResult = (result: any) => {
            if ("error" in result) {
                alert(result);
                setCookie("access_token", "", { path: "/" });
                navigate("/");
            } else {
                processResult(result);
            }
        };

        const processResult = (result: any) => {
            if (result) {
                setNewInstalOrder(result)
            }
        };

        fetchData();
    }, []);


    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} - ${dateObj.getMonth() + 1} - ${dateObj.getFullYear()} `;
    }

    function viewOrder(id: any) {
        window.open('/stretchceiling/viewStretchOrder/' + id, '_blank');
    }

    return (
        <div>

            {
                newInstalOrder.length > 0 ?

                    <div>

                        <div className='newStretchOrderSection_head'>
                            <div className='newStretchOrderSection_head_name'>
                                Ձգվող առաստաղ (Տեղադրում)
                            </div>
                        </div>

                        <div className=''>
                            <div className=''>

                                <table className="newStretchOrders" >
                                    <thead >
                                        <tr className=' back_color' >
                                            <th style={{ width: "30px" }}>Կոդ </th>
                                            <th>Գրնցման/ԱԱ</th>
                                            <th>ԱԱ/սկիզբ</th>
                                            <th>ԱԱ/ավարտ</th>
                                            <th>Անուն Ազգանուն</th>
                                            <th>Մարզ</th>
                                            <th>Հասցե</th>
                                            <th>Հեռախոս</th>
                                            <th>Գումար</th>
                                            <th>Կանխավճար</th>
                                            <th>Մնացորդ</th>
                                            <th>Դիտել</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            newInstalOrder.map((e: any) => {
                                                return (
                                                    <tr key={e._id}>
                                                        <td>
                                                            <p
                                                                style={{
                                                                    width: "40px",
                                                                }}>
                                                                {e.code}
                                                            </p>
                                                        </td>
                                                        <td >
                                                            <p
                                                                style={{
                                                                    width: "100px"
                                                                }}>
                                                                {parseDate(e.date)}
                                                            </p>
                                                        </td>
                                                        <td >
                                                            <p
                                                                style={{
                                                                    width: "100px"
                                                                }}>
                                                                {
                                                                    e.measureDate ?
                                                                        parseDate(e.measureDate)
                                                                        : "---------"
                                                                }
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p
                                                                style={{
                                                                    width: "100px"
                                                                }}>
                                                                {
                                                                    e.installDate ?
                                                                        parseDate(e.installDate)
                                                                        : "---------"
                                                                }
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p
                                                                style={{
                                                                    minWidth: "160px"
                                                                }}>
                                                                {e.buyer.buyerName}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p
                                                                style={{
                                                                    minWidth: "100px"
                                                                }}>
                                                                {e.buyer.buyerRegion}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p
                                                                style={{
                                                                    minWidth: "300px"
                                                                }}>
                                                                {e.buyer.buyerAddress}
                                                            </p>
                                                        </td>
                                                        <td >
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    border: "none",
                                                                    gap: "5px",
                                                                    width: "215px"
                                                                }}>
                                                                <p
                                                                    style={{
                                                                        minWidth: "100px"
                                                                    }}>
                                                                    {e.buyer.buyerPhone1}
                                                                </p>
                                                                <p
                                                                    style={{
                                                                        minWidth: "100px"
                                                                    }}>
                                                                    {
                                                                        e.buyer.buyerPhone2 ?
                                                                            e.buyer.buyerPhone2
                                                                            : " ---------"
                                                                    }
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td >
                                                            <p
                                                                style={{
                                                                    minWidth: "80px"
                                                                }}>
                                                                {e.balance}
                                                            </p>
                                                        </td>
                                                        <td >
                                                            <p
                                                                style={{
                                                                    minWidth: "80px"
                                                                }}>{e.prepayment}</p>
                                                        </td>
                                                        <td >
                                                            <p
                                                                style={{
                                                                    minWidth: "80px"
                                                                }}>
                                                                {e.groundTotal}
                                                            </p>
                                                        </td>
                                                        <td >
                                                            <button
                                                                onClick={() => viewOrder(e._id)}
                                                            >
                                                                Ավելին
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div> : null
            }
        </div>

    );
};

export default InstalStretchOrderSection;
