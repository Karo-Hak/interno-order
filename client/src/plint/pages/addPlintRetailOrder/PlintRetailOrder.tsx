import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm, useWatch } from 'react-hook-form';
import { filterOrder } from './plintRetailLogic';
import './plintRetailOrder.css';
import { useAppDispatch } from '../../../app/hooks';
import { PlintProps } from '../../features/plint/plintSlice';
import { userProfile } from '../../../features/user/userApi';
import { getAllPlint } from '../../features/plint/plintApi';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import PlintRetailOrderComponent from './PlintRetailOrderComponent';
import PlintRetailPaymentSection from './PlintRetailPaymentSection';
import PlintRetailBuyerSection from './PlintRetailBuyerSection';
import { addNewPlintOrder } from '../../features/plintOrder/plintOrderApi';

export const PlintRetailOrder: React.FC = (): JSX.Element => {
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        getValues,
        control,
    } = useForm<any>();

    const [user, setUser] = useState();
    const [plintData, setPlintData] = useState<PlintProps[]>([]);

    const watchedValues = useWatch({ control });

    const calculateTotalOrder = useCallback(() => {
        const values = getValues();

        let totalOrder = 0;
        for (const [key, value] of Object.entries(values)) {
            if (key === 'deliverySum') continue;

            const num = typeof value === 'number' ? value : parseFloat(value as string);
            if (!isNaN(num) && key.toLowerCase().includes("sum")) {
                totalOrder += num;
            }
        }

        const prepayment = parseFloat(values.prepayment?.toString() || '0');
        const discount = parseFloat(values.discount?.toString() || '0');

        const discounted = totalOrder - totalOrder * discount / 100;
        const groundTotal = discounted - prepayment;

        setValue("balance", totalOrder);
        setValue("groundTotal", groundTotal);
    }, [getValues, setValue]);

    useEffect(() => {
        calculateTotalOrder();
    }, [JSON.stringify(watchedValues)]);

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
        const balance = parseFloat(order.balance?.toString() || '0');
        const prepayment = parseFloat(order.prepayment?.toString() || '0');
        const discount = parseFloat(order.discount?.toString() || '0');
        const discountSum = balance - balance * discount / 100;
        const groundTotal = discountSum - prepayment;

        Object.assign(plintOrder, {
            prepayment,
            paymentMethod: order.paymentMethod,
            groundTotal,
            buyerComment: order.buyerComment,
            code: order.code,
            discount,
            balance,
            delivery: order.delivery,
            deliverySum: order.deliverySum,
            deliveryAddress: order.deliveryAddress,
            deliveryPhone: order.deliveryPhone,
            orderType: "retail",
        });

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
                <PlintRetailBuyerSection register={register} setValue={setValue} />
                <div style={{ height: "20px" }} />
                <PlintRetailPaymentSection register={register} setValue={setValue} />
                <div className="admin_profile_Strech" style={{ height: "20px" }} />
                <div className="roomBardutyun">
                    <div style={{ marginRight: "20px" }}>
                        <PlintRetailOrderComponent
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
                        <button type="submit">Գրանցել</button>
                    </div>
                </div>
            </form>
        </div>
    );
};
