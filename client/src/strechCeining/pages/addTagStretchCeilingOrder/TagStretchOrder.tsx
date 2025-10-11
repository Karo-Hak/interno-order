import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
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
import { getAllStretchAdditional } from '../../features/strechAdditional/strechAdditionalApi';
import { getAllStretchProfil } from '../../features/strechProfil/strechProfilApi';
import { getAllStretchLightPlatform } from '../../features/strechLightPlatform/strechLightPlatformApi';
import { getAllStretchLightRing } from '../../features/strechLightRing/strechLightRingApi';
import { getAllStretchBardutyun } from '../../features/strechBardutyun/strechBardutyunApi';
import { allStretchWork } from '../../features/StrechWork/strechWorkApi';
import { StretchMenu } from '../../../component/menu/StretchMenu';
import './tagStretchOrder.css';
import { addNewStretchOrder } from '../../features/stretchCeilingOrder/stretchOrderApi';

export interface Data {
  id: string;
  _id: string;
  name: string;
  price: number;
  quantity: number;
  sum: number;
}

const TagStretchOrder: React.FC = (): JSX.Element => {
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, watch, getValues } = useForm<any>();
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<any>(null);
  const [stretchTextureData, setStretchTextureData] = useState<any>(null);
  const [stretchAdditionalData, setStretchAdditionalData] = useState<any>(null);
  const [stretchProfilData, setStretchProfilData] = useState<any>(null);
  const [stretchLightPlatformData, setStretchLightPlatformData] = useState<any>(null);
  const [stretchLightRingData, setStretchLightRingData] = useState<any>(null);
  const [stretchBardutyunData, setStretchBardutyunData] = useState<any>(null);
  const [stretchWorkData, setStretchWorkData] = useState<any>(null);

  const [roomSum, setRoomSum] = useState<{ [key: string]: number }>({});
  const [orderSum, setOrderSum] = useState(0);
  const [prepayment, setPrepayment] = useState(0);
  const [balance, setBalance] = useState(0);

  const [room, setRoom] = useState<{ id: string; name: string; isChecked: boolean; sum: number }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---------- helpers ----------
  function isRoomSumKey(key: string, roomId: string) {
    const suffix15 = roomId.slice(-15);
    return key.includes('Sum') && (key.endsWith(suffix15) || key.endsWith(`/${roomId}`));
  }
  function toNum(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  // ---------- load data ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
        const stretchTextureResult = await dispatch(getAllStretchTexture(cookies)).unwrap();
        const stretchAdditionalResult = await dispatch(getAllStretchAdditional(cookies)).unwrap();
        const stretchProfilResult = await dispatch(getAllStretchProfil(cookies)).unwrap();
        const stretchLightPlatformResult = await dispatch(getAllStretchLightPlatform(cookies)).unwrap();
        const stretchLightRingResult = await dispatch(getAllStretchLightRing(cookies)).unwrap();
        const stretchBardutyunResult = await dispatch(getAllStretchBardutyun(cookies)).unwrap();
        const allStretchWorkResult = await dispatch(allStretchWork(cookies)).unwrap();

        handleResult(userProfileResult);
        handleResult(stretchTextureResult);
        handleResult(stretchAdditionalResult);
        handleResult(stretchProfilResult);
        handleResult(stretchLightPlatformResult);
        handleResult(stretchLightRingResult);
        handleResult(stretchBardutyunResult);
        handleResult(allStretchWorkResult);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    const handleResult = (result: any) => {
      if (result?.error) {
        alert(result.error || result);
        setCookie('access_token', '', { path: '/' });
        navigate('/');
      } else {
        processResult(result);
      }
    };

    const processResult = (result: any) => {
      if (result.user) setUser(result.user);
      else if (result.stretchTexture) setStretchTextureData(result.stretchTexture);
      else if (result.stretchAdditional) setStretchAdditionalData(result.stretchAdditional);
      else if (result.stretchProfil) setStretchProfilData(result.stretchProfil);
      else if (result.lightPlatform) setStretchLightPlatformData(result.lightPlatform);
      else if (result.lightRing) setStretchLightRingData(result.lightRing);
      else if (result.stretchBardutyun) setStretchBardutyunData(result.stretchBardutyun);
      else if (result.work) setStretchWorkData(result.work);
    };

    fetchData();
  }, []);

  // ---------- totals: subscribe to form changes ----------
// --- totals: subscribe to form changes (без setValue здесь!)
useEffect(() => {
  const recalc = (formValues: Record<string, any>) => {
    let sumTotal = 0;
    const newRoomSum: { [key: string]: number } = {};

    // room sums
    room.forEach((roomObj) => {
      let roomSumValue = 0;
      for (const [key, value] of Object.entries(formValues)) {
        if (isRoomSumKey(key, roomObj.id)) {
          roomSumValue += toNum(value);
        }
      }
      newRoomSum[roomObj.id] = roomSumValue;
      roomObj.sum = roomSumValue;
      sumTotal += roomSumValue;
    });

    // work sums
    for (const [key, value] of Object.entries(formValues)) {
      if (key.startsWith('workSum_')) {
        sumTotal += toNum(value);
      }
    }

    setRoomSum(newRoomSum);
    setOrderSum(sumTotal);
  };

  // initial run
  recalc(getValues());

  // subscribe to all form changes
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
          roomSumValue += toNum(value);
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
      stretchAdditionalData,
      stretchProfilData,
      stretchLightPlatformData,
      stretchLightRingData,
      stretchBardutyunData,
      stretchWorkData
    );
console.log(order);

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

  // ---------- works (без reset, чтобы не ронять форму) ----------
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

  // --- groundTotal = balance - prepayment (отдельный эффект, без рекурсии)
const prepaymentValue = toNum(watch('prepayment'));

useEffect(() => {
  const next = balance - prepaymentValue;
  const current = toNum(getValues('groundTotal'));
  if (current !== next) {
    setValue('groundTotal', next, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }
  // одновременно держим локальный state prepayment в актуальном виде, если он нужен
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [balance, prepaymentValue, getValues, setValue]);


  return (
    <div className=''>
      <StretchMenu />
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
          <select
            style={{ border: '1px solid black' }}
            id="status"
            {...register('status', { required: true })}
          >
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
                  stretchAdditionalData={stretchAdditionalData}
                  stretchProfilData={stretchProfilData}
                  stretchLightPlatformData={stretchLightPlatformData}
                  stretchLightRingData={stretchLightRingData}
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
