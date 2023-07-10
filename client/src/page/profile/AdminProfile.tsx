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

export const AdminProfile: React.FC = (): JSX.Element => {
    const user = useAppSelector(selectUser);
    const cooperate = useAppSelector(selectCooperate);
    const texture = useAppSelector(selectTexture);
    const newOrders = useAppSelector(selectOrder);
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()

    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })

        dispatch(viewNewOrders(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate('/')
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
                setCookie("access_token", '', { path: '/' })
                navigate('/')
            }
        })
        dispatch(getAllTexture(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
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
        navigate("/order/" + id)

    }

    return (
        <>

            <div className="profile">
                <div className="divBtn">
                    {/* <button className="btn" onClick={openCoopSpher}>Add cooperation sphere</button> */}
                    <button className="btn" onClick={openOrderForm}>Ավելացնել Պատվեր</button>
                </div>
            </div>

            {/* ////////// add Coop Spher /////////// */}
            {/* {
                addCoopSpherForm ?
                    <div className="profile">
                        <form className="divBtn" onSubmit={handleSubmit(saveCoopSpher)}>
                            <div>
                                <input className="userInput" type="text" placeholder="Name" {...register("name", { required: true })} />
                            </div>
                            <button className="btn" >Save</button>
                        </form>
                        <button className="btn btn-lg" onClick={() => window.location.reload()} >X</button>
                    </div>
                    :
                    null
            } */}
            {
                addOrderForm ?
                    <form className="orderDiv" onSubmit={handleSubmit(newOrder)}>
                        <div className="formdiv">
                            <div className="formSelect">

                                <div className="buyerDiv">
                                    Գնորդ
                                    <div>-------</div>
                                    <div>
                                        <label htmlFor="buyerName">Անուն</label>
                                        <input id="buyerName" className="userInput form-control" type="text" placeholder="Buyer Name" {...register("buyerName", { required: true })} />
                                    </div>
                                    <div>
                                        <label htmlFor="buyerPhone">Հեռախես</label>
                                        <input id="buyerPhone" className="userInput form-control" type="text" placeholder=" Buyer Phone" {...register("buyerPhone", { required: true })} />
                                    </div>
                                    <div>
                                        <label htmlFor="buyerAdress">Հասցե</label>
                                        <input id="buyerAdress" className="userInput form-control" type="text" placeholder="Buyer Adress" {...register("buyerAdress", { required: true })} />
                                    </div>
                                </div>
                                <div className="buyerDiv">
                                    Ֆոտոպաստառ
                                    <div>------------------</div>
                                    <div className="wallpaperDiv">
                                        <div>
                                            <div>
                                                <label htmlFor="weight">Երկարություն</label>
                                                <input id="weight" className="userInput form-control" type="number" placeholder="Weight"  {...register("weight", { required: true })} onChange={(e) => setWeight(+e.target.value)} />
                                            </div>
                                            <div>
                                                <label htmlFor="height">Բարձրություն</label>
                                                <input id="height" className="userInput form-control" type="number" placeholder="Height" {...register("height", { required: true })} onChange={(e) => setHeight(+e.target.value)} />
                                            </div>
                                            <div>
                                                <label htmlFor="sqMetr">Քառակուսի մետր</label>
                                                <input id="sqMetr" className="userInput form-control" type="number" placeholder="SQ/METR" value={squer} readOnly {...register("sqMetr", { required: true })} />
                                            </div>
                                        </div>
                                        <div >
                                            <div>
                                                <label htmlFor="price">Գին</label>
                                                <input id="price" className="userInput form-control" type="number" placeholder="Price" value={price} {...register("price", { required: true })} onChange={(e) => setPrice(+e.target.value)} />
                                            </div>
                                            <div>
                                                <label htmlFor="discount">Զեղչ</label>
                                                <input id="discount" className="userInput form-control" type="number" placeholder="discount" {...register("discount")} onChange={(e) => setDiscount(+e.target.value)} />
                                            </div>
                                            <div>
                                                <label htmlFor="total">Գումար</label>
                                                <input id="total" className="userInput form-control" type="number" placeholder="total" value={totalOrder}  {...register("total", { required: true })} onChange={(e) => setTotalOrder(+e.target.value)} />
                                            </div>
                                        </div>
                                        <div >
                                            <div>
                                                <label htmlFor="picCode">Նկարի կոդ</label>
                                                <input id="picCode" className="userInput form-control" type="text" placeholder="Picture Code" {...register("picCode")} />
                                            </div>
                                            <div>
                                                <label htmlFor="comment">Նկարագրություն</label>
                                                <textarea id="comment" className="userInput form-control" placeholder="Comment" {...register("comment")}></textarea>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="buyerDiv">
                                    Գործընկեր
                                    <div>-------------</div>
                                    <div>
                                        <label htmlFor="selectCoop">Գործընկերոջ անվանում</label>
                                        <select id="selectCoop" className="selectCoop form-control" {...register("cooperateId", { required: true })} onChange={cooperateDiscount}>
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
                                    <div>
                                        <label htmlFor="coopRate">Գործընկերոջ տոկոս</label>
                                        <input id="coopRate" className="userInput form-control" type="number" placeholder="Cooperate Rate" value={coopRate} readOnly onChange={(e) => setCoopRate(+e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="coopTotal">Գործընկերոջ գումար</label>
                                        <input id="coopTotal" className="userInput form-control" type="number" placeholder="Cooperate Totla" value={coopTotal} {...register("cooperateTotal")} />
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                onChange={handleCheckboxChange}
                                            />
                                            Փոխել գինը
                                        </label>
                                    </div>
                                </div>
                            </div >
                            <div>
                                <button className="btn btn-lg" onClick={() => window.location.reload()} >X</button>
                            </div>

                        </div>
                        <div className="profile">
                            <div>
                                <label htmlFor="pey">Վճարման միջոց</label>
                                <select id="pey" className="selectCoop form-control" {...register("paymentMethod", { required: true })}>
                                    <option className="selectCoop" value={"cash"} >Կանխիկ</option>
                                    <option className="selectCoop" value={"transfer"}>Փոխանցում</option>
                                    <option className="selectCoop" value={"pos"}>Պոս Տերմինալ</option>
                                    <option className="selectCoop" value={"credit"}>Ապառիկ</option>
                                    <option className="selectCoop" value={"inecoPay"}>Ինեկո Փեյ</option>
                                    <option className="selectCoop" value={"idram"}>Իդրամ</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="texture">Ֆոտոպաստառ</label>
                                <select id="texture" className="selectCoop form-control" {...register("texture", { required: true })} onChange={selectTexturePrice}>
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
                            <div>
                                <label htmlFor="prepayment">Կանխավճար</label>
                                <input id="prepayment" className="userInput form-control" type="number" placeholder="prepayment"  {...register("prepayment")} onChange={(e) => setPrepayment(+e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="Sum">Մնացորդ</label>
                                <input id="Sum" className="userInput form-control" type="number" placeholder="Sum" value={sum} {...register("groundTotal")} readOnly />
                            </div>
                        </div>

                        <div><button className="btn">Գրանցել</button></div>

                    </form>
                    :
                    null
            }

            {/* /////////////// new Orders//////////////////////// */}

            <div className="profile">
                {
                    newOrders?.arr && newOrders.arr.length > 0 ?

                        <table className="table" style={{ color: "white" }}>
                            <thead>
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

