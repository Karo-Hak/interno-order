import './order.css'
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectOrder } from '../../features/order/orderSlice';
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { findOrder, updateOrderAll } from "../../features/order/orderApi";
import { selectUser } from '../../features/user/userSlice';
import { useForm } from 'react-hook-form';
import { getAllTexture } from '../../features/texture/textureApi';
import { selectTexture } from '../../features/texture/textureSlice';
import { getAllCooperate } from '../../features/cooperate/cooperateApi';
import { Cooperate, selectCooperate } from '../../features/cooperate/cooperateSlice';

export const UpdateOrderInfo: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser)
    const order = useAppSelector(selectOrder);
    const texture = useAppSelector(selectTexture);
    const cooperate = useAppSelector(selectCooperate);

    const dispatch = useAppDispatch()
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const params = useParams()

    const [weight, setWeight] = useState<number>(() => order.order.weight || 0);
    const [height, setHeight] = useState<number>(order.order.height || 0);
    const [discount, setDiscount] = useState<number>(order.order.discount || 0)
    const [prepayment, setPrepayment] = useState<number>(order.order.prepayment || 0)
    const [price, setPrice] = useState<number>(order.order.price || 0)
    const [coopRate, setCoopRate] = useState<number>(order.order.cooperate?.cooperateRate || 0)
    const [coopTotal, setCoopTotal] = useState<number>(order.order.cooperateTotal || 0)
    const sq = (height / 100) * (weight / 100) || 0;
    const squer = +sq.toFixed(2);
    const [totalOrder, setTotalOrder] = useState(order.order.total || 0)
    const sum = totalOrder - prepayment
    const [checked, setChecked] = useState(false);
    const [buyerName, setBuyerName] = useState<string>(order.order.buyer?.name)
    const [buyerPhone, setBuyerPhone] = useState(order.order.buyer?.phone)
    const [buyerAdress, setBuyerAdress] = useState(order.order.buyer?.adress)
    const [picCode, setPicCode] = useState(order.order.picCode)
    const [comment, setComment] = useState(order.order.comment)
    const [selectedCoop, setSelectedCoop] = useState(order.order.cooperate?._id);
    const [selectedTexture, setSelectedTexture] = useState(order.order.texture?._id)
    const [selectedPayment, setSelectedPayment] = useState(order.order.paymentMethod)
    const [coop, setCoop] = useState<any>('')
    const [texturePrice, setTexturePrice] = useState(0)


    function loadeData(): void {
        setWeight(order.order.weight)
        setHeight(order.order.height)
        setDiscount(order.order.discount)
        setPrepayment(order.order.prepayment)
        setPrice(order.order.price)
        setCoopRate(order.order.cooperate?.cooperateRate)
        setCoopTotal(order.order.cooperateTotal)
        setTotalOrder(order.order.total)
        setBuyerName(order.order.buyer?.name)
        setBuyerPhone(order.order.buyer?.phone)
        setBuyerAdress(order.order.buyer?.adress)
        setPicCode(order.order.picCode)
        setComment(order.order.comment)
        setSelectedCoop(order.order.cooperate?._id)
        setSelectedTexture(order.order.texture?._id)
        setSelectedPayment(order.order.paymentMethod)
    }

    useEffect(() => {
        dispatch(findOrder({ params, cookies })).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })
        dispatch(getAllTexture(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
            }
        })
        dispatch(getAllCooperate(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate('/')
            }
        })
    }, [])

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCoop(event.target.value);
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
    };


    function handleCheckboxChange(event: any) {
        setChecked(event.target.checked);
    };
    function selectTexturePrice(event: ChangeEvent<HTMLSelectElement>): void {
        setSelectedTexture(event.target.value)
        const orderPrice = texture.arrTexture?.filter((e: any, i: any) => {
            return e._id === event.target.value
        })
        setTexturePrice(orderPrice[0].price)

    }

    useEffect(() => {
        if (checked) {
            setPrice(+(price - (price * coopRate) / 100).toFixed(0));
            setCoopTotal(0);
        } else {
            setPrice(order.order.price)
            if (order.order.cooperate) {
                setCoopTotal(((coopRate * totalOrder) / 100))
            }
        }
    }, [checked]);

    useEffect(() => {
        setPrice(texturePrice)
    }, [texturePrice])

    useEffect(() => {
        setTotalOrder(parseInt(((squer * price) - ((squer * price) * discount) / 100).toString()))
    }, [price, discount])
    useEffect(() => {
        loadeData()
    }, [])


    const updateWallpaper = (order: any) => {
        const buyer = { name: buyerName, phone: buyerPhone, adress: buyerAdress }
        const updateingOrder = {
            weight,
            height,
            discount,
            price,
            prepayment,
            picCode,
            total: +totalOrder,
            sqMetr: +squer,
            cooperateTotal: coopTotal,
            groundTotal: sum,
            user: user.profile.userId,
            cooperate: selectedCoop,
            texture: selectedTexture,
            comment,
            paymentMethod: selectedPayment
        }
        dispatch(updateOrderAll({ buyer, updateingOrder, cookies, params })).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate('/')
                alert(res)
            }
        })

    }



    return (
        <div>
            {
                order.order._id ?
                    <div>

                        <form className="orderDiv" onSubmit={handleSubmit(updateWallpaper)}>
                            <div className="formdiv">
                                <div className="formSelect">
                                    <div className="buyerDiv">
                                        Գնորդ
                                        <div>-------</div>
                                        <div>
                                            <label htmlFor="buyerName">Անուն</label>
                                            <input id="buyerName" className="userInput form-control" type="text" placeholder="Buyer Name" value={buyerName}  {...register("buyerName")} onChange={(e) => setBuyerName(e.target.value)} />
                                        </div>
                                        <div>
                                            <label htmlFor="buyerPhone">Հեռախես</label>
                                            <input id="buyerPhone" className="userInput form-control" type="text" placeholder=" Buyer Phone" value={buyerPhone} {...register("buyerPhone")} onChange={(e) => setBuyerPhone(e.target.value)} />
                                        </div>
                                        <div>
                                            <label htmlFor="buyerAdress">Հասցե</label>
                                            <input id="buyerAdress" className="userInput form-control" type="text" placeholder="Buyer Adress" value={buyerAdress} {...register("buyerAdress")} onChange={(e) => setBuyerAdress(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="buyerDiv">
                                        Ֆոտոպաստառ
                                        <div>------------------</div>
                                        <div className="wallpaperDiv">
                                            <div>
                                                <div>
                                                    <label htmlFor="weight">Երկարություն</label>
                                                    <input id="weight" className="userInput form-control" type="number" placeholder="Weight" value={weight} {...register("weight")} onChange={(e) => setWeight(+e.target.value)} />
                                                </div>
                                                <div>
                                                    <label htmlFor="height">Բարձրություն</label>
                                                    <input id="height" className="userInput form-control" type="number" placeholder="Height" value={height} {...register("height")} onChange={(e) => setHeight(+e.target.value)} />
                                                </div>
                                                <div>
                                                    <label htmlFor="sqMetr">Քառակուսի մետր</label>
                                                    <input id="sqMetr" className="userInput form-control" type="number" placeholder="SQ/METR" value={squer} readOnly {...register("sqMetr")} />
                                                </div>
                                            </div>
                                            <div >
                                                <div>
                                                    <label htmlFor="price">Գին</label>
                                                    <input id="price" className="userInput form-control" type="number" placeholder="Price" value={price} {...register("price")} onChange={(e) => setPrice(+e.target.value)} />
                                                </div>
                                                <div>
                                                    <label htmlFor="discount">Զեղչ</label>
                                                    <input id="discount" className="userInput form-control" type="number" placeholder="discount" value={discount} {...register("discount")} onChange={(e) => setDiscount(+e.target.value)} />
                                                </div>
                                                <div>
                                                    <label htmlFor="total">Գումար</label>
                                                    <input id="total" className="userInput form-control" type="number" placeholder="total" value={totalOrder}  {...register("total")} onChange={(e) => setTotalOrder(+e.target.value)} />
                                                </div>
                                            </div>
                                            <div >
                                                <div>
                                                    <label htmlFor="picCode">Նկարի կոդ</label>
                                                    <input id="picCode" className="userInput form-control" type="text" placeholder="Picture Code" value={picCode} {...register("picCode")} onChange={(e) => setPicCode(e.target.value)} />
                                                </div>
                                                <div>
                                                    <label htmlFor="comment">Նկարագրություն</label>
                                                    <textarea id="comment" className="userInput form-control" placeholder="Comment" value={comment} {...register("comment")} onChange={(e) => setComment(e.target.value)}></textarea>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="buyerDiv">
                                        Գործընկեր
                                        <div>-------------</div>
                                        <div>
                                            <label htmlFor="selectCoop">Գործընկերոջ անվանում</label>
                                            <select id="selectCoop" className="selectCoop form-control" value={selectedCoop} {...register("cooperateId")}
                                                onChange={handleChange}
                                            >
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
                                            <input id="coopRate" className="userInput form-control" type="number" placeholder="Cooperate Rate" value={coopRate} onChange={(e) => setCoopRate(+e.target.value)} />
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


                            </div>
                            <div className="profile">
                                <div>
                                    <label htmlFor="pey">Վճարման միջոց</label>
                                    <select id="pey" className="selectCoop form-control" value={selectedPayment} {...register("paymentMethod")} onChange={(e) => setSelectedPayment(e.target.value)}>
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
                                    <select id="texture" className="selectCoop form-control" value={selectedTexture} {...register("texture")}
                                        onChange={selectTexturePrice}
                                    >
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
                                    <input id="prepayment" className="userInput form-control" type="number" placeholder="prepayment" value={prepayment}  {...register("prepayment")} onChange={(e) => setPrepayment(+e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="Sum">Մնացորդ</label>
                                    <input id="Sum" className="userInput form-control" type="number" placeholder="Sum" value={sum} {...register("groundTotal")} readOnly />
                                </div>
                            </div>
                            <div><button className="btn">Գրանցել</button></div>
                        </form>
                    </div>

                    :
                    null
            }
            <div>
                <button className="btn" style={{ fontSize: "20px", backgroundColor: "#0a1020", margin: "10px" }} onClick={loadeData} >Լրացնել տվյալները</button>
            </div>
        </div>
    )
}