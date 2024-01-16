import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getAllStretchTexture } from '../../strechTexture/strechTextureApi';
import { useCookies } from 'react-cookie';
import { viewNewOrders } from '../../stretchCeilingOrder/stretchOrderApi';
import { selectStretchOrder } from '../../stretchCeilingOrder/stretchOrderSlice';


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
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }

    function editOrder(id: any) {
        window.open('/stretchceiling/editStretchOrder/' + id, '_blank');
        
    }


    return (
        <>
            <div className="profile">
                {
                    newOrders?.arrStretchOrder && newOrders.arrStretchOrder.length > 0 ?

                        <table className="table" style={{ color: "white" }}>
                            <thead>
                                <tr>

                                    <th scope="col">Գնորդ</th>
                                    <th scope="col">Հեռախես</th>
                                    <th scope="col">Հասցե</th>
                                    <th scope="col">Նկարագրություն</th>
                                    <th scope="col">Չափագրում</th>
                                    <th scope="col">Դիտել</th>


                                </tr>
                            </thead>
                            <tbody>
                                {
                                    newOrders.arrStretchOrder.map((e: any) => {
                                        return (
                                            <tr key={e._id}>
                                                <td>{e.buyer.buyerName}</td>
                                                <td>{e.buyer.buyerPhone}</td>
                                                <td>{e.buyer.buyerAddress}</td>
                                                <td>{e.buyerComment}</td>
                                                <td >{parseDate(e.measureDate)}</td>
                                                <td><button className="btn" onClick={() => editOrder(e._id)}>Դիտել</button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        :
                        <p></p>
                }
            </div>
        </>

    );
};

export default NewStretchOrderSection;
