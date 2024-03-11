import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { useForm } from "react-hook-form";
import { userProfile } from "../../../features/user/userApi";
import './coopStretchCeilingOrder.css'
import { selectCoopStretchBuyer } from "../../CoopStrechBuyer/coopStrechBuyerSlice";
import { addNewCoopStretchOrder } from "../../coopStrechOrder/coopStretchOrderApi"
import { allCoopStretchBuyer } from "../../CoopStrechBuyer/coopStrechBuyerApi";
import { selectStretchBardutyun } from "../../features/strechBardutyun/strechBardutyunSlice";
import { getAllStretchBardutyun } from "../../features/strechBardutyun/strechBardutyunApi";
import { getAllStretchTexture } from "../../features/strechTexture/strechTextureApi";
import { selectStretchTexture } from "../../features/strechTexture/strechTextureSlice";


export const CoopStretchOrder: React.FC = (): JSX.Element => {

    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        });
        dispatch(allCoopStretchBuyer(cookies)).unwrap().then(res => {
            if ("error" in res) {
                alert(res)
            }
        })
        dispatch(getAllStretchTexture(cookies)).unwrap().then(res => {
            if ("error" in res) {
                alert(res)
            }
        })
        dispatch(getAllStretchBardutyun(cookies)).unwrap().then(res => {
            if ("error" in res) {
                alert(res)
            }
        })
    }, [])



    const user = useAppSelector(selectUser);
    const stretchTexture = useAppSelector(selectStretchTexture);
    const stretchBardutyun = useAppSelector(selectStretchBardutyun);
    const coopStretchBuyer = useAppSelector(selectCoopStretchBuyer);

    // console.log(coopStretchBuyer.arrCoopStretchBuyer);
    // console.log(stretchTexture.arrStretchTexture);
    console.log(stretchBardutyun.arrStretchBardutyun);




    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()


    const bardutyun = [1]

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

    const [selectedBardutyunsId, setSelectedBardutyunsId] = useState<Array<string>>([])

    const [selectBarduyuns, setSelectBarduyuns] = useState<JSX.Element[]>([]);
    const handleAddSelect = () => {
        const options = stretchBardutyun.arrStretchBardutyun.map((el: any) =>
            <option key={el._id} value={el._id}>{el.name}</option>
        )
        const newSelect = <select className="selectCoop form-control" onChange={(e) => setSelectedBardutyunsId([...selectedBardutyunsId, e.target.value])}>
            {options}
        </select>;
        const newSelects = [...selectBarduyuns, newSelect];
        setSelectBarduyuns(newSelects)
    };





    function handleCheckboxChange(event: any) {
        setChecked(event.target.checked);
    };
    // function selectTexturePrice(event: ChangeEvent<HTMLSelectElement>): void {
    //     const orderPrice = texture.arrTexture?.filter((e: any, i: any) => {
    //         return e._id === event.target.value
    //     })
    //     setTexturePrice(orderPrice[0].price)
    // }





    // function cooperateDiscount(event: ChangeEvent<HTMLSelectElement>): void {
    //     const coopPrice = cooperate.arrCooperate.find((e: Cooperate) => e._id === event.target.value)
    //     if (coopPrice) {
    //         setCoopRate(coopPrice?.cooperateRate)
    //         setCoopTotal(((+coopPrice?.cooperateRate * totalOrder) / 100))
    //         setCoop(coopPrice)
    //     } else {
    //         setCoopRate(0)
    //         setCoopTotal(0)
    //         setCoop("")
    //     }
    // }

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
        dispatch(addNewCoopStretchOrder({ buyer, newOrder, cookies })).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate('/')
                alert(res)
            }
        })

    }



    return (
        <>


        </>
    );
}

