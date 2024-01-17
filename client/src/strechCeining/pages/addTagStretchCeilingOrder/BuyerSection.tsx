import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { allStretchBuyer } from '../../StrechBuyer/strechBuyerApi';
import { selectStretchBuyer } from '../../StrechBuyer/strechBuyerSlice';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './tagStretchCeilingOrder.css'

const BuyerSection: React.FC<any> = ({ register, setValue }: any) => {
    const dispatch = useAppDispatch();
    const stretchBuyer = useAppSelector(selectStretchBuyer);
    const [checkedBuyer, setCheckedBuyer] = useState(false);
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(allStretchBuyer(cookies)).unwrap().then(res => {
            if ('error' in res) {
                alert(res);
            }
        });
    }, []);

    function handleCheckboxBuyer(event: any) {
        setCheckedBuyer(event.target.checked);
    }
    useEffect(() => {
        if (checkedBuyer === false) {
            setValue("buyerId", "")
        }
    }, [checkedBuyer])


    function selectedBuyer(e: any) {
        const selectedBuyer = stretchBuyer.arrStretchBuyer.find((element: any) => element._id === e.target.value);
        setValue('buyerPhone', selectedBuyer.buyerPhone)
        setValue('buyerAddress', selectedBuyer.buyerAddress)
        setValue('buyerName', selectedBuyer.buyerName)
    }

    return (
        <div className="buyerStrech">
           
            <div className='buyer_Strech' >
                <div className='buyer_first_section'>
                <div className='buyer_head'>
                <div>
                    Գնորդ---
                </div>

                <div className='buyer_checkbox'>
                    <input type="checkbox" onChange={handleCheckboxBuyer} />
                    Ընտրել ցանկից
                </div>

                
            </div>
                    <div className='buyer_name_surname'>
                        {!checkedBuyer ? (
                            <div className="">
                                <div className="inputDiv">
                                    <label htmlFor="buyerPhone">Անուն Ազգանուն</label>
                                    <input id="buyerName" type="text" placeholder=" Buyer Name" {...register('buyerName', { required: true })} />
                                </div>
                            </div>
                        ) : (
                            <div className="">
                                <div className="inputDiv">
                                    <label htmlFor="selectCoop">Անուն Ազգանուն</label>
                                    <select id="selectCoop" {...register('buyerId', { required: true })} onChange={(event) => selectedBuyer(event)}>
                                        {stretchBuyer.arrStretchBuyer &&
                                            stretchBuyer.arrStretchBuyer.length > 0 ? (
                                            stretchBuyer.arrStretchBuyer.map((e: any) => {
                                                return (
                                                    <option key={e._id} value={e._id}>
                                                        {e.buyerName}
                                                    </option>
                                                );
                                            })
                                        ) : null}
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className="inputDiv">
                            <label htmlFor="buyerPhone">Հեռախես</label>
                            <input id="buyerPhone" className="inputNumber" type="string" placeholder=" Buyer Phone" name="buyerPhone"  {...register('buyerPhone', { required: true })} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="buyerAddress">Հասցե</label>
                            <input style={{ width: "300px" }} id="buyerAddress" type="text" placeholder="Buyer Address" {...register('buyerAddress', { required: true })} />
                        </div>
                    </div>

                    <section className="">
                        <div >Չափագրում</div>
                        <div className="">
                            <div className="input-group date" id="datepicker">
                                <input  type="date" className="buyer_date" id="date" {...register('measureDate')} />
                            </div>
                        </div>
                    </section>
                </div>



                <div className="buyer_comment">
                    <div>Նկարագրություն</div>
                    <textarea className="buyercomment" placeholder="Buyer Comment" {...register('buyerComment')} />
                </div>

            </div>
        </div>
    );
};

export default BuyerSection;
