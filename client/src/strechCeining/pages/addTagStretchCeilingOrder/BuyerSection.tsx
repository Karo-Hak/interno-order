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
        setValue('buyerPhone1', selectedBuyer.buyerPhone1)
        setValue('buyerPhone2', selectedBuyer.buyerPhone2)
        setValue('buyerRegion', selectedBuyer.buyerRegion)
        setValue('buyerAddress', selectedBuyer.buyerAddress)
        setValue('buyerName', selectedBuyer.buyerName)
    }

    return (
        <div >
            <table className='buyerSectionName'>
                <thead>
                    <tr style={{ background: "#dfdce0" }}>
                        <th>Կոդ</th>
                        <th>ԱԱ/սկիզբ</th>
                        <th>ԱԱ/ավարտ</th>
                        <th>Անուն Ազգանուն/ <input id="buyerCheckbox" type="checkbox" onChange={handleCheckboxBuyer} /></th>
                        <th>Մարզ</th>
                        <th>Հասցե</th>
                        <th>Հեռախես</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <select  {...register('code')}>
                                <option>INT</option>
                                <option>TAG</option>
                            </select>
                        </td>
                        <td>
                            <input type="date" id="date" {...register('measureDate')} />
                        </td>
                        <td>
                            <input type="date" id="date" {...register('installDate')} />
                        </td>
                        <td>
                            {!checkedBuyer ? (
                                <input id="buyerName" type="text" placeholder=" Buyer Name" {...register('buyerName', { required: true })} />
                            ) : (
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
                            )}
                        </td>
                        <td>
                            <input id="buyerRegion" type="text" placeholder=" Buyer Region" {...register('buyerRegion', { required: true })} />
                        </td>
                        <td>
                            <input style={{ width: "300px" }} id="buyerAddress" type="text" placeholder="Buyer Address" {...register('buyerAddress', { required: true })} />
                        </td>
                        <td>
                            <div className='buyerPhone1_2'>
                                <input id="buyerPhone1" type="string" placeholder=" Buyer Phone" name="buyerPhone"  {...register('buyerPhone1', { required: true })} />
                                <input id="buyerPhone2" type="string" placeholder=" Buyer Phone" name="buyerPhone"  {...register('buyerPhone2')} />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BuyerSection;
