import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import BuyerSection from './CoopBuyerSection';
import PaymentSection from './CoopPaymentSection';
import { filterOrder } from './coopLogic';
import './tagStretchOrder.css';
import { useAppDispatch } from '../../../../app/hooks';
import { getAllStretchTexture } from '../../../features/strechTexture/strechTextureApi';
import { userProfile } from '../../../../features/user/userApi';
import { getAllStretchProfil } from '../../../features/strechProfil/strechProfilApi';
import { getAllStretchLightPlatform } from '../../../features/strechLightPlatform/strechLightPlatformApi';
import { getAllStretchLightRing } from '../../../features/strechLightRing/strechLightRingApi';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';
import CoopOrderComponent from './CoopOrderComponent';
import { StretchTextureProps } from '../../../features/strechTexture/strechTextureSlice';
import { StretchProfilProps } from '../../../features/strechProfil/strechProfilSlice';
import { StretchLightPlatformProps } from '../../../features/strechLightPlatform/strechLightPlatformSlice';
import { StretchLightRingProps } from '../../../features/strechLightRing/strechLightRingSlice';
import { addNewCoopStretchOrder } from '../../features/coopStrechOrder/coopStretchOrderApi';



export const CoopStretchOrder: React.FC = (): JSX.Element => {

    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch, getValues } = useForm<any>();
    const dispatch = useAppDispatch();

    const [user, setUser] = useState();
    const [stretchTextureData, setStretchTextureData] = useState<StretchTextureProps[]>([])
    const [stretchProfilData, setStretchProfilData] = useState<StretchProfilProps[]>([])
    const [stretchLightPlatformData, setStretchLightPlatformData] = useState<StretchLightPlatformProps[]>([])
    const [stretchLightRingData, setStretchLightRingData] = useState<StretchLightRingProps[]>([])
    const [prepayment, setPrepayment] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                const stretchTextureResult = await dispatch(getAllStretchTexture(cookies)).unwrap();
                const stretchProfilResult = await dispatch(getAllStretchProfil(cookies)).unwrap();
                const stretchLightPlatformResult = await dispatch(getAllStretchLightPlatform(cookies)).unwrap();
                const stretchLightRingResult = await dispatch(getAllStretchLightRing(cookies)).unwrap();

                handleResult(userProfileResult);
                handleResult(stretchTextureResult);
                handleResult(stretchProfilResult);
                handleResult(stretchLightPlatformResult);
                handleResult(stretchLightRingResult);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };
        const handleResult = (result: any) => {
            if ("error" in result) {
                alert(result);
                setCookie("access_token", "", { path: "/" });
                navigate("/");
            } else {
                processResult(result);
            }
        };
        const processResult = (result: any) => {
            if (result.user) {
                setUser(result.user)
            } else if (result.stretchTexture) {
                setStretchTextureData(result.stretchTexture)
            } else if (result.stretchProfil) {
                setStretchProfilData(result.stretchProfil)
            } else if (result.lightPlatform) {
                setStretchLightPlatformData(result.lightPlatform)
            } else if (result.lightRing) {
                setStretchLightRingData(result.lightRing)
            }
        };

        fetchData();
    }, []);


    const qountTotal = (order: any) => {
        console.log(order);
        
        const buyer = {
            buyerId: order.buyerId,
            name: order.name,
            phone1: order.phone1,
            phone2: order.phone2,
            address: order.address,
            region: order.region
        }

        const stretchTextureOrder: any = filterOrder(
            order,
            stretchTextureData,
            stretchProfilData,
            stretchLightPlatformData,
            stretchLightRingData,
        )



        if (order.prepayment != "") {
            setValue("groundTotal", order.balance - order.prepayment)
        } else {
            setValue("groundTotal", order.balance)
        }

        stretchTextureOrder["prepayment"] = order.prepayment
        stretchTextureOrder["paymentMethod"] = order.paymentMethod
        stretchTextureOrder["groundTotal"] = order.groundTotal
        stretchTextureOrder["balance"] = order.balance
        stretchTextureOrder["buyerComment"] = order.buyerComment
        dispatch(addNewCoopStretchOrder({ stretchTextureOrder, buyer, cookies, user })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        // window.location.reload()
    };


    function qount() {
        const order: Record<string, number> = watch();
        let totalOrder = 0;
        for (const [key, value] of Object.entries(order)) {
            const lowercaseKey = key.toLowerCase();
            if (lowercaseKey.includes("sum")) {
                totalOrder += +value as number;
            }
        }
        setBalance(totalOrder)
        setValue("balance", totalOrder)
    }







    return (
        <div className=''>
            <CoopStretchMenu />
            <form onSubmit={handleSubmit(qountTotal)}>
                <div className=''>
                    <BuyerSection register={register} setValue={setValue} />
                </div>
                <p style={{
                    height: "20px"
                }}>
                </p>
                <div>
                    <PaymentSection
                        register={register}
                        setValue={setValue}
                        setPrepayment={setPrepayment}
                        prepayment={prepayment}
                        balance={balance}
                        setBalance={setBalance} />
                </div>
                <div
                    style={{
                        height: "20px"
                    }}
                    className="admin_profile_Strech"
                >

                </div>
                <div className='roomBardutyun'>
                    <div style={{ marginRight: "20px" }}>

                        <CoopOrderComponent
                            register={register}
                            reset={reset}
                            setValue={setValue}
                            watch={watch}
                            getValues={getValues}
                            stretchTextureData={stretchTextureData}
                            stretchProfilData={stretchProfilData}
                            stretchLightPlatformData={stretchLightPlatformData}
                            stretchLightRingData={stretchLightRingData}

                        />
                    </div>
                </div>
                <div className="divButton" >
                    <div className="buyer_label_1">
                        <button type='button' onClick={qount}>Հաշվել</button>
                    </div>
                    <div className="buyer_label_1">
                        <button type='submit'>Գրանցել</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

