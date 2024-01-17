import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { selectTexture } from '../../features/texture/textureSlice';
import { getAllTexture } from '../../features/texture/textureApi';



const WallpaperOrderSection: React.FC<any> = ({ register }: any) => {

    const dispatch = useAppDispatch();
    const texture = useAppSelector(selectTexture);

    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();


    dispatch(getAllTexture(cookies)).unwrap().then(res => {
        if ("error" in res) {
            // setCookie("access_token", '', { path: '/' })
            // navigate("/")
            alert(res)
        }
    })

    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const sq = (height / 100) * (weight / 100);
    const squer = +sq.toFixed(2);
    const [discount, setDiscount] = useState<number>(0)
    const [prepayment, setPrepayment] = useState<number>(0)
    const [price, setPrice] = useState(0)
    const [coopRate, setCoopRate] = useState<number>(0)
    const [coopTotal, setCoopTotal] = useState<number>(0)
    const [coop, setCoop] = useState<any>()
    const [totalOrder, setTotalOrder] = useState(0)
    const sum = totalOrder - prepayment
    const [checked, setChecked] = useState(false);
    const [texturePrice, setTexturePrice] = useState(0)

    // useEffect(() => {
    //     if (checked) {
    //         setPrice(texturePrice - (texturePrice * coopRate) / 100);
    //         setCoopTotal(0);
    //     } else {
    //         setPrice(texturePrice)
    //         if (coop) {
    //             setCoopTotal(((coop?.cooperateRate * totalOrder) / 100))
    //         }
    //     }
    // }, [checked, price]);

    // useEffect(() => {
    //     setPrice(texturePrice)

    // }, [texturePrice])
    // useEffect(() => {
    //     setTotalOrder(parseInt(((squer * price) - ((squer * price) * discount) / 100).toString()))
    // }, [price, discount])

    return (<div>

        Ֆոտոպաստառ/Wallpaper
        <div>------------------</div>
        <div className="wallaperForm">
            <div style={{ padding: "0 5px" }}>
                <div className="inputDiv">
                    <label htmlFor="weight">Երկարություն</label>
                    <input id="weight" className="inputNumber" type="number" placeholder="Width"  {...register("weight", { required: true })} onChange={(e) => setWeight(+e.target.value)} />
                </div>
                <div className="inputDiv">
                    <label htmlFor="height">Բարձրություն</label>
                    <input id="height" className="inputNumber" type="number" placeholder="Height" {...register("height", { required: true })} onChange={(e) => setHeight(+e.target.value)} />
                </div>
                <div className="inputDiv">
                    <label htmlFor="sqMetr">Ք/Մ</label>
                    <input id="sqMetr" className="inputNumber" type="number" placeholder="SQ/METR" value={squer} readOnly {...register("sqMetr", { required: true })} />
                </div>
            </div>
            <div >
                <div className="inputDiv">
                    <label htmlFor="price">Գին</label>
                    <input id="price" className="inputNumber" type="number" placeholder="Price" value={price} {...register("price", { required: true })} onChange={(e) => setPrice(+e.target.value)} />
                </div>
                <div className="inputDiv">
                    <label htmlFor="discount">Զեղչ</label>
                    <input id="discount" className="inputNumber" type="number" placeholder="discount" {...register("discount")} onChange={(e) => setDiscount(+e.target.value)} />
                </div>
                <div className="inputDiv">
                    <label htmlFor="total">Գումար</label>
                    <input id="total" className="inputNumber" type="number" placeholder="total" value={totalOrder}  {...register("total", { required: true })} onChange={(e) => setTotalOrder(+e.target.value)} />
                </div>
            </div>
            <div style={{ padding: "0 5px" }} >
                <div className="inputDiv">
                    <label htmlFor="picCode">Նկարի կոդ</label>
                    <input id="picCode" className="inputNumber" type="text" placeholder="Picture Code" {...register("picCode")} />
                </div>
                <div>
                    <label htmlFor="comment">Նկարագրություն</label>
                    <textarea id="comment" className="userInput form-control" placeholder="Comment" {...register("comment")}></textarea>
                </div>

            </div>
        </div>


    </div>)
}
export default WallpaperOrderSection;