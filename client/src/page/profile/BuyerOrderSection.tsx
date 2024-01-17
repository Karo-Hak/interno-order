import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectBuyer } from '../../features/buyer/buyerSlice';
import { allBuyer } from '../../features/buyer/buyerApi';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";



const BuyerOrderSection: React.FC<any> = ({ register }: any) => {

    const dispatch = useAppDispatch();
    const buyer = useAppSelector(selectBuyer);
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();




    useEffect(() => {
        dispatch(allBuyer(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
    }, [])

    return (<div>

        Գնորդ/Buyer
        <div>-------</div>
        <div className="inputDiv">
            <label htmlFor="buyerName">Անուն</label>
            <input id="buyerName" type="text" placeholder="Buyer Name" {...register("buyerName", { required: true })} />
        </div>
        <div className="inputDiv">
            <label htmlFor="buyerPhone">Հեռախես</label>
            <input id="buyerPhone" type="text" placeholder=" Buyer Phone" {...register("buyerPhone", { required: true })} />
        </div>
        <div className="inputDiv">
            <label htmlFor="buyerAdress">Հասցե</label>
            <input id="buyerAdress" type="text" placeholder="Buyer Adress" {...register("buyerAdress", { required: true })} />
        </div>


    </div>)
}
export default BuyerOrderSection;