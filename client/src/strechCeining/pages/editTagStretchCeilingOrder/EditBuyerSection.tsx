import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { allStretchBuyer } from '../../StrechBuyer/strechBuyerApi';
import { selectStretchBuyer } from '../../StrechBuyer/strechBuyerSlice';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';


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

    function selectedBuyer(e: any) {
        const selectedBuyer = stretchBuyer.arrStretchBuyer.find((element: any) => element._id === e.target.value);
        setValue('buyerPhone', selectedBuyer.buyerPhone)
        setValue('buyerAddress', selectedBuyer.buyerAddress)
        setValue('buyerName', selectedBuyer.buyerName)
    }

    return (
        <div>

            <div className="buyer_head">
                <div className='buyer_name_cheack'>
                    <div className='buyer_head_name'> Գնորդ</div>
                    <input id="buyerCheckbox" type="checkbox" onChange={handleCheckboxBuyer} />
                    <label htmlFor="buyerCheckbox" > Լռացնել Ձեռքով </label>

                </div>
                <div className='buyer_info'>
                    {!checkedBuyer ? (

                        <div className="buyer_label label ">
                            <label htmlFor="buyerPhone">Անուն Ազգանուն</label>
                            <input id="buyerName" type="text" placeholder=" Buyer Name" {...register('buyerName', { required: true })} />

                        </div>
                    ) : (
                        <div >
                            <div className="buyer_label">
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
                    <div className="buyer_label">
                        <label htmlFor="buyerPhone">Հեռախես</label>
                        <input id="buyerPhone" className="inputNumber" type="string" placeholder=" Buyer Phone" name="buyerPhone"  {...register('buyerPhone', { required: true })} />
                    </div>
                    <div className="buyer_label">
                        <label htmlFor="buyerAddress">Հասցե</label>
                        <input style={{ width: "300px" }} id="buyerAddress" type="text" placeholder="Buyer Address" {...register('buyerAddress', { required: true })} />
                    </div>
                </div>
                <section className="buyer_date_info">
                    {/* <div className='section_chap'>Չափագրում</div> */}
                    <div className="buyer_date_time">
                        <div className="measureDate" id="datepicker">
                            <div className='measureDate'>Չափագրում</div>
                            <input type="date" className="measureDate" id="date" {...register('measureDate')} />
                        </div>
                    </div>
                    <div className="buyer_date_time_info">
                        <div>Նկարագրություն</div>
                        <textarea className="" placeholder="Buyer Comment" {...register('buyerComment')} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BuyerSection;
