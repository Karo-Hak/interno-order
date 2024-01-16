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
        <div className="formdivStretch">
            <div>
                Գնորդ---
                <label>
                    <input type="checkbox" onChange={handleCheckboxBuyer} />
                    Լռացնել Ձեռքով
                </label>
            </div>
            <div style={{ display: "flex" }} >
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
                            <label htmlFor="selectCoop">Անուն</label>
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
                    <label htmlFor="buyerAdress">Հասցե</label>
                    <input style={{ width: "300px" }} id="buyerAdress" type="text" placeholder="Buyer Address" {...register('buyerAddress', { required: true })} />
                </div>
                <div className="inputDiv">
                    <label htmlFor="commentOrder" style={{ margin: "0 0 0 30px" }}>Նկարագրություն</label>
                    <textarea id="commentOrder" className="orderComment" placeholder="Buyer Comment" {...register('buyerComment')} />
                </div>
                <section className="container">
                    <label htmlFor="date" className="col-1 col-form-label">Չափագրում</label>
                    <div className="col-5">
                        <div className="input-group date" id="datepicker">
                            <input type="date" className="form-control" id="date" {...register('measureDate')} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BuyerSection;
