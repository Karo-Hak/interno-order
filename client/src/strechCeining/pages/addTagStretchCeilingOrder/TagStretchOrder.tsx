import React, { ChangeEvent, useEffect, useState, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { userProfile } from '../../../features/user/userApi';
import BuyerSection from './BuyerSection';
import PaymentSection from './PaymentSection';
import { filterOrder } from './logic';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/user/userSlice';
import { addNewStretchOrder, viewNewOrders } from '../../stretchCeilingOrder/stretchOrderApi';
import RoomSection from './RoomSection';
import './tagStretchOrder.css';
import ModalRoom from '../../../component/modal/ModalRoom';
import { v4 as uuidv4 } from 'uuid';
import WorkSection from './WorkSection';
import { getAllStretchTexture } from '../../strechTexture/strechTextureApi';
import { selectStretchTexture } from '../../strechTexture/strechTextureSlice';
import { getAllStretchAdditional } from '../../strechAdditional/strechAdditionalApi';
import { selectStretchAdditional } from '../../strechAdditional/strechAdditionalSlice';
import { getAllStretchProfil } from '../../strechProfil/strechProfilApi';
import { selectStretchProfil } from '../../strechProfil/strechProfilSlice';
import { getAllStretchLightPlatform } from '../../strechLightPlatform/strechLightPlatformApi';
import { selectStretchLightPlatform } from '../../strechLightPlatform/strechLightPlatformSlice';
import { getAllStretchLightRing } from '../../strechLightRing/strechLightRingApi';
import { selectStretchLightRing } from '../../strechLightRing/strechLightRingSlice';
import { getAllStretchBardutyun } from '../../strechBardutyun/strechBardutyunApi';
import { selectStretchBardutyun } from '../../strechBardutyun/strechBardutyunSlice';
import { selectStretchWork } from '../../StrechWork/strechWorkSlice';
import { allStretchWork } from '../../StrechWork/strechWorkApi';



export const TagStretchOrderx: React.FC = (): JSX.Element => {
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, setValue, getValues, } = useForm<any>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
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

    const user = useAppSelector(selectUser);
    const stretchTextureData = useAppSelector(selectStretchTexture);
    const stretchAdditionalData = useAppSelector(selectStretchAdditional);
    const stretchProfilData = useAppSelector(selectStretchProfil);
    const stretchLightPlatformData = useAppSelector(selectStretchLightPlatform);
    const stretchLightRingData = useAppSelector(selectStretchLightRing);
    const stretchBardutyunData = useAppSelector(selectStretchBardutyun);
    const stretchWorkData = useAppSelector(selectStretchWork);







    const [addOrder, setAddOrder] = useState({});
    const [orderSum, setOrderSum] = useState(0);
    const [orderBalance, setOrderBalance] = useState(0);



    const qountTotal = (order: any, event: any) => {
        const buyer = {
            buyerId: order.buyerId,
            buyerName: order.buyerName,
            buyerPhone1: order.buyerPhone1,
            buyerPhone2: order.buyerPhone2,
            buyerAddress: order.buyerAddress,
            buyerRegion: order.buyerRegion
        }

        const stretchTextureOrder: any = filterOrder(
            order,
            room,
            stretchTextureData.arrStretchTexture,
            stretchAdditionalData.arrStretchAdditional,
            stretchProfilData.arrStretchProfil,
            stretchLightPlatformData.arrStretchLightPlatform,
            stretchLightRingData.arrStretchLightRing,
            stretchBardutyunData.arrStretchBardutyun,
            stretchWorkData.arrStretchWorkData

        )

        if (order.prepayment != "") {
            setValue("groundTotal", order.balance - order.prepayment)
        } else {
            setValue("groundTotal", order.balance)
        }

        stretchTextureOrder["prepayment"] = order.prepayment
        stretchTextureOrder["paymentMethod"] = order.paymentMethod
        stretchTextureOrder["groundTotal"] = order.groundTotal
        stretchTextureOrder["balance"] = order.balance
        stretchTextureOrder["orderComment"] = order.orderComment
        stretchTextureOrder["buyerComment"] = order.buyerComment
        stretchTextureOrder["measureDate"] = order.measureDate
        stretchTextureOrder["installDate"] = order.installDate
        stretchTextureOrder["code"] = order.code
        stretchTextureOrder["salary"] = order.stretchWorkerSalary
        stretchTextureOrder["worker"] = order.stretchWorkerId

        setAddOrder({ buyer, stretchTextureOrder })

        console.log(order);

    };


    const newOrder = () => {
        dispatch(addNewStretchOrder({ addOrder, cookies, user: user.profile })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });

        // window.location.reload()
    };

    const [room, setRoom] = useState<{ id: string; name: string; isChecked: boolean }[]>([]);

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


    const [workRowId, setWorkRowId] = useState<number[]>([]);
    const addWorkNewRow = () => {
        setWorkRowId(prevRowId => [...prevRowId, prevRowId.length + 1 + uuidv4() as unknown as number]);
    };

    const removeWorkRow = (index: any,) => {
        reset({ [`work_${index}`]: '' })
        setWorkRowId(prevRowId => prevRowId.filter((_, i) => _ !== index));
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
                    <BuyerSection register={register} setValue={setValue} />
                </div>
                <p style={{
                    height: "20px"
                }}>
                </p>
                <div>
                    <PaymentSection register={register} setOrderBalance={setOrderBalance} setOrderSum={setOrderSum} />
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
                                        <RoomSection
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
                        <WorkSection
                            register={register}
                            setValue={setValue}
                            workRowId={workRowId}
                            removeWorkRow={removeWorkRow}
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

