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

export const TagStretchOrderx: React.FC = (): JSX.Element => {
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

    // Загрузка данных
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
                console.error("An error occurred:", error);
            }
        };

        const handleResult = (result: any) => {
            if (result?.error) {
                alert(result.error || result);
                setCookie("access_token", "", { path: "/" });
                navigate("/");
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

    // Автоматический пересчет суммы при изменении полей
    useEffect(() => {
        const formValues = getValues();
        let sumTotal = 0;
        const newRoomSum: { [key: string]: number } = {};

        // Считаем суммы по комнатам
        room.forEach(roomObj => {
            let roomSumValue = 0;
            for (const [key, value] of Object.entries(formValues)) {
                if (
                    key.includes("Sum") &&
                    key.endsWith(roomObj.id.slice(-15)) &&
                    typeof value === "number" &&
                    !isNaN(value)
                ) {
                    roomSumValue += value;
                }
            }
            newRoomSum[roomObj.id] = roomSumValue;
            roomObj.sum = roomSumValue;
            sumTotal += roomSumValue;
        });

        // Считаем суммы по работам (WorkSection)
        for (const [key, value] of Object.entries(formValues)) {
            if (
                key.startsWith("workSum_") && // или другая твоя логика именования
                typeof value === "number" &&
                !isNaN(value)
            ) {
                sumTotal += value;
            }
        }

        setRoomSum(newRoomSum);
        setOrderSum(sumTotal);

        // setValue("balance", sumTotal);

        const prepay = parseFloat(formValues.prepayment) || 0;
        const groundTotalCalc = balance - prepay;
        setValue("groundTotal", groundTotalCalc);
        // setBalance(sumTotal);
        setPrepayment(prepay);
    }, [watch()]);


    // Обработчик отправки формы
    const qountTotal = (order: any) => {
        // Повторно считаем перед отправкой, на всякий случай
        const formValues = getValues();
        let sumTotal = 0;
        room.forEach(roomObj => {
            let roomSumValue = 0;
            for (const [key, value] of Object.entries(formValues)) {
                if (
                    key.includes("Sum") &&
                    key.endsWith(roomObj.id.slice(-15)) &&
                    typeof value === "number" &&
                    !isNaN(value)
                ) {
                    roomSumValue += value;
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

        stretchTextureOrder["prepayment"] = order.prepayment || 0;
        stretchTextureOrder["paymentMethod"] = order.paymentMethod;
        stretchTextureOrder["groundTotal"] = order.groundTotal || sumTotal;
        stretchTextureOrder["balance"] = balance;
        stretchTextureOrder["orderComment"] = order.orderComment;
        stretchTextureOrder["buyerComment"] = order.buyerComment;
        stretchTextureOrder["measureDate"] = order.measureDate;
        stretchTextureOrder["installDate"] = order.installDate;
        stretchTextureOrder["code"] = order.code;
        stretchTextureOrder["salary"] = order.stWorkerSalary;
        stretchTextureOrder["status"] = order.status;
        stretchTextureOrder["roomSum"] = sumTotal;
        stretchTextureOrder["address"] = order.buyerAddress;
        stretchTextureOrder["region"] = order.buyerRegion;
        if (order.stretchWorkerId !== "Աշխատակից") {
            stretchTextureOrder["stWorker"] = order.stWorkerId;
        }

        dispatch(addNewStretchOrder({ stretchTextureOrder, buyer, cookies, user }))
            .unwrap()
            .then(res => {
                if (res?.error) {
                    alert(res.error);
                } else {
                    reset();
                    window.location.reload();
                }
            });
    };

    // Остальные хендлеры и функции остаются без изменений
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    function handleCheckboxRoom(event: ChangeEvent<HTMLInputElement>, el: any, index: number) {
        const updatedRoom = [...room];
        updatedRoom[index] = { ...el, isChecked: event.target.checked };
        setRoom(updatedRoom);
    }

    const [workRowId, setWorkRowId] = useState<string[]>([]);
    const addWorkNewRow = () => setWorkRowId(prev => [...prev, uuidv4()]);
    const removeWorkRow = (index: string) => {
        reset({ [`work_${index}`]: '' });
        setWorkRowId(prev => prev.filter(id => id !== index));
    };

    const deleteRoom = (roomId: number) => {
        const updatedRoom = [...room];
        updatedRoom.splice(roomId, 1);
        setRoom(updatedRoom);
    };

    return (
        <div className=''>
            <StretchMenu />
            <form onSubmit={handleSubmit(qountTotal)}>
                <div>
                    <BuyerSection register={register} setValue={setValue} />
                </div>
                <p style={{ height: "20px" }}></p>
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
                <div style={{ height: "20px" }} className="admin_profile_Strech" />
                <div style={{ display: "flex", gap: "20px", margin: "5px" }}>
                    <select
                        style={{ border: "1px solid black" }}
                        id="status"
                        {...register("status", { required: true })}
                    >
                        <option value={"progress"}>Գրանցված</option>
                        <option value={"measurement"}>Չափագրում</option>
                        <option value={"installation"}>Տեղադրում</option>
                        <option value={"dane"}>Ավարտված</option>
                    </select>
                    {/* Кнопка "Հաշվել" не нужна, расчет автоматический */}
                    <button type='button' onClick={handleOpenModal}>
                        Ավելացնել սենյակ
                    </button>
                    {room.length > 0 &&
                        room.map((el, index) => (
                            <div style={{ border: "1px solid black" }} key={el.id}>
                                <label
                                    htmlFor={`roomChecked_${el.id}`}
                                    style={{
                                        border: "1px solid black",
                                        backgroundColor: "#dfdce0",
                                        width: "150px",
                                        textAlign: "center",
                                    }}
                                >
                                    {el.name} {roomSum[el.id] || 0}
                                    <input
                                        style={{ margin: "5px" }}
                                        id={`roomChecked_${el.id}`}
                                        type="checkbox"
                                        onChange={e => handleCheckboxRoom(e, el, index)}
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
                    <div style={{ marginRight: "20px" }}>
                        {room.length > 0 &&
                            room.map((e, i) => (
                                <RoomSection
                                    register={register}
                                    reset={reset}
                                    setValue={setValue}
                                    watch={watch}
                                    getValues={getValues}
                                    roomId={e.id}
                                    room={e}
                                    key={i}
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
                        <div style={{ margin: "5px" }}>
                            <button style={{ marginRight: "5px" }} type="button" onClick={addWorkNewRow}>
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
