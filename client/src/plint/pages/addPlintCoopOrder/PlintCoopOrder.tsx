import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { filterOrder } from './plintCoopLogic';
import './plintCoopOrder.css';
import { useAppDispatch } from '../../../app/hooks';
import { PlintProps } from '../../features/plint/plintSlice';
import { userProfile } from '../../../features/user/userApi';
import { getAllPlint } from '../../features/plint/plintApi';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import { addNewPlintOrder } from '../../features/plintOrder/plintOrderApi';
import PlintRetailOrderComponent from './PlintCoopOrderComponent';
import PlintRetailPaymentSection from './PlintCoopPaymentSection';
import PlintCoopSection from './PlintCoopSection';

interface FormValues {
  buyerId: string;
  name: string;
  phone1?: string;
  phone2?: string;
  address?: string;
  region?: string;
  prepayment?: number;
  agentDiscount?: number;
  paymentMethod?: string;
  buyerComment?: string;
  code?: string;
  delivery?: string;
  deliverySum?: number;
  plintcoopId?: string;
  plintAgentId?: string;
  balance?: number;
  groundTotal?: number;
  agentTotal?: number;
  [key: string]: any;
}

export const PlintCoopOrder: React.FC = () => {
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
  } = useForm<FormValues>();

  const [user, setUser] = useState<any>();
  const [plintData, setPlintData] = useState<PlintProps[]>([]);

  // 🔍 Следим за всеми значениями формы
  const watchedFields = useWatch({ control });

  const calculateTotals = useCallback(() => {
    const values = getValues();

    const balance = Object.entries(values).reduce((total, [key, value]) => {
      if (key === 'deliverySum') return total; // ❌ deliverySum не участвует
      const num = typeof value === 'number' ? value : parseFloat(value);
      return !isNaN(num) && key.toLowerCase().includes("sum")
        ? total + num
        : total;
    }, 0);

    const prepayment = parseFloat(values.prepayment?.toString() || '0');
    const agentDiscount = parseFloat(values.agentDiscount?.toString() || '0');

    const discountSum = balance - (balance * agentDiscount / 100);
    const agentTotal = balance * agentDiscount / 100;
    const groundTotal = discountSum - prepayment;

    setValue("balance", balance);
    setValue("groundTotal", groundTotal);
    setValue("agentTotal", agentTotal);
  }, [getValues, setValue]);

  useEffect(() => {
    calculateTotals();
  }, [JSON.stringify(watchedFields)]); // предотвращает бесконечный ререндер

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
        const plintResult = await dispatch(getAllPlint(cookies)).unwrap();

        if (userProfileResult?.user) setUser(userProfileResult.user);
        if (plintResult?.plint) setPlintData(plintResult.plint);
      } catch (error) {
        toast.error("Authentication error. Please login again.");
        setCookie("access_token", "", { path: "/" });
        navigate("/");
      }
    };

    fetchData();
  }, [cookies, dispatch, navigate, setCookie]);

  const save = async (order: FormValues) => {
    try {
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
      const agentDiscount = parseFloat(order.agentDiscount?.toString() || '0');
      const discountSum = balance - (balance * agentDiscount / 100);
      const groundTotal = discountSum - prepayment;
      const agentTotal = balance * agentDiscount / 100;

      Object.assign(plintOrder, {
        prepayment,
        paymentMethod: order.paymentMethod,
        groundTotal,
        buyerComment: order.buyerComment,
        code: order.code,
        agentTotal,
        balance,
        delivery: order.delivery,
        deliverySum: order.deliverySum,
        coop: order.plintcoopId,
        agent: order.plintAgentId,
        agentDiscount,
      });

      const res = await dispatch(addNewPlintOrder({ plintOrder, buyer, cookies, user })).unwrap();

      if ("error" in res) {
        toast.error(res.error || "Something went wrong.");
      } else {
        toast.success("Order successfully created.");
        reset();
      }
    } catch (err: any) {
      toast.error("Failed to save order.");
    }
  };

  return (
    <div>
      <PlintMenu />
      <form onSubmit={handleSubmit(save)}>
        <PlintCoopSection register={register} setValue={setValue} />
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
