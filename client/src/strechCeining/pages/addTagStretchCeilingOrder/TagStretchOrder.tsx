import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { userProfile } from '../../../features/user/userApi';
import BuyerSection from './BuyerSection';
import PaymentSection from './PaymentSection';
import { filterOrder } from './logic';
import { useAppDispatch } from '../../../app/hooks';
import RoomSection from './RoomSection';
import ModalRoom from '../../../component/modal/ModalRoom';
import { v4 as uuidv4 } from 'uuid';
import WorkSection from './WorkSection';
import { getAllStretchTexture } from '../../features/strechTexture/strechTextureApi';
import { getAllStretchBardutyun } from '../../features/strechBardutyun/strechBardutyunApi';
import { allStretchWork } from '../../features/StrechWork/strechWorkApi';
import { StretchMenu } from '../../../component/menu/StretchMenu';
import './tagStretchOrder.css';
import { addNewStretchOrder } from '../../features/stretchCeilingOrder/stretchOrderApi';

import { getProductsByCategoryApi } from '../../features/product/productApi';

export interface Data {
  id: string;
  _id: string;
  name: string;
  price: number;
  quantity: number;
  sum: number;
}

const ADDITIONAL_CAT = '69944f434f4494db597e55fa';
const PROFIL_CAT = '65a794201acb8962fc25c963';
const PLATFORM_CAT = '65a63e084452458093923a8f';
const LIGHT_RING_A = '65a639cb4452458093923951';
const LIGHT_RING_B = '65a639f04452458093923955';

type RoomT = { id: string; name: string; isChecked: boolean; sum: number };

const TagStretchOrder: React.FC = (): JSX.Element => {
  const dedupById = <T extends { _id: string }>(arr: T[]): T[] => {
    const map = new Map<string, T>();
    for (let i = 0; i < arr.length; i++) {
      const it = arr[i];
      map.set(it._id, it);
    }
    return Array.from(map.values());
  };

  const [cookies, setCookie] = useCookies(['access_token']);
  const token = cookies?.access_token as string | undefined;

  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, watch, getValues } = useForm<any>();
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<any>(null);
  const [stretchTextureData, setStretchTextureData] = useState<any>(null);
  const [stretchBardutyunData, setStretchBardutyunData] = useState<any>(null);
  const [stretchWorkData, setStretchWorkData] = useState<any>(null);

  const [roomSum, setRoomSum] = useState<Record<string, number>>({});
  const [orderSum, setOrderSum] = useState(0);
  const [prepayment, setPrepayment] = useState(0);
  const [balance, setBalance] = useState(0);

  const [room, setRoom] = useState<RoomT[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---------- helpers ----------
  const logout = () => {
    setCookie('access_token', '', { path: '/' });
    navigate('/');
  };

  function isRoomSumKey(key: string, roomId: string) {
    const suffix15 = roomId.slice(-15);
    return key.includes('Sum') && (key.endsWith(suffix15) || key.endsWith(`/${roomId}`));
  }

  function toNumDecimal(value: unknown): number {
    const s = String(value ?? '').trim();
    if (!s) return 0;
    const n = Number(s.replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }

  // ---------- TanStack helper ----------
  const useProductsByCat = (catId: string, label: string) =>
    useQuery({
      queryKey: ['productsByCategory', catId], // ✅ единый шаблон
      queryFn: () => getProductsByCategoryApi(catId, token as string),
      enabled: Boolean(token),
      staleTime: 5 * 60 * 1000,
      retry: 1, 
      refetchOnWindowFocus: false,
      meta: { label },
    });

  // ---------- TanStack: products by categories ----------
  const qAdditional = useProductsByCat(ADDITIONAL_CAT, 'additional');
  const qProfil = useProductsByCat(PROFIL_CAT, 'profil');
  const qPlatform = useProductsByCat(PLATFORM_CAT, 'platform');
  const qLightRingA = useProductsByCat(LIGHT_RING_A, 'lightRingA');
  const qLightRingB = useProductsByCat(LIGHT_RING_B, 'lightRingB');

  const stretchAdditionalItems = useMemo(() => {
    const data: any = qAdditional.data;
    return Array.isArray(data?.items) ? data.items : [];
  }, [qAdditional.data]);

  const stretchProfilItems = useMemo(() => {
    const data: any = qProfil.data;
    return Array.isArray(data?.items) ? data.items : [];
  }, [qProfil.data]);

  const stretchLightPlatformItems = useMemo(() => {
    const data: any = qPlatform.data;
    return Array.isArray(data?.items) ? data.items : [];
  }, [qPlatform.data]);

  const stretchLightRingItems = useMemo(() => {
    const a: any = qLightRingA.data;
    const b: any = qLightRingB.data;
    const aItems = Array.isArray(a?.items) ? a.items : [];
    const bItems = Array.isArray(b?.items) ? b.items : [];
    return dedupById([...(aItems || []), ...(bItems || [])]);
  }, [qLightRingA.data, qLightRingB.data]);

  // ---------- logout only on auth errors ----------
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const errs = [qAdditional.error, qProfil.error, qPlatform.error, qLightRingA.error, qLightRingB.error].filter(Boolean);

    if (!errs.length) return;

    // TanStack error часто axios error
    const isAuthError = errs.some((e: any) => {
      const status = e?.response?.status;
      return status === 401 || status === 403;
    });

    if (isAuthError) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, qAdditional.error, qProfil.error, qPlatform.error, qLightRingA.error, qLightRingB.error]);

  useEffect(() => {
    const e: any = qAdditional.error || qProfil.error || qPlatform.error || qLightRingA.error || qLightRingB.error;
    if (!e) return;

    const status = e?.response?.status;
    const msg = e?.response?.data?.message || e?.message || 'Ошибка загрузки товаров';
    if (status && status !== 401 && status !== 403) {
      console.error('Products query error:', status, msg);
      alert(msg); 
    }
  }, [qAdditional.error, qProfil.error, qPlatform.error, qLightRingA.error, qLightRingB.error]);

  // ---------- load redux data (user/texture/bardutyun/work) ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!cookies?.access_token) {
          navigate('/');
          return;
        }

        const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
        if (userProfileResult?.error) {
          alert(userProfileResult.error || userProfileResult);
          logout();
          return;
        }
        if (userProfileResult?.user) setUser(userProfileResult.user);

        const stretchTextureResult = await dispatch(getAllStretchTexture(cookies)).unwrap();
        if (stretchTextureResult?.error) {
          alert(stretchTextureResult.error || stretchTextureResult);
          logout();
          return;
        }
        if (stretchTextureResult?.stretchTexture) setStretchTextureData(stretchTextureResult.stretchTexture);

        const stretchBardutyunResult = await dispatch(getAllStretchBardutyun(cookies)).unwrap();
        if (stretchBardutyunResult?.error) {
          alert(stretchBardutyunResult.error || stretchBardutyunResult);
          logout();
          return;
        }
        if (stretchBardutyunResult?.stretchBardutyun) setStretchBardutyunData(stretchBardutyunResult.stretchBardutyun);

        const allStretchWorkResult = await dispatch(allStretchWork(cookies)).unwrap();
        if (allStretchWorkResult?.error) {
          alert(allStretchWorkResult.error || allStretchWorkResult);
          logout();
          return;
        }
        if (allStretchWorkResult?.work) setStretchWorkData(allStretchWorkResult.work);
      } catch (error) {
        console.error('An error occurred:', error);
        logout();
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- totals: subscribe to form changes ----------
  useEffect(() => {
    const recalc = (formValues: Record<string, any>) => {
      let sumTotal = 0;
      const newRoomSum: Record<string, number> = {};

      room.forEach((roomObj) => {
        let roomSumValue = 0;
        for (const [key, value] of Object.entries(formValues)) {
          if (isRoomSumKey(key, roomObj.id)) {
            roomSumValue += toNumDecimal(value);
          }
        }
        newRoomSum[roomObj.id] = roomSumValue;
        roomObj.sum = roomSumValue;
        sumTotal += roomSumValue;
      });

      for (const [key, value] of Object.entries(formValues)) {
        if (key.startsWith('workSum_')) {
          sumTotal += toNumDecimal(value);
        }
      }

      setRoomSum(newRoomSum);
      setOrderSum(sumTotal);
    };

    recalc(getValues());

    const subscription = watch((formValues) => {
      recalc(formValues as Record<string, any>);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, watch, getValues]);

  // ---------- submit ----------
  const qountTotal = (order: any) => {
    const formValues = getValues();
    let sumTotal = 0;

    room.forEach((roomObj) => {
      let roomSumValue = 0;
      for (const [key, value] of Object.entries(formValues)) {
        if (isRoomSumKey(key, roomObj.id)) {
          roomSumValue += toNumDecimal(value);
        }
      }
      roomObj.sum = roomSumValue;
      sumTotal += roomSumValue;
    });

    const buyer = {
      buyerId: order.buyerId,
      buyerName: order.buyerName,
      buyerPhone1: order.buyerPhone1,
      buyerPhone2: order.buyerPhone2,
      buyerAddress: order.buyerAddress,
      buyerRegion: order.buyerRegion,
    };

    const stretchTextureOrder: any = filterOrder(
      order,
      room,
      stretchTextureData,
      stretchAdditionalItems,
      stretchProfilItems,
      stretchLightPlatformItems,
      stretchLightRingItems,
      stretchBardutyunData,
      stretchWorkData
    );

    stretchTextureOrder['prepayment'] = order.prepayment || 0;
    stretchTextureOrder['paymentMethod'] = order.paymentMethod;
    stretchTextureOrder['groundTotal'] = order.groundTotal || sumTotal;
    stretchTextureOrder['balance'] = balance;
    stretchTextureOrder['orderComment'] = order.orderComment;
    stretchTextureOrder['buyerComment'] = order.buyerComment;
    stretchTextureOrder['measureDate'] = order.measureDate;
    stretchTextureOrder['installDate'] = order.installDate;
    stretchTextureOrder['code'] = order.code;
    stretchTextureOrder['salary'] = order.stWorkerSalary;
    stretchTextureOrder['status'] = order.status;
    stretchTextureOrder['roomSum'] = sumTotal;
    stretchTextureOrder['address'] = order.buyerAddress;
    stretchTextureOrder['region'] = order.buyerRegion;
    if (order.stWorkerId !== 'Աշխատակից') {
      stretchTextureOrder['stWorkerId'] = order.stWorkerId;
    }

    dispatch(addNewStretchOrder({ stretchTextureOrder, buyer, cookies, user }))
      .unwrap()
      .then((res) => {
        if (res?.error) {
          alert(res.error);
        } else {
          reset();
          window.location.reload();
        }
      });
  };

  // ---------- modal ----------
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  function handleCheckboxRoom(event: ChangeEvent<HTMLInputElement>, el: any, index: number) {
    const updatedRoom = [...room];
    updatedRoom[index] = { ...el, isChecked: event.target.checked };
    setRoom(updatedRoom);
  }

  // ---------- works ----------
  const [workRowId, setWorkRowId] = useState<string[]>([]);
  const addWorkNewRow = () => setWorkRowId((prev) => [...prev, uuidv4()]);
  const removeWorkRow = (index: string) => {
    setValue(`work_${index}`, undefined, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setWorkRowId((prev) => prev.filter((id) => id !== index));
  };

  // ---------- delete room + clear its fields ----------
  const deleteRoom = (roomIndex: number) => {
    const victim = room[roomIndex];
    if (!victim) return;
    const victimId = victim.id;
    const suffix = victimId.slice(-15);
    const formValues = getValues();

    Object.keys(formValues).forEach((key) => {
      if (key.endsWith(suffix) || key.endsWith(`/${victimId}`)) {
        setValue(key as any, undefined, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      }
    });

    const updated = [...room];
    updated.splice(roomIndex, 1);
    setRoom(updated);
  };

  const prepaymentValue = toNumDecimal(watch('prepayment'));

  useEffect(() => {
    const next = balance - prepaymentValue;
    const current = toNumDecimal(getValues('groundTotal'));
    if (current !== next) {
      setValue('groundTotal', next, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, prepaymentValue, getValues, setValue]);

  // ---------- loading states ----------
  const isAnyLoading =
    qAdditional.isLoading ||
    qProfil.isLoading ||
    qPlatform.isLoading ||
    qLightRingA.isLoading ||
    qLightRingB.isLoading;

  return (
    <div className=''>
      <StretchMenu />

      {isAnyLoading ? <div style={{ padding: 20 }}>Loading...</div> : null}

      <form onSubmit={handleSubmit(qountTotal)}>
        <div>
          <BuyerSection register={register} setValue={setValue} />
        </div>

        <p style={{ height: '20px' }} />

        <div>
          <PaymentSection
            register={register}
            setValue={setValue}
            setPrepayment={setPrepayment}
            prepayment={prepayment}
            balance={balance}
            setBalance={setBalance}
          />
        </div>

        <div style={{ height: '20px' }} className="admin_profile_Strech" />

        <div style={{ display: 'flex', gap: '20px', margin: '5px' }}>
          <select style={{ border: '1px solid black' }} id="status" {...register('status', { required: true })}>
            <option value={'progress'}>Գրանցված</option>
            <option value={'measurement'}>Չափագրում</option>
            <option value={'installation'}>Տեղադրում</option>
            <option value={'dane'}>Ավարտված</option>
          </select>

          <button type='button' onClick={handleOpenModal}>
            Ավելացնել սենյակ
          </button>

          {room.length > 0 &&
            room.map((el, index) => (
              <div style={{ border: '1px solid black' }} key={el.id}>
                <label
                  htmlFor={`roomChecked_${el.id}`}
                  style={{
                    border: '1px solid black',
                    backgroundColor: '#dfdce0',
                    width: '150px',
                    textAlign: 'center',
                  }}
                >
                  {el.name} {roomSum[el.id] || 0}
                  <input
                    style={{ margin: '5px' }}
                    id={`roomChecked_${el.id}`}
                    type="checkbox"
                    onChange={(e) => handleCheckboxRoom(e, el, index)}
                  />
                </label>
                <button type="button" onClick={() => deleteRoom(index)}>
                  Հեռացնել
                </button>
              </div>
            ))}
        </div>

        <ModalRoom isOpen={isModalOpen} onClose={handleCloseModal} setRoom={setRoom} room={room} />

        <div className='roomBardutyun'>
          <div style={{ marginRight: '20px' }}>
            {room.length > 0 &&
              room.map((e) => (
                <RoomSection
                  key={e.id}
                  register={register}
                  reset={reset}
                  setValue={setValue}
                  watch={watch}
                  getValues={getValues}
                  roomId={e.id}
                  room={e}
                  stretchTextureData={stretchTextureData}
                  stretchAdditionalData={stretchAdditionalItems}
                  stretchProfilData={stretchProfilItems}
                  stretchLightPlatformData={stretchLightPlatformItems}
                  stretchLightRingData={stretchLightRingItems}
                  stretchBardutyunData={stretchBardutyunData}
                />
              ))}
          </div>

          <div className='stretchPatverSection'>
            <div style={{ margin: '5px' }}>
              <button style={{ marginRight: '5px' }} type="button" onClick={addWorkNewRow}>
                Աշխատանք
              </button>
            </div>

            <WorkSection
              register={register}
              setValue={setValue}
              getValues={getValues}
              workRowId={workRowId}
              removeWorkRow={removeWorkRow}
            />

            <div className='order_nkaragrutyun'>
              <textarea placeholder='Նկարագրություն' {...register(`orderComment`)} />
            </div>
          </div>
        </div>

        <div className="formdivStretch_1">
          <div className="buyer_label_1">
            <button type='submit'>Գրանցել</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TagStretchOrder;
