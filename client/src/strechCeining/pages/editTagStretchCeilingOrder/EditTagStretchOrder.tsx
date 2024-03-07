import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import { findStretchOrder, updateStretchOrderAll } from "../../stretchCeilingOrder/stretchOrderApi";
import { selectStretchOrder } from "../../stretchCeilingOrder/stretchOrderSlice";
import { getAllStretchAdditional } from "../../strechAdditional/strechAdditionalApi";
import { getAllStretchBardutyun } from "../../strechBardutyun/strechBardutyunApi";
import { getAllStretchLightPlatform } from "../../strechLightPlatform/strechLightPlatformApi";
import { getAllStretchLightRing } from "../../strechLightRing/strechLightRingApi";
import { getAllStretchProfil } from "../../strechProfil/strechProfilApi";
import { getAllStretchTexture } from "../../strechTexture/strechTextureApi";
import { selectStretchAdditional } from "../../strechAdditional/strechAdditionalSlice";
import { selectStretchBardutyun } from "../../strechBardutyun/strechBardutyunSlice";
import { selectStretchLightPlatform } from "../../strechLightPlatform/strechLightPlatformSlice";
import { selectStretchLightRing } from "../../strechLightRing/strechLightRingSlice";
import { selectStretchProfil } from "../../strechProfil/strechProfilSlice";
import { selectStretchTexture } from "../../strechTexture/strechTextureSlice";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { filterOrder } from "../addTagStretchCeilingOrder/logic";
import EditBuyerSection from "./EditBuyerSection";
import EditPaymentSection from "./EditPaymentSection";
import ModalRoom from "../../../component/modal/ModalRoom";
import EditRoomSection from "./EditRoomSection";
import { allStretchWork } from "../../StrechWork/strechWorkApi";
import { selectStretchWork } from "../../StrechWork/strechWorkSlice";
import EditWorkSection from "./EditWorkSection";




export const EditTagStretchOrder: React.FC = (): JSX.Element => {
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue, getValues, } = useForm<any>();
    const dispatch = useAppDispatch();
    const params = useParams()

    const [room, setRoom] = useState<{ id: string; name: string; isChecked: boolean }[]>([]);



    const [rooms, setRooms] = useState<any[]>([]);
    const [works, setWorks] = useState<any[]>([]);
    const [workRowId, setWorkRowId] = useState<any[]>([]);
    const [prepayment, setPrepeyment] = useState<number>(0)


    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' });
                navigate("/");
            }
        });

        dispatch(findStretchOrder({ params, cookies })).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' });
                navigate("/");
            } else {
                if (typeof res.rooms === 'object' && res.rooms !== null) {
                    const rooms: any = Object.values(res.rooms) as any;
                    setRooms(rooms);
                }
                if (res.groupedWorks !== undefined && res.groupedWorks !== null) {
                    const works: any = Object.values(res.groupedWorks)
                    setWorks(works)
                    Object.entries(res.groupedWorks).forEach(([key, value]: [string, any], index: number) => {
                        const rowId = key.split('/')[0];
                        setWorkRowId((prevRowId) => [...prevRowId, rowId]);
                    });
                }
                setPrepeyment(res.prepayment)

            }
        });
        dispatch(getAllStretchTexture(cookies)).unwrap().then(res => {
            if ('error' in res) {
                alert(res);
            }
        });
        dispatch(getAllStretchAdditional(cookies)).unwrap().then(res => {
            if ("error" in res) {
                alert(res);
            }
        });
        dispatch(getAllStretchProfil(cookies)).unwrap().then(res => {
            if ("error" in res) {
                alert(res)
            }
        });
        dispatch(getAllStretchLightPlatform(cookies)).unwrap().then(res => {
            if ("error" in res) {
                alert(res)
            }
        });
        dispatch(getAllStretchLightRing(cookies)).unwrap().then(res => {
            if ("error" in res) {
                alert(res)
            }
        });
        dispatch(getAllStretchBardutyun(cookies)).unwrap().then(res => {
            if ("error" in res) {
                alert(res)
            }
        });
        dispatch(allStretchWork(cookies)).unwrap().then(res => {
            if ("error" in res) {
                alert(res)
            }
        })


    }, []);




    useEffect(() => {
        if (rooms.length > 0) {
            setRoom(rooms.map(room => ({ id: room.id, name: room.name, isChecked: false })));
        }
    }, [rooms]);



    const order = useAppSelector(selectStretchOrder).stretchOrder;
    const user = useAppSelector(selectUser);
    const stretchTextureData = useAppSelector(selectStretchTexture);
    const stretchAdditionalData = useAppSelector(selectStretchAdditional);
    const stretchProfilData = useAppSelector(selectStretchProfil);
    const stretchLightPlatformData = useAppSelector(selectStretchLightPlatform);
    const stretchLightRingData = useAppSelector(selectStretchLightRing);
    const stretchBardutyunData = useAppSelector(selectStretchBardutyun);
    const stretchWorkData = useAppSelector(selectStretchWork)


    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }



    const [addOrder, setAddOrder] = useState({});
    const [orderSum, setOrderSum] = useState(0);
    const [orderBalance, setOrderBalance] = useState(0);


    const qountTotal = (updatingOrder: any, event: any) => {
        const buyer = {
            buyerId: updatingOrder.buyerId,
            buyerName: updatingOrder.buyerName,
            buyerPhone1: updatingOrder.buyerPhone1,
            buyerPhone2: updatingOrder.buyerPhone2,
            buyerAddress: updatingOrder.buyerAddress,
            buyerRegion: updatingOrder.buyerRegion
        }

        const stretchTextureOrder: any = filterOrder(
            updatingOrder,
            room,
            stretchTextureData.arrStretchTexture,
            stretchAdditionalData.arrStretchAdditional,
            stretchProfilData.arrStretchProfil,
            stretchLightPlatformData.arrStretchLightPlatform,
            stretchLightRingData.arrStretchLightRing,
            stretchBardutyunData.arrStretchBardutyun,
            stretchWorkData.arrStretchWork
        )

        stretchTextureOrder["prepayment"] = +updatingOrder.prepayment
        stretchTextureOrder["paymentMethod"] = updatingOrder.paymentMethod
        stretchTextureOrder["groundTotal"] = updatingOrder.groundTotal
        stretchTextureOrder["balance"] = updatingOrder.balance
        stretchTextureOrder["orderComment"] = updatingOrder.orderComment
        stretchTextureOrder["buyerComment"] = updatingOrder.buyerComment
        stretchTextureOrder["measureDate"] = updatingOrder.measureDate
        stretchTextureOrder["installDate"] = updatingOrder.installDate
        stretchTextureOrder["code"] = updatingOrder.code
        stretchTextureOrder["salary"] = updatingOrder.stretchWorkerSalary
        stretchTextureOrder["worker"] = updatingOrder.stretchWorkerId
        console.log(stretchTextureOrder);
        

        dispatch(updateStretchOrderAll({ params, buyer, stretchTextureOrder, cookies, user: user.profile })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
    };


    const newOrder = () => {
        // dispatch(addNewStretchOrder({ addOrder, cookies, user: user.profile })).unwrap().then(res => {
        //     if ("error" in res) {
        //         alert(res.error)
        //     }
        // });

        // window.location.reload()

    };


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const tagStretchBuyer = () => {
        window.open("/tagstretchceiling/addTagStretchBuyer")
    }
    const tagStretchWorkerr = () => {
        window.open("/tagstretchceiling/addTagStretchWorker")
    }
    function goTo(event: ChangeEvent<HTMLSelectElement>): void {
        window.open(event.target.value)

    }
    const newTagStretchOrder = () => {
        window.open("/stretchceiling/addTagStretchOrder")
    }

    function handleCheckboxRoom(event: ChangeEvent<HTMLInputElement>, el: any, index: number) {
        const updatedRoom = [...room];
        updatedRoom[index] = { ...el, isChecked: event.target.checked };
        setRoom(updatedRoom);
    }



    const addWorkNewRow = () => {
        setWorkRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    };

    const removeWorkRow = (index: any,) => {
        reset({ [`work_${index}`]: '' })
        console.log(workRowId, index);
        
        setWorkRowId(prevRowId => {
            return prevRowId.filter((_, i) => _ !== index);
        });
    };

    const deleteRoom = (roomId: any) => {
        const updatedRoom = [...room]
        updatedRoom.splice(roomId, 1);
        setRoom(updatedRoom);
    }


    return (
        <div className=''>
            <div className="admin_profile_Strech">
                <div >
                    <button className="btn" onClick={newTagStretchOrder} >Նոր Պատվեր</button>
                    <select onChange={(e) => goTo(e)} className="btn" style={{ height: "35px" }}>
                        <option>Ապրանք</option>
                        <option value={"/stretchTexture"}>Ձգվող Առաստաղ</option>
                        <option value={"/stretchceiling/addStretchBardutyun"}>Բարդություն</option>
                        <option value={"/stretchceiling/addStretchProfil"}>Պրոֆիլ</option>
                        <option value={"/stretchceiling/addStretchLightPlatform"}>Լույսի Պլատֆորմ</option>
                        <option value={"/stretchceiling/addStretchLightRing"}>Լույսի Օղակ</option>
                        <option value={"/stretchceiling/addStretchAdditional"}>Լռացուցիչ</option>
                    </select>
                    <button className="btn" onClick={tagStretchBuyer}>Ավելացնել Գնորդ</button>
                    <button className="btn" onClick={tagStretchWorkerr}>Ավելացնել Աշխատակից</button>
                    <button className="btn">Դիտել Պատվերները</button>
                </div>
            </div>
            <form onSubmit={handleSubmit(qountTotal)}>
                <div className=''>
                    <EditBuyerSection
                        buyer={order.buyer}
                        installDate={order.installDate}
                        measureDate={order.measureDate}
                        register={register}
                        setValue={setValue}
                        code={order.code}
                    />
                </div>
                <p style={{
                    height: "20px"
                }}>
                </p>
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
                        stretchWorkerId={order.stretchWorker}
                        stretchWorkerSalary={order.salary}
                        setPrepeyment={setPrepeyment}
                    />
                </div>
                <div
                    style={{
                        height: "20px"
                    }}
                    className="admin_profile_Strech"
                >

                </div>
                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        margin: "5px"
                    }}>
                    <button onClick={handleOpenModal}>
                        Ավելացնել սենյակ
                    </button>
                    {
                        room.length > 0 ?
                            room.map((el: any, index: number) => {
                                return (
                                    <div style={{ border: "1px solid black" }} key={index}>
                                        <label
                                            htmlFor={`roomChecked_${el.id}`}

                                            style={{
                                                border: "1px solid black",
                                                backgroundColor: "#dfdce0",
                                                width: "150px",
                                                textAlign: "center"
                                            }}>
                                            {el.name}
                                            <input
                                                style={{ margin: "5px" }}
                                                id={`roomChecked_${el.id}`}
                                                type="checkbox"
                                                onChange={(e) => handleCheckboxRoom(e, el, index)} />
                                        </label>
                                        <button type="button"
                                            onClick={() => deleteRoom(index)}
                                        >Հեռացնել</button>
                                    </div>
                                )
                            }) : null
                    }
                </div>
                <ModalRoom isOpen={isModalOpen} onClose={handleCloseModal} setRoom={setRoom} room={room} />
                <div className='roomBardutyun'>
                    <div style={{ marginRight: "20px" }}>
                        {
                            room.length > 0 ?
                                room.map((e: any, i: number) => {
                                    return (
                                        <EditRoomSection
                                            register={register}
                                            reset={reset}
                                            setValue={setValue}
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
                                    )
                                })

                                : null
                        }
                    </div>
                    <div className='stretchPatverSection' >
                        <div style={{ margin: "5px" }}>
                            <button
                                style={{ marginRight: "5px" }}
                                type="button"
                                onClick={addWorkNewRow}>
                                Աշխատանք
                            </button>

                        </div>
                        <EditWorkSection
                            register={register}
                            setValue={setValue}
                            workRowId={workRowId}
                            removeWorkRow={removeWorkRow}
                            stretchWork={stretchWorkData}
                            workId={works}
                        />

                        <div className='order_nkaragrutyun'>
                            <textarea
                                placeholder='Նկարագրություն'
                                {...register(`orderComment`)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="formdivStretch_1" >
                    <div className="buyer_label_1">
                        <button className="btn btn1" type='button' onClick={newOrder}>Գրանցել</button>
                        <button className='btn btn1' type='submit'>Հաշվարկել</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

