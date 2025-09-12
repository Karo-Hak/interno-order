import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { PlintOrderProps } from '../../features/plintOrder/plintOrderSlice';
import { PlintBuyerProps } from '../../features/plintBuyer/plintBuyerSlice';
import { PlintProps } from '../../features/plint/plintSlice';
import { userProfile } from '../../../features/user/userApi';
import { getAllPlint } from '../../features/plint/plintApi';
import { editPlintOrder, findPlintOrder } from '../../features/plintOrder/plintOrderApi';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import EditPlintBuyerSection from './EditPlintBuyerSection';
import EditPlintPaymentSection from './EditPlintPaymentSection';
import EditPlintOrderComponent from './EditPlintOrderComponent';
import { filterOrder } from '../addPlintRetailOrder/plintRetailLogic';
import { PlintCoopProps } from '../../features/plintCoop/plintCoopSlice';

export const EditPlintOrder: React.FC = (): JSX.Element => {
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch, getValues } = useForm<any>();
    const dispatch = useAppDispatch();
    const params = useParams();

    const [order, setOrder] = useState<PlintOrderProps>({} as PlintOrderProps);
    const [orderBuyer, setOrderBuyer] = useState<PlintBuyerProps>({} as PlintBuyerProps);
    const [orderCoop, setOrderCoop] = useState<PlintCoopProps>({} as PlintCoopProps);
    const [user, setUser] = useState<any>();

    const [plintData, setPlintData] = useState<PlintProps[]>([]);
    const [orderPlint, setOrderPlint] = useState<PlintProps[]>([]);

    const [prepayment, setPrepayment] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);
    const [delivery, setDelivery] = useState<boolean>(false)

    const [isCalculated, setIsCalculated] = useState<boolean>(false);

    const calculateTotalOrder = (order: any) => {
        let totalOrder = 0;
        for (const [key, value] of Object.entries(order)) {
            let numericValue: number;

            if (typeof value === 'number') {
                numericValue = value;
            }
            else if (typeof value === 'string') {
                numericValue = parseFloat(value);
            }
            else {
                continue;
            }

            if (!isNaN(numericValue) && key.toLowerCase().includes("sum")) {
                totalOrder += numericValue;
            }
        }
        return totalOrder;

    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                const plintResult = await dispatch(getAllPlint(cookies)).unwrap();
                const plintOrderResult = await dispatch(findPlintOrder({ params, cookies })).unwrap();
    
                handleResult(plintOrderResult);
                handleResult(userProfileResult);
                handleResult(plintResult);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };
        const handleResult = (result: any) => {
            if ("error" in result) {
                alert(result.error);
                setCookie("access_token", "", { path: "/" });
                navigate("/");
            } else {
                processResult(result);
            }
        };
        const processResult = (result: any) => {
            if (result.user) {
                setUser(result.user);
            } else if (result.plint) {
                setPlintData(result.plint);
            } else if (result.order) {
                setOrder(result.order);
                setOrderBuyer(result.order.buyer); 
                setOrderCoop(result.order.coop || {}); 
                setPrepayment(result.order.prepayment || 0);
                setBalance(result.order.balance || 0);
                if (result.order.groupedPlintData && result.order.groupedPlintData.length > 0) {
                    const data: SetStateAction<PlintProps[]> | PlintProps[] = [];
                    result.order.groupedPlintData.forEach((e: PlintProps) => {
                        return data.push(e);
                    });
                    setOrderPlint(data);
                }
            }
        };
    
        fetchData();
    }, [dispatch, cookies, navigate, params, setCookie]);
    
    useEffect(() => {
        setValue("groundTotal", balance - prepayment);
        setValue("balance", balance);
        setValue("prepayment", prepayment);
        setValue("paymentMethod", order.paymentMethod || ""); 
        setValue("buyerComment", order.buyerComment || ""); 
        setValue("coopDiscount", order.coopDiscount || 0);
        setValue("coopTotal", order.coopTotal || 0);
        setValue("deliverySum", order.deliverySum || 0);
        setValue("delivery", order.delivery || false);
    }, [balance, prepayment, order, setValue]);
    
    const save = (order: any) => {
        const buyer = {
            buyerId: order.buyerId,
            name: order.name,
            phone1: order.phone1,
            phone2: order.phone2 || "",
            address: order.address,
            region: order.region
        };
        const plintOrder: any = filterOrder(order, plintData);
    
        const balance = calculateTotalOrder(order);
    
        const prepayment = order.prepayment || 0;
        const coopDiscount = order.coopDiscount || 0;
        const discountSum = +balance - (+balance * +coopDiscount / 100);
        const orderBalance = +discountSum - +prepayment;
        const coopTotal = +balance * +coopDiscount / 100;
    
        plintOrder["prepayment"] = prepayment;
        plintOrder["paymentMethod"] = order.paymentMethod || "";
        plintOrder["groundTotal"] = orderBalance;
        plintOrder["buyerComment"] = order.buyerComment || "";
        plintOrder["code"] = order.code || "";
        plintOrder["coopDiscount"] = coopDiscount;
        plintOrder["balance"] = balance;
        plintOrder["coopTotal"] = coopTotal;
        plintOrder["delivery"] = order.delivery || false;
        plintOrder["deliverySum"] = order.deliverySum || 0;
        plintOrder["coop"] = order.plintcoopId || null;
    
        dispatch(editPlintOrder({ plintOrder, buyer, cookies, user, params }))
            .unwrap()
            .then(res => {
                if ("error" in res) {
                    alert(res.error);
                } else {
                    reset();
                }
            });
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
        setBalance(totalOrder);
        setValue("balance", totalOrder);
        setIsCalculated(true);
    }

    return (
        <div className=''>
            <PlintMenu />
            <form onSubmit={handleSubmit(save)}>
                <div className=''>
                    <EditPlintBuyerSection
                        register={register}
                        setValue={setValue}
                        orderBuyer={orderBuyer}
                        setOrderBuyer={setOrderBuyer}
                        orderCoop={orderCoop} />
                </div>
                <p style={{ height: "20px" }}>
                </p>
                <div>
                    <EditPlintPaymentSection
                        register={register}
                        setValue={setValue}
                        setPrepayment={setPrepayment}
                        prepayment={prepayment}
                        balance={balance}
                        setBalance={setBalance}
                        paymentMethod={order.paymentMethod}
                        comment={order.buyerComment}
                        coopDiscount={order.coopDiscount}
                        coopTotal={order.coopTotal}
                        deliverySum={order.deliverySum}
                        delivery={order.delivery}
                        setDelivery={setDelivery}
                    />
                </div>
                <div style={{ height: "20px" }} className="admin_profile_Strech">
                </div>
                <div className='roomBardutyun'>
                    <div style={{ marginRight: "20px" }}>
                        <EditPlintOrderComponent
                            register={register}
                            reset={reset}
                            setValue={setValue}
                            watch={watch}
                            getValues={getValues}
                            plintData={plintData}
                            orderPlint={orderPlint}
                            setOrderPlint={setOrderPlint}
                            setIsCalculated={setIsCalculated}
                        />
                    </div>
                </div>
                <div className="divButton">
                    <div className="buyer_label_1">
                        <button type='button' onClick={qount}>Հաշվել</button>
                    </div>
                    <div className="buyer_label_1">
                        <button type='submit' disabled={!isCalculated}>
                            {!isCalculated ? 'Սեխմեք Հաշվել' : 'Գրանցել'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
