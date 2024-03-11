import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getAllStretchTexture } from '../../features/strechTexture/strechTextureApi';
import { useCookies } from 'react-cookie';
import { viewNewOrders } from '../../features/stretchCeilingOrder/stretchOrderApi';
import { selectStretchOrder } from '../../features/stretchCeilingOrder/stretchOrderSlice';


const NewStretchOrderSection: React.FC<any> = ({ register, reset, setValue }: any) => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);



    useEffect(() => {

        dispatch(viewNewOrders(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate('/')
                alert(res)
            }
        })
    }, []);

    const newOrders = useAppSelector(selectStretchOrder);

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
                newOrders?.arrStretchOrder && newOrders.arrStretchOrder.length > 0 ?

                    <div>

                        <div className='newStretchOrderSection_head'>
                            <div className='newStretchOrderSection_head_name'>
                                Ձգվող առաստաղ պատվերներ
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
                                            newOrders.arrStretchOrder.map((e: any) => {
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


        // { <div className="admin_profile_strTable">
        //     {
        //         newOrders?.arrStretchOrder && newOrders.arrStretchOrder.length > 0 ?

        //             <table className="admin_profile_strech_table" >
        //                 <thead>
        //                     <tr>

        //                         <th scope="col">Գնորդ</th>
        //                         <th scope="col">Հեռախես</th>
        //                         <th scope="col">Հասցե</th>
        //                         <th scope="col">Նկարագրություն</th>
        //                         <th scope="col">Չափագրում</th>
        //                         <th scope="col">Դիտել</th>


        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {
        //                         newOrders.arrStretchOrder.map((e: any) => {
        //                             return (
        //                                 <tr key={e._id}>
        //                                     <td>{e.buyer.buyerName}</td>
        //                                     <td>{e.buyer.buyerPhone}</td>
        //                                     <td>{e.buyer.buyerAddress}</td>
        //                                     <td>{e.buyerComment}</td>
        //                                     <td >{parseDate(e.measureDate)}</td>
        //                                     <td><button className="btn btn1" onClick={() => viewOrder(e._id)}>Դիտել</button></td>
        //                                 </tr>
        //                             )
        //                         })
        //                     }
        //                 </tbody>
        //             </table>
        //             :
        //             <p></p>
        //     }
        // </div> }


    );
};

export default NewStretchOrderSection;
