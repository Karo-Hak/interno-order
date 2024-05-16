import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../../app/hooks';
import { getAllStretchTexture } from '../../../features/strechTexture/strechTextureApi';
import { userProfile } from '../../../../features/user/userApi';
import { getAllStretchProfil } from '../../../features/strechProfil/strechProfilApi';
import { getAllStretchLightPlatform } from '../../../features/strechLightPlatform/strechLightPlatformApi';
import { getAllStretchLightRing } from '../../../features/strechLightRing/strechLightRingApi';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';
import { StretchTextureProps } from '../../../features/strechTexture/strechTextureSlice';
import { StretchProfilProps } from '../../../features/strechProfil/strechProfilSlice';
import { StretchLightPlatformProps } from '../../../features/strechLightPlatform/strechLightPlatformSlice';
import { StretchLightRingProps } from '../../../features/strechLightRing/strechLightRingSlice';
import { addNewCoopStretchOrder, findCoopStretchOrder } from '../../features/coopStrechOrder/coopStretchOrderApi';
import { CoopLightPlatformProps, CoopLightRingProps, CoopStretchOrderProps, CoopStretchProfilProps, CoopStretchTextureProps } from '../../features/coopStrechOrder/coopStretchOrderSlice';
import { SetStateAction, useEffect, useState } from 'react';
import EditCoopBuyerSection from './EditCoopBuyerSection';
import { CoopStretchBuyerProps } from '../../features/coopStrechBuyer/coopStrechBuyerSlice';
import EditCoopPaymentSection from './EditCoopPaymentSection';
import EditCoopOrderComponent from './EditCoopOrderComponent';



export const EditCoopStretchOrder: React.FC = (): JSX.Element => {

    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch, getValues } = useForm<any>();
    const dispatch = useAppDispatch();
    const params = useParams()

    const [order, setOrder] = useState<CoopStretchOrderProps>({} as CoopStretchOrderProps);
    const [orderBuyer, setOrderBuyer] = useState<CoopStretchBuyerProps>({} as CoopStretchBuyerProps)
    const [user, setUser] = useState();

    const [stretchTextureData, setStretchTextureData] = useState<StretchTextureProps[]>([])
    const [orderTexture, setOrderTexture] = useState<CoopStretchTextureProps[]>([])

    const [stretchProfilData, setStretchProfilData] = useState<StretchProfilProps[]>([])
    const [orderProfil, setOrderProfil] = useState<CoopStretchProfilProps[]>([])

    const [stretchLightPlatformData, setStretchLightPlatformData] = useState<StretchLightPlatformProps[]>([])
    const [orderLightPlatform, setOrderLightPlatform] = useState<CoopLightPlatformProps[]>([])

    const [stretchLightRingData, setStretchLightRingData] = useState<StretchLightRingProps[]>([])
    const [orderLightRing, setOrderLightRing] = useState<CoopLightRingProps[]>([])


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
                const stretchOrderResult = await dispatch(findCoopStretchOrder({ params, cookies })).unwrap();

                handleResult(stretchOrderResult);
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
            } else if (result.order) {
                setOrder(result.order)
                setOrderBuyer(result.order.buyer)
                setPrepayment(result.order.prepayment)
                setBalance(result.order.balance)
                if (result.order.groupedStretchTextureData && result.order.groupedStretchTextureData.length > 0) {
                    const data: SetStateAction<CoopStretchTextureProps[]> | CoopStretchTextureProps[] = []
                    result.order.groupedStretchTextureData.forEach((e: CoopStretchTextureProps) => {
                        return data.push(e);
                    })
                    setOrderTexture(data)
                }
                if (result.order.groupedStretchProfilData && result.order.groupedStretchProfilData.length > 0) {
                    const data: SetStateAction<CoopStretchProfilProps[]> | CoopStretchProfilProps[] = []
                    result.order.groupedStretchProfilData.forEach((e: CoopStretchProfilProps) => {
                        return data.push(e);
                    })
                    setOrderProfil(data)
                }
                if (result.order.groupedLightPlatformData && result.order.groupedLightPlatformData.length > 0) {
                    const data: SetStateAction<CoopLightPlatformProps[]> | CoopLightPlatformProps[] = []
                    result.order.groupedLightPlatformData.forEach((e: CoopLightPlatformProps) => {
                        return data.push(e);
                    })
                    setOrderLightPlatform(data)
                }
                if (result.order.groupedLightRingData && result.order.groupedLightRingData.length > 0) {
                    const data: SetStateAction<CoopLightRingProps[]> | CoopLightRingProps[] = []
                    result.order.groupedLightRingData.forEach((e: CoopLightRingProps) => {
                        return data.push(e);
                    })
                    setOrderLightRing(data)
                }
            }
        };

        fetchData();
    }, []);


    const qountTotal = (order: any) => {
        const buyer = {
            buyerId: order.buyerId,
            name: order.name,
            phone1: order.phone1,
            phone2: order.phone2,
            address: order.address,
            region: order.region
        }

        // const stretchTextureOrder: any = filterOrder(
        //     order,
        //     stretchTextureData,
        //     stretchProfilData,
        //     stretchLightPlatformData,
        //     stretchLightRingData,
        // )

        if (order.prepayment != "") {
            setValue("groundTotal", order.balance - order.prepayment)
        } else {
            setValue("groundTotal", order.balance)
        }

        // stretchTextureOrder["prepayment"] = order.prepayment
        // stretchTextureOrder["paymentMethod"] = order.paymentMethod
        // stretchTextureOrder["groundTotal"] = order.groundTotal
        // stretchTextureOrder["balance"] = order.balance
        // stretchTextureOrder["buyerComment"] = order.buyerComment
        // dispatch(addNewCoopStretchOrder({ stretchTextureOrder, buyer, cookies, user })).unwrap().then(res => {
        //     if ("error" in res) {
        //         alert(res.error)
        //     }
        // });
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

    console.log(order);


    return (
        <div className=''>
            <CoopStretchMenu />
            <form onSubmit={handleSubmit(qountTotal)}>
                <div className=''>
                    <EditCoopBuyerSection register={register} setValue={setValue} orderBuyer={orderBuyer} setOrderBuyer={setOrderBuyer} />
                </div>
                <p style={{
                    height: "20px"
                }}>
                </p>
                <div>
                    <EditCoopPaymentSection
                        register={register}
                        setValue={setValue}
                        setPrepayment={setPrepayment}
                        prepayment={prepayment}
                        balance={balance}
                        setBalance={setBalance}
                        paymentMethod={order.paymentMethod}
                        comment={order.buyerComment}
                    />
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

                        <EditCoopOrderComponent
                            register={register}
                            reset={reset}
                            setValue={setValue}
                            watch={watch}
                            getValues={getValues}
                            stretchTextureData={stretchTextureData}
                            orderTexture={orderTexture}
                            stretchProfilData={stretchProfilData}
                            orderProfil = {orderProfil}
                            stretchLightPlatformData={stretchLightPlatformData}
                            orderLightPlatform={orderLightPlatform}
                            stretchLightRingData={stretchLightRingData}
                            orderLightRing={orderLightRing}
                            setOrderTexture={setOrderTexture}
                            setOrderProfil={setOrderProfil}
                            setOrderLightPlatform={setOrderLightPlatform}
                            setOrderLightRing={setOrderLightRing}

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

