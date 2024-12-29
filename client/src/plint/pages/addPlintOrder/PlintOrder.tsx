import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import BuyerSection from './PlintBuyerSection';
import PaymentSection from './PlintPaymentSection';
import { filterOrder } from './plintLogic';
import './plintOrder.css';
import { useAppDispatch } from '../../../app/hooks';
import { PlintProps } from '../../features/plint/plintSlice';
import { userProfile } from '../../../features/user/userApi';
import { getAllPlint } from '../../features/plint/plintApi';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import PlintOrderComponent from './PlintOrderComponent';
import { addNewPlintOrder } from '../../features/plintOrder/plintOrderApi';

export const PlintOrder: React.FC = (): JSX.Element => {
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch, getValues } = useForm<any>();
    const dispatch = useAppDispatch();

    const [user, setUser] = useState();
    const [plintData, setPlintData] = useState<PlintProps[]>([]);

    function qount() {
        const order = watch()
        const balance = calculateTotalOrder(order)

        const prepayment = order.prepayment
        const coopDiscount = order.coopDiscount
        const discountSum = +balance - +balance * +coopDiscount / 100
        const coopTotal = +balance * +coopDiscount / 100
        const totalOrder = +discountSum - +prepayment
        setValue("balance", balance)
        setValue("groundTotal", totalOrder)
        setValue("coopTotal", coopTotal)
    }

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


                handleResult(userProfileResult);
                handleResult(plintResult);
            } catch (error) {
                console.error("Произошла ошибка:", error);
            }
        };

        const handleResult = (result: any) => {
            if (result?.error) {
                alert(result.error || "Ошибка");
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
            }
        };

        fetchData();
    }, [cookies, dispatch, navigate, setCookie]);

    const save = (order: any) => {
        const buyer = {
            buyerId: order.buyerId,
            name: order.name,
            phone1: order.phone1,
            phone2: order.phone2,
            address: order.address,
            region: order.region,
        };
        const plintOrder: any = filterOrder(order, plintData);

        const balance = calculateTotalOrder(order);

        const prepayment = order.prepayment
        const coopDiscount = order.coopDiscount
        const discountSum = +balance - +balance * +coopDiscount / 100
        const orderBalance = +discountSum - +prepayment
        const coopTotal = +balance * +coopDiscount / 100

        plintOrder["prepayment"] = order.prepayment;
        plintOrder["paymentMethod"] = order.paymentMethod;
        plintOrder["groundTotal"] = orderBalance;
        plintOrder["buyerComment"] = order.buyerComment;
        plintOrder["code"] = order.code;
        plintOrder["coopDiscount"] = order.coopDiscount;
        plintOrder["balance"] = balance;
        plintOrder["coopTotal"] = coopTotal;
        plintOrder["delivery"] = order.delivery;
        plintOrder["deliverySum"] = order.deliverySum;
        plintOrder["coop"] = order.plintcoopId;

        dispatch(addNewPlintOrder({ plintOrder, buyer, cookies, user }))
            .unwrap()
            .then(res => {
                if ("error" in res) {
                    alert(res.error);
                } else {
                    reset();
                }
            });
    };



    return (
        <div>
            <PlintMenu />
            <form onSubmit={handleSubmit(save)}>
                <div>
                    <BuyerSection register={register} setValue={setValue} />
                </div>
                <p style={{ height: "20px" }}></p>
                <div>
                    <PaymentSection
                        register={register}
                        setValue={setValue}
                    />
                </div>
                <div className="admin_profile_Strech" style={{ height: "20px" }}></div>
                <div className='roomBardutyun'>
                    <div style={{ marginRight: "20px" }}>
                        <PlintOrderComponent
                            register={register}
                            reset={reset}
                            setValue={setValue}
                            getValues={getValues}
                            plintData={plintData}
                        />
                    </div>
                </div>
                <div className="divButton">
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
