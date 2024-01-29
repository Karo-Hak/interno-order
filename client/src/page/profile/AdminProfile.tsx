import { selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { useForm } from "react-hook-form";
import { userProfile } from "../../features/user/userApi";
import './adminProfile.css'
import { getAllCooperate } from "../../features/cooperate/cooperateApi";
import { Cooperate, selectCooperate } from "../../features/cooperate/cooperateSlice";
import { addNewOrder, viewNewOrders } from "../../features/order/orderApi";
import { getAllTexture } from "../../features/texture/textureApi";
import { selectTexture } from "../../features/texture/textureSlice";
import { selectOrder } from "../../features/order/orderSlice";
import BuyerOrderSection from "./BuyerOrderSection";

export const AdminProfile: React.FC = (): JSX.Element => {
    const user = useAppSelector(selectUser);
    const cooperate = useAppSelector(selectCooperate);
    const texture = useAppSelector(selectTexture);
    const newOrders = useAppSelector(selectOrder);
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<any>()

    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })

        dispatch(viewNewOrders(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate('/')
                alert(res)
            }
        })

    }, [])



    //////////////////// Add Order ////////////////

    const [addOrderForm, setAddOrderForm] = useState(false)
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [discount, setDiscount] = useState<number>(0)
    const [prepayment, setPrepayment] = useState<number>(0)
    const [price, setPrice] = useState(0)
    const [coopRate, setCoopRate] = useState<number>(0)
    const [coopTotal, setCoopTotal] = useState<number>(0)
    const [coop, setCoop] = useState<any>()
    const sq = (height / 100) * (weight / 100);
    const squer = +sq.toFixed(2);
    const [totalOrder, setTotalOrder] = useState(0)
    const sum = totalOrder - prepayment
    const [checked, setChecked] = useState(false);
    const [texturePrice, setTexturePrice] = useState(0)


    function handleCheckboxChange(event: any) {
        setChecked(event.target.checked);
    };
    function selectTexturePrice(event: ChangeEvent<HTMLSelectElement>): void {
        const orderPrice = texture.arrTexture?.filter((e: any, i: any) => {
            return e._id === event.target.value
        })
        setTexturePrice(orderPrice[0].price)
    }




    const openOrderForm = () => {
        dispatch(getAllCooperate(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate('/')
                alert(res)
            }
        })
        dispatch(getAllTexture(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })

        setAddOrderForm(true)
    }
    function cooperateDiscount(event: ChangeEvent<HTMLSelectElement>): void {
        const coopPrice = cooperate.arrCooperate.find((e: Cooperate) => e._id === event.target.value)
        if (coopPrice) {
            setCoopRate(coopPrice?.cooperateRate)
            setCoopTotal(((+coopPrice?.cooperateRate * totalOrder) / 100))
            setCoop(coopPrice)
        } else {
            setCoopRate(0)
            setCoopTotal(0)
            setCoop("")
        }
    }

    useEffect(() => {
        if (checked) {
            setPrice(texturePrice - (texturePrice * coopRate) / 100);
            setCoopTotal(0);
        } else {
            setPrice(texturePrice)
            if (coop) {
                setCoopTotal(((coop?.cooperateRate * totalOrder) / 100))
            }
        }
    }, [checked, price]);

    useEffect(() => {
        setPrice(texturePrice)

    }, [texturePrice])
    useEffect(() => {
        setTotalOrder(parseInt(((squer * price) - ((squer * price) * discount) / 100).toString()))
    }, [price, discount])



    const newOrder = (order: any) => {
        const buyer = { name: order.buyerName, phone: order.buyerPhone, adress: order.buyerAdress }

        const newOrder = {
            oldId: Math.floor(Math.random() * 1000000000),
            height: +order.height,
            weight: +order.weight,
            discount: +order.discount,
            price: price,
            prepayment: +order.prepayment,
            picCode: order.picCode,
            total: +totalOrder,
            sqMetr: +squer,
            cooperateTotal: coopTotal,
            groundTotal: sum,
            user: user.profile.userId,
            cooperate: order.cooperateId,
            texture: order.texture,
            comment: order.comment,
            paymentMethod: order.paymentMethod
        }
        dispatch(addNewOrder({ buyer, newOrder, cookies })).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate('/')
                alert(res)
            }
        })
        if (newOrder.oldId) {
            navigate("/newOrder/" + newOrder.oldId)
        }
    }

    //////////////////// new Orders hashvetvutyun ////////////////
    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }

    const viewOrder = (id: any) => {
        window.open("/order/" + id)

    }
    const addBuyer = () => {
        navigate('/wallpaper/addBuyer');
    }
    const addCooperate = () => {
        if (user.profile.role === "admin") {
            navigate("/wallpaper/addCooperate")
        }
    }
    const addTexture = () => {
        if (user.profile.role === "admin") {
            navigate("/wallpaper/addTexture")
        }
    }
    const search = () => {
        navigate("/wallpaper/searchOrder")
    }


    return (
        <>

            <div className="admin_profile">
                <div >
                    {/* <button className="btn" onClick={openCoopSpher}>Add cooperation sphere</button> */}
                    <button className="btn" onClick={openOrderForm}>Ավելացնել Պատվեր</button>
                    <button className="btn" onClick={addBuyer} >Ավելացնել Գնորդ</button>
                    {
                        user.profile && user.profile.role === "admin" ?
                            <>
                                <button className="btn" onClick={addCooperate} >Ավելացնել Գործընկեր</button>
                                <button className="btn" onClick={addTexture} >Ավելացնել Տեսակ</button>
                            </>
                            :
                            null
                    }
                    <button className="btn" onClick={search} >Դիտել Պատվերները</button>
                </div>
            </div>

            {
                addOrderForm ?
                    <form className="" onSubmit={handleSubmit(newOrder)}>
                        <div className="">
                            <div className="">

                                <div className="">
                                    <BuyerOrderSection register={register} setValue={setValue} />
                                </div>

                                <div className="photopastar">
                                    <div className="photopastar_name">Ֆոտոպաստառ</div>

                                    <div className="photopastar_label">

                                        <div className="photopastar_wh" >
                                            <div className="buyer_label">
                                                <label htmlFor="weight">Երկարություն</label>
                                                <input id="weight" className="inputNumber" type="number" placeholder="Width"  {...register("weight", { required: true })} onChange={(e) => setWeight(+e.target.value)} />
                                            </div>
                                            <div className="buyer_label">
                                                <label htmlFor="height">Բարձրություն</label>
                                                <input id="height" className="inputNumber" type="number" placeholder="Height" {...register("height", { required: true })} onChange={(e) => setHeight(+e.target.value)} />
                                            </div>
                                            <div className="buyer_label">
                                                <label htmlFor="sqMetr">Ք/Մ</label>
                                                <input id="sqMetr" className="inputNumber" type="number" placeholder="SQ/METR" value={squer} readOnly {...register("sqMetr", { required: true })} />
                                            </div>
                                        </div>
                                        <div className="photopastar_ps">
                                            <div className="buyer_label">
                                                <label htmlFor="price">Գին</label>
                                                <input id="price" className="inputNumber" type="number" placeholder="Price" value={price} {...register("price", { required: true })} onChange={(e) => setPrice(+e.target.value)} />
                                            </div>
                                            <div className="buyer_label">
                                                <label htmlFor="discount">Զեղչ</label>
                                                <input id="discount" className="inputNumber" type="number" placeholder="discount" {...register("discount")} onChange={(e) => setDiscount(+e.target.value)} />
                                            </div>
                                            <div className="buyer_label">
                                                <label htmlFor="total">Գումար</label>
                                                <input id="total" className="inputNumber" type="number" placeholder="total" value={totalOrder}  {...register("total", { required: true })} onChange={(e) => setTotalOrder(+e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="photopastar_comm" >
                                            <div className="buyer_label">
                                                <label htmlFor="picCode">Նկարի կոդ</label>
                                                <input id="picCode" className="inputNumber" type="text" placeholder="Picture Code" {...register("picCode")} />
                                            </div>
                                            <div className="buyer_label">
                                                <label htmlFor="comment">Նկարագրություն</label>
                                                <textarea id="comment" className="wallpaperComm" placeholder="Comment" {...register("comment")}></textarea>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="gorcnker">
                                    <div className="gorcnker_name">
                                        <div>Գործընկեր</div>
                                        <div className="gorcnker_cheak">
                                            <input id="coopCheckbox" type="checkbox" onChange={handleCheckboxChange} />
                                            <label htmlFor="coopCheckbox">Փոխել գինը</label>
                                        </div>
                                    </div>
                                    <div className="gorcnker_info ">

                                        <div className="buyer_label">
                                            <label htmlFor="selectCoop">Անվանում</label>
                                            <select id="selectCoop"  {...register("cooperateId", { required: true })} onChange={cooperateDiscount}>
                                                {
                                                    cooperate?.arrCooperate && cooperate.arrCooperate.length > 0 ?
                                                        cooperate.arrCooperate.map((e: any) => {
                                                            return <option key={e._id} value={e._id}
                                                            >{e.name} {e.surname}</option>
                                                        })
                                                        : null
                                                }
                                            </select>
                                        </div>
                                        <div className="buyer_label">
                                            <label htmlFor="coopRate">Տոկոս</label>
                                            <input id="coopRate" className="inputNumber" type="number" placeholder="Cooperate Rate" value={coopRate} readOnly onChange={(e) => setCoopRate(+e.target.value)} />
                                        </div>
                                        <div className="buyer_label">
                                            <label htmlFor="coopTotal">Գումար</label>
                                            <input id="coopTotal" className="inputNumber" type="number" placeholder="Cooperate Totla" value={coopTotal} {...register("cooperateTotal")} />
                                        </div>
                                    </div>

                                </div>

                            </div >
                        </div>

                        <div className="payment">
                            <div className="paymnet_name"> Վճարում</div>
                            <div className="payment_info">

                                <div className="buyer_label">
                                    <label htmlFor="pey">Վճարման միջոց</label>
                                    <select id="pey" {...register("paymentMethod", { required: true })}>
                                        <option className="selectCoop" value={"cash"} >Կանխիկ</option>
                                        <option className="selectCoop" value={"transfer"}>Փոխանցում</option>
                                        <option className="selectCoop" value={"pos"}>Պոս Տերմինալ</option>
                                        <option className="selectCoop" value={"credit"}>Ապառիկ</option>
                                        <option className="selectCoop" value={"inecoPay"}>Ինեկո Փեյ</option>
                                        <option className="selectCoop" value={"idram"}>Իդրամ</option>
                                    </select>
                                </div>
                                <div className="buyer_label" >
                                    <label htmlFor="texture">Ֆոտոպաստառ</label>
                                    <select id="texture"  {...register("texture", { required: true })} onChange={selectTexturePrice}>
                                        <option></option>
                                        {
                                            texture?.arrTexture && texture.arrTexture.length > 0 ?
                                                texture.arrTexture.map((e: any) => {
                                                    return <option key={e._id} value={e._id}
                                                    >{e.name}</option>
                                                })
                                                : null
                                        }
                                    </select>
                                </div>
                                <div className="buyer_label">
                                    <label htmlFor="prepayment">Կանխավճար</label>
                                    <input id="prepayment" className="inputNumber" type="number" placeholder="prepayment"  {...register("prepayment")} onChange={(e) => setPrepayment(+e.target.value)} />
                                </div>
                                <div className="buyer_label">
                                    <label htmlFor="Sum">Մնացորդ</label>
                                    <input id="Sum" className="inputNumber" type="number" placeholder="Sum" value={sum} {...register("groundTotal")} readOnly />
                                </div>
                            </div>

                        </div>
                        <div className="save">
                            <button className="btn" onClick={() => window.location.reload()} >Չեղարկել</button>
                            <button className="btn">Գրանցել</button>
                        </div>

                    </form>
                    :
                    null
            }

            {/* /////////////// new Orders//////////////////////// */}

            <div className="admin_profile_list">
                {
                    newOrders?.arr && newOrders.arr.length > 0 ?

                        <table className="admin_profile_table" >
                            <thead className="">
                                <tr>
                                    <th scope="col">Ամսաթիվ</th>
                                    <th scope="col">Գնորդ</th>
                                    <th scope="col">Երկարություն/Լայնություն</th>
                                    <th scope="col">Ք/Մ</th>
                                    <th scope="col">Նկար</th>
                                    <th scope="col">Տեսակ</th>
                                    <th scope="col">Կարգավիճակ</th>
                                    <th scope="col">Վեջնաժամկետ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    newOrders.arr.map((e: any) => {


                                        return (
                                            <tr key={e._id}>
                                                <td >{parseDate(e.date)}</td>
                                                <td>{e.buyer.name}</td>
                                                <td>{e.weight} x {e.height}</td>
                                                <td>{e.sqMetr}</td>
                                                <td>{e.picCode}</td>
                                                <td>{e.texture?.name}</td>
                                                <td>{e.status}</td>
                                                <td>{parseDate(e.deadline)}</td>
                                                <td><button className="btn" onClick={() => viewOrder(e._id)}>View</button></td>

                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        :
                        <p></p>
                }
            </div>




        </>
    );
}

