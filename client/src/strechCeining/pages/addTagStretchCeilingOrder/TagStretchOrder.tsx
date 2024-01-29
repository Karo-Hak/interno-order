import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { userProfile } from '../../../features/user/userApi';
import './tagStretchOrder.css';
import BuyerSection from './BuyerSection';
import StretchTexturesSection from './StretchTexturesSection';
import PaymentSection from './PaymentSection';
import ProfilSection from './ProfilSection';
import LightPlatformSection from './LightPlatformSection';
import LightRingSection from './LightRingSection';
import { filterOrder } from './logic';
import AdditionalSection from './AdditionalSection';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/user/userSlice';
import { addNewStretchOrder, viewNewOrders } from '../../stretchCeilingOrder/stretchOrderApi';


export const TagStretchOrderx: React.FC = (): JSX.Element => {
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<any>();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })

    }, []);

    const user = useAppSelector(selectUser);

    const [addOrder, setAddOrder] = useState({});
    const [orderSum, setOrderSum] = useState(0);
    const [orderBalance, setOrderBalance] = useState(0);
    let sum: number = 0;
    let sumOrder: number = 0;


    const qountTotal = (order: any, event: any) => {
        const buyer = {
            buyerId: order.buyerId,
            buyerName: order.buyerName,
            buyerPhone: order.buyerPhone,
            buyerAddress: order.buyerAddress
        }
        const stretchTextureOrder: any = filterOrder(order)
        Object.values(stretchTextureOrder.groupedAdditionals).forEach((el: any) => sum += +el.additionalTotal)
        Object.values(stretchTextureOrder.groupedStretchCeilings).forEach((el: any) => sum += +el.stretchTotal)
        if (order.prepayment != "") {
            sumOrder = sum - +order.prepayment
        } else {
            sumOrder = sum
        }
        setValue("groundTotal", sumOrder)
        setValue("balance", sum)
        setOrderBalance(sum)
        setOrderSum(sumOrder)
        stretchTextureOrder["prepayment"] = order.prepayment
        stretchTextureOrder["paymentMethod"] = order.paymentMethod
        stretchTextureOrder["groundTotal"] = sumOrder
        stretchTextureOrder["balance"] = sum
        stretchTextureOrder["orderComment"] = order.orderComment
        stretchTextureOrder["buyerComment"] = order.buyerComment
        stretchTextureOrder["measureDate"] = order.measureDate
        stretchTextureOrder["installDate"] = order.installDate
        setAddOrder({ buyer, stretchTextureOrder })

    };


    const newOrder = () => {
        dispatch(addNewStretchOrder({ addOrder, cookies, user: user.profile })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    };



    return (
        <div className=''>
            <form onSubmit={handleSubmit(qountTotal)}>
                <div className=''>
                    <BuyerSection register={register} setValue={setValue} />
                </div>
                <div>
                    <PaymentSection register={register} setOrderBalance={setOrderBalance} setOrderSum={setOrderSum} />
                </div>
                <div className='streachOrder' >
                    <div className='patver_name'>Patver</div>
                    <div className='patver_info'>
                        <div className='patver_arastax'>
                            <StretchTexturesSection register={register} reset={reset} setValue={setValue} />
                            <AdditionalSection register={register} reset={reset} setValue={setValue} />
                        </div>
                        <div className='patver_arastax_profil'>
                            <ProfilSection register={register} />
                            <LightPlatformSection register={register} />
                            <LightRingSection register={register} />
                        </div>
                    </div>
                </div>
                <div className="formdivStretch_1" >
                    <div className="buyer_label_1">
                        <button className="btn btn1" type='button' onClick={newOrder}>Գրանցել</button>
                        <button className='btn btn1' type='submit'>Հաշվարկել</button>
                    </div>
                </div>
            </form>
        </div>
    );
};
