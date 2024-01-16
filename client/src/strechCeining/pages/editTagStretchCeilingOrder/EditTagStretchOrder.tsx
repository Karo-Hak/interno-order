import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { userProfile } from '../../../features/user/userApi';
import './editTagStretchCeilingOrder.css';
import BuyerSection from './EditBuyerSection';
import StretchTexturesSection from './EditStretchTexturesSection';
import PaymentSection from './EditPaymentSection';
import ProfilSection from './EditProfilSection';
import LightPlatformSection from './EditLightPlatformSection';
import LightRingSection from './EditLightRingSection';
import { filterOrder } from './editLogic';
import AdditionalSection from './EditAdditionalSection';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/user/userSlice';
import { addNewStretchOrder, findStretchOrder, viewNewOrders } from '../../stretchCeilingOrder/stretchOrderApi';
import { selectStretchOrder } from '../../stretchCeilingOrder/stretchOrderSlice';


export const EditTagStretchOrderx: React.FC = (): JSX.Element => {
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<any>();
    const dispatch = useAppDispatch();

    let sum: number = 0;
    let sumOrder: number = 0;

    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
        dispatch(findStretchOrder({ params, cookies })).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
            setValue("buyerName", res.buyer.buyerName);
            setValue("buyerPhone", res.buyer.buyerPhone);
            setValue("buyerAddress", res.buyer.buyerAddress);
            setValue("buyerComment", res.buyerComment);
            setValue("balance", res.balance);
            setValue("groundTotal", res.groundTotal);
            const measureDate = new Date(res.measureDate);
            const formattedMeasureDate = measureDate.toISOString().split('T')[0];
            setValue("measureDate", formattedMeasureDate);
        })

    }, []);

    const editingOrder = useAppSelector(selectStretchOrder);
    const user = useAppSelector(selectUser);
    const params = useParams()

    useEffect(() => {
        if (editingOrder.stretchOrder) {
            setValue("balance", editingOrder.stretchOrder.balance);
            setValue("groundTotal", editingOrder.stretchOrder.groundTotal);
        }
    }, [editingOrder.stretchOrder])



    const [addOrder, setAddOrder] = useState({});
    const [orderSum, setOrderSum] = useState(0);
    const [orderBalance, setOrderBalance] = useState(0);



    const qountTotal = (order: any, event: any) => {
        const buyer = {
            buyerId: order.buyerId,
            buyerName: order.buyerName,
            buyerPhone: order.buyerPhone,
            buyerAdress: order.buyerAddress
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
        console.log(order);

    };


    const newOrder = () => {
        dispatch(addNewStretchOrder({ addOrder, cookies, user: user.profile })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        // window.location.reload()
    };

    return (
        <>
            <form onSubmit={handleSubmit(qountTotal)}>
                <BuyerSection register={register} setValue={setValue} />
                <div className="formdivStretch" style={{ display: "flex" }}>
                    <div >
                        <StretchTexturesSection register={register} reset={reset} setValue={setValue} editingStretchTexture={editingOrder.stretchOrder.groupedStretchCeilings} />
                        <ProfilSection register={register} reset={reset} setValue={setValue} editingProfils={editingOrder.stretchOrder.groupedProfils} />
                        <LightPlatformSection register={register} reset={reset} setValue={setValue} editingLightPlatforms={editingOrder.stretchOrder.groupedlightPlatforms} />
                        <LightRingSection register={register} reset={reset} setValue={setValue} editingLightRings={editingOrder.stretchOrder.groupedlightRings} />
                    </div>
                    <div >
                        <AdditionalSection register={register} reset={reset} setValue={setValue} editingAdditionals={editingOrder.stretchOrder.groupedAdditionals} orderComment={editingOrder.stretchOrder.orderComment} />
                    </div>
                </div>
                <div className="formdivStretch" style={{ display: "flex" }}>
                    <PaymentSection register={register} setValue={setValue}
                        paymentMethod={editingOrder.stretchOrder.paymentMethod}
                        prepayment={editingOrder.stretchOrder.prepayment}
                        installDate={editingOrder.stretchOrder.installDate}
                    />
                    <div className="inputDiv">
                        <label htmlFor="Sum">Ընդամենը</label>
                        <input id="balance" type="number" placeholder="Balance" {...register('balance')} onChange={(e) => setOrderBalance(+e.target.value)} />
                    </div>
                    <div className="inputDiv">
                        <label htmlFor="Sum">Մնացորդ</label>
                        <input id="Sum" type="number" placeholder="Sum" {...register('groundTotal')} onChange={(e) => setOrderSum(+e.target.value)} />
                    </div>
                    <button className='btn' type='submit'>Հաշվարկել</button>
                    <button className="btn" type='button' onClick={newOrder}>Գրանցել</button>
                </div>
            </form>
        </>
    );
};
