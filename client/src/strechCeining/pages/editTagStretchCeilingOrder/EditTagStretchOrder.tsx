import { useAppDispatch } from "../../../app/hooks";
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { userProfile } from "../../../features/user/userApi";
import { findStretchOrder, updateStretchOrderAll } from "../../features/stretchCeilingOrder/stretchOrderApi";
import { getAllStretchAdditional } from "../../features/strechAdditional/strechAdditionalApi";
import { getAllStretchBardutyun } from "../../features/strechBardutyun/strechBardutyunApi";
import { getAllStretchLightPlatform } from "../../features/strechLightPlatform/strechLightPlatformApi";
import { getAllStretchLightRing } from "../../features/strechLightRing/strechLightRingApi";
import { getAllStretchProfil } from "../../features/strechProfil/strechProfilApi";
import { getAllStretchTexture } from "../../features/strechTexture/strechTextureApi";
import { useForm, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { filterOrder } from "../addTagStretchCeilingOrder/logic";
import EditBuyerSection from "./EditBuyerSection";
import EditPaymentSection from "./EditPaymentSection";
import ModalRoom from "../../../component/modal/ModalRoom";
import EditRoomSection from "./EditRoomSection";
import { allStretchWork } from "../../features/StrechWork/strechWorkApi";
import EditWorkSection from "./EditWorkSection";
import { StretchMenu } from "../../../component/menu/StretchMenu";
import { Data } from "../addTagStretchCeilingOrder/TagStretchOrder";

export const EditTagStretchOrder: React.FC = (): JSX.Element => {
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useAppDispatch();

    const { register, handleSubmit, reset, setValue, getValues, watch, control } = useForm<any>();
    
    const watchedValues = useWatch({ control }); // Следим за всеми полями формы

    const [user, setUser] = useState<any>();
    const [stretchTextureData, setStretchTextureData] = useState<Array<Data>>([]);
    const [stretchAdditionalData, setStretchAdditionalData] = useState<Array<Data>>([]);
    const [stretchProfilData, setStretchProfilData] = useState<Array<Data>>([]);
    const [stretchLightPlatformData, setStretchLightPlatformData] = useState<Array<Data>>([]);
    const [stretchLightRingData, setStretchLightRingData] = useState<Array<Data>>([]);
    const [stretchBardutyunData, setStretchBardutyunData] = useState<Array<Data>>([]);
    const [stretchWorkData, setStretchWorkData] = useState<Array<Data>>([]);

    const [room, setRoom] = useState<{ id: string; name: string; isChecked: boolean; sum: number }[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [roomSum, setRoomSum] = useState<{ [id: string]: number }>({});
    const [works, setWorks] = useState<any[]>([]);
    const [workRowId, setWorkRowId] = useState<string[]>([]);
    const [prepayment, setPrepayment] = useState<number>(0);
    const [order, setOrder] = useState<any>({});
    const { address, region } = order ?? {};

    // Загрузка данных при монтировании
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                const stretchOrderResult = await dispatch(findStretchOrder({ params, cookies })).unwrap();
                const stretchTextureResult = await dispatch(getAllStretchTexture(cookies)).unwrap();
                const stretchAdditionalResult = await dispatch(getAllStretchAdditional(cookies)).unwrap();
                const stretchProfilResult = await dispatch(getAllStretchProfil(cookies)).unwrap();
                const stretchLightPlatformResult = await dispatch(getAllStretchLightPlatform(cookies)).unwrap();
                const stretchLightRingResult = await dispatch(getAllStretchLightRing(cookies)).unwrap();
                const stretchBardutyunResult = await dispatch(getAllStretchBardutyun(cookies)).unwrap();
                const allStretchWorkResult = await dispatch(allStretchWork(cookies)).unwrap();

                handleResult(userProfileResult);
                handleResult(stretchOrderResult);
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
            if ("error" in result) {
                alert(result);
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

            if (result.groupedWorks) {
                const works = Object.values(result.groupedWorks);
                setWorks(works);
                Object.entries(result.groupedWorks).forEach(([key]) => {
                    const rowId = key.split("/")[0];
                    setWorkRowId((prevRowId) => {
                        if (!prevRowId.includes(rowId)) return [...prevRowId, rowId];
                        return prevRowId;
                    });
                });
            }
            if (result.order) {
                setValue("orderComment", result.order.orderComment);
                setPrepayment(Number(result.order.prepayment) || 0);
                setValue('status', result.order.status);
                setOrder(result.order);
            }
        };

        fetchData();
    }, [cookies, dispatch, navigate, params, setCookie, setValue]);

    // При изменении order.rooms подготавливаем локальный room
    useEffect(() => {
        if (order.rooms && typeof order.rooms === "object") {
            const roomsArray = Object.values(order.rooms);
            setRooms(roomsArray);
        }
    }, [order]);

    useEffect(() => {
        if (rooms.length > 0) {
            setRoom(rooms.map(room => ({ id: room.id, name: room.name, isChecked: false, sum: 0 })));
        }
    }, [rooms]);

    // Автоматический пересчет суммы при изменении watchedValues
    useEffect(() => {
        const formValues = watchedValues;
        const newRoomSum: { [id: string]: number } = {};
        let totalSum = 0;

        // Суммируем по комнатам
        room.forEach(roomObj => {
            for (const [key, value] of Object.entries(formValues)) {
                if (roomObj.id.slice(-15) === key.slice(-15) && key.includes("Sum")) {
                    const numericValue = Number(value) || 0;
                    totalSum += numericValue;
                    newRoomSum[roomObj.id] = (newRoomSum[roomObj.id] || 0) + numericValue;
                    roomObj.sum = newRoomSum[roomObj.id];
                }
            }
        });

        // Суммируем по работам
        workRowId.forEach(rowId => {
            for (const [key, value] of Object.entries(formValues)) {
                if (key.startsWith(`work_${rowId}`) && key.includes("Sum")) {
                    totalSum += Number(value) || 0;
                }
            }
        });

        setOrderSum(totalSum);
        setRoomSum(newRoomSum);

        // Автоматически обновляем итоговые поля формы
        const prepay = Number(prepayment) || 0;
        // setValue("groundTotal", totalSum - prepay);
        // setValue("balance", totalSum);
    }, [watchedValues, room, workRowId, setValue]);

    // Отправка формы
    const qountTotal = (updatingOrder: any) => {
        const buyer = {
            buyerId: updatingOrder.buyerId,
            buyerName: updatingOrder.buyerName,
            buyerPhone1: updatingOrder.buyerPhone1,
            buyerPhone2: updatingOrder.buyerPhone2,
            buyerAddress: updatingOrder.buyerAddress,
            buyerRegion: updatingOrder.buyerRegion
        };

        const stretchTextureOrder: any = filterOrder(
            updatingOrder,
            room,
            stretchTextureData,
            stretchAdditionalData,
            stretchProfilData,
            stretchLightPlatformData,
            stretchLightRingData,
            stretchBardutyunData,
            stretchWorkData
        );

        stretchTextureOrder["prepayment"] = Number(prepayment) || 0;
        stretchTextureOrder["paymentMethod"] = updatingOrder.paymentMethod;
        stretchTextureOrder["groundTotal"] = updatingOrder.groundTotal;
        stretchTextureOrder["balance"] = updatingOrder.balance;
        stretchTextureOrder["orderComment"] = updatingOrder.orderComment;
        stretchTextureOrder["buyerComment"] = updatingOrder.buyerComment;
        stretchTextureOrder["measureDate"] = updatingOrder.measureDate;
        stretchTextureOrder["installDate"] = updatingOrder.installDate;
        stretchTextureOrder["code"] = updatingOrder.code;
        stretchTextureOrder["salary"] = updatingOrder.stWorkerSalary;
        stretchTextureOrder["roomSum"] = orderSum;
        stretchTextureOrder["address"] = updatingOrder.address;
        stretchTextureOrder["region"] = updatingOrder.region;

        if (updatingOrder.stWorkerId !== "Աշխատակից") {
            stretchTextureOrder["stWorkerId"] = updatingOrder.stWorkerId;
        } else {
            stretchTextureOrder["stWorkerId"] = null;
        }

        dispatch(updateStretchOrderAll({ params, buyer, stretchTextureOrder, cookies, user })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error);
            } else {
                navigate('/stretchceiling/viewStretchOrder/' + params.id);
            }
        });
    };

    // Управление модалкой
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Управление комнатами
    function handleCheckboxRoom(event: ChangeEvent<HTMLInputElement>, el: any, index: number) {
        const updatedRoom = [...room];
        updatedRoom[index] = { ...el, isChecked: event.target.checked };
        setRoom(updatedRoom);
    }
    const deleteRoom = (roomId: number) => {
        const updatedRoom = [...room];
        updatedRoom.splice(roomId, 1);
        setRoom(updatedRoom);
    };

    // Управление работами
    const addWorkNewRow = () => {
        setWorkRowId(prevRowId => [...prevRowId, uuidv4()]);
    };

    const removeWorkRow = (index: string) => {
        reset({ [`work_${index}`]: '' });
        setWorkRowId(prevRowId => prevRowId.filter(id => id !== index));
    };

    const [orderSum, setOrderSum] = useState(0);

    return (
        <div className=''>
            <StretchMenu />
            <form onSubmit={handleSubmit(qountTotal)}>
                <div>
                    <EditBuyerSection
                        buyer={order.buyer}
                        installDate={order.installDate}
                        measureDate={order.measureDate}
                        register={register}
                        setValue={setValue}
                        code={order.code}
                        address={address}
                        region={region}
                    />
                </div>
                <p style={{ height: "20px" }}></p>
                <div>
                    <EditPaymentSection
                        register={register}
                        setOrderSum={setOrderSum}
                        paymentMethod={order.paymentMethod}
                        setValue={setValue}
                        balance={order.balance}
                        prepayment={prepayment}
                        groundTotal={order.groundTotal}
                        buyerComment={order.buyerComment}
                        stWorkerId={order.stWorker}
                        stWorkerSalary={order.salary}
                        setPrepeyment={setPrepayment}
                    />
                </div>
                <div style={{ height: "20px" }} className="admin_profile_Strech"></div>
                <div style={{ display: "flex", gap: "20px", margin: "5px" }}>
                    {/* Кнопки — «Հաշվել» можно убрать, т.к. пересчет автоматический */}
                    <button type="button" onClick={handleOpenModal}>Ավելացնել սենյակ</button>
                    {
                        room.length > 0 && room.map((el, index) => (
                            <div style={{ border: "1px solid black" }} key={index}>
                                <label
                                    htmlFor={`roomChecked_${el.id}`}
                                    style={{
                                        border: "1px solid black",
                                        backgroundColor: "#dfdce0",
                                        width: "150px",
                                        textAlign: "center"
                                    }}>
                                    {el.name} {roomSum[el.id] || 0}
                                    <input
                                        style={{ margin: "5px" }}
                                        id={`roomChecked_${el.id}`}
                                        type="checkbox"
                                        checked={el.isChecked}
                                        onChange={(e) => handleCheckboxRoom(e, el, index)}
                                    />
                                </label>
                                <button type="button" onClick={() => deleteRoom(index)}>Հեռացնել</button>
                            </div>
                        ))
                    }
                </div>
                <ModalRoom isOpen={isModalOpen} onClose={handleCloseModal} setRoom={setRoom} room={room} />
                <div className='roomBardutyun'>
                    <div style={{ marginRight: "20px" }}>
                        {
                            room.length > 0 && room.map((e, i) => (
                                <EditRoomSection
                                    register={register}
                                    reset={reset}
                                    setValue={setValue}
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
                                    rooms={rooms}
                                />
                            ))
                        }
                    </div>
                    <div className='stretchPatverSection'>
                        <div style={{ margin: "5px" }}>
                            <button style={{ marginRight: "5px" }} type="button" onClick={addWorkNewRow}>Աշխատանք</button>
                        </div>
                        <EditWorkSection
                            register={register}
                            setValue={setValue}
                            getValues={getValues}
                            workRowId={workRowId}
                            removeWorkRow={removeWorkRow}
                            stretchWork={stretchWorkData}
                            workId={works}
                        />
                        <div className='order_nkaragrutyun'>
                            <textarea placeholder='Նկարագրություն' {...register(`orderComment`)}></textarea>
                        </div>
                    </div>
                </div>
                <div className="formdivStretch_1">
                    <div className="buyer_label_1">
                        <button className='btn btn1' type='submit'>Գրանցել</button>
                    </div>
                </div>
            </form>
        </div>
    );
};
