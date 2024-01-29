import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectBuyer } from '../../features/buyer/buyerSlice';
import { allBuyer } from '../../features/buyer/buyerApi';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";



const BuyerOrderSection: React.FC<any> = ({ register, setValue }: any) => {

    const dispatch = useAppDispatch();
    const buyer = useAppSelector(selectBuyer);
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const [checkedBuyer, setCheckedBuyer] = useState(false);





    useEffect(() => {
        dispatch(allBuyer(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
    }, [])

    function handleCheckboxBuyer(event: any) {
        setCheckedBuyer(event.target.checked);
    }
    useEffect(() => {
        if (checkedBuyer === false) {
            setValue("buyerId", "")
        }
    }, [checkedBuyer])


    function selectedBuyer(e: any) {
        const selectedBuyer = buyer.arrBuyer.find((element: any) => element._id === e.target.value);
        setValue('buyerPhone', selectedBuyer.phone)
        setValue('buyerAdress', selectedBuyer.adress)
        setValue('buyerName', selectedBuyer.name)

    }
console.log(buyer.arrBuyer);

    return (
    <div className='buyer_head'>

        <div className='buyer_name_cheack' >
            <div className='buyer_head_name'> Գնորդ</div>
            <div>
                <input id='buyerCheckbox' type="checkbox" onChange={handleCheckboxBuyer} />
                <label htmlFor="buyerCheckbox" >Ընտրել ցանկից </label>
            </div>
        </div>


        <div className='buyer_info'>
            {!checkedBuyer ? (
                <div className="buyer_label">
                    <label htmlFor="buyerName">Անուն</label>
                    <input id="buyerName" type="text" placeholder="Buyer Name" {...register("buyerName", { required: true })} />
                </div>
            ) : (
                <div >
                    <div className="buyer_label">
                        <label htmlFor="selectBuyer">Անուն Ազգանուն</label>
                        <select id="selectBuyer" {...register('buyerId', { required: true })} onChange={(event) => selectedBuyer(event)}>
                           <option>Ընտրեք Գնորդին</option>
                            {buyer.arrBuyer &&
                                buyer.arrBuyer.length > 0 ? (
                                buyer.arrBuyer.map((e: any) => {
                                    return (
                                        <option key={e._id} value={e._id}>
                                            {e.name}
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
                <input id="buyerPhone" type="text" placeholder=" Buyer Phone" {...register("buyerPhone", { required: true })} />
            </div>
            <div className="buyer_label">
                <label htmlFor="buyerAdress">Հասցե</label>
                <input id="buyerAdress" type="text" placeholder="Buyer Adress" {...register("buyerAdress", { required: true })} />
            </div>


        </div>



    </div>)
}
export default BuyerOrderSection;