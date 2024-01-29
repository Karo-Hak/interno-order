import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './viewStretchOrder.css'
import { findStretchOrder } from "../../stretchCeilingOrder/stretchOrderApi";
import { selectStretchOrder } from "../../stretchCeilingOrder/stretchOrderSlice";
import { log } from "console";


export const ViewStretchOrder: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const params = useParams()
    const initialState: any = [];

    const [additionals, setAdditionals] = useState(initialState);
    const [stretchTexture, setStretchTexture] = useState(initialState);
    const [lightPlatform, setLightPlatform] = useState(initialState);
    const [lightRing, setLightRing] = useState(initialState);
    const [profil, setProfil] = useState(initialState);


    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })

        dispatch(findStretchOrder({ params, cookies })).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
            if (res.groupedAdditionals)
                setAdditionals(Object.values(res.groupedAdditionals));
            if (res.groupedStretchCeilings)
                setStretchTexture(Object.values(res.groupedStretchCeilings));
            if (res.groupedLightPlatforms)
                setLightPlatform(Object.values(res.groupedLightPlatforms));
            if (res.groupedLightRings)
                setLightRing(Object.values(res.groupedLightRings));
            if (res.groupedProfils)
                setProfil(Object.values(res.groupedProfils));


        })

    }, [])

    const editingOrder = useAppSelector(selectStretchOrder);
    const user = useAppSelector(selectUser);

    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }


    function editOrder(id: any) {
        window.open('/stretchceiling/editStretchOrder/' + id, '_blank');
    }

    console.log(editingOrder.stretchOrder);



    return (
        <div>

            <div className="viewStrechOrder_head">

                {
                    editingOrder.stretchOrder?.buyer ?
                        <div className="viewStrechOrder_head_title">
                            <div className="viewStrechOrder_buyer_title_name">
                                Գնորդ
                            </div>
                            <div className="buyerInfo">
                                <div className="buyerNamePhone">
                                    <div>
                                        <label>Անուն Ազգանուն</label>
                                        <h6>{editingOrder.stretchOrder.buyer.buyerName}</h6>
                                    </div>
                                    <div>
                                        <label>Հեռախոս</label>
                                        <h6>{editingOrder.stretchOrder.buyer.buyerPhone}</h6>
                                    </div>
                                </div>
                                <div className="buyerAddressDate">
                                    <div>
                                        <label>Հասցե</label>
                                        <h6>{editingOrder.stretchOrder.buyer.buyerAddress}</h6>
                                    </div>
                                    <div>
                                        <label>Չափագրում</label>
                                        <h6>{parseDate(editingOrder.stretchOrder.measureDate)}</h6>
                                    </div>
                                </div>
                                <div className="buyerComment">
                                    <label>Նկարագրություն</label>
                                    <div className="comment_bord">
                                        <p>{editingOrder.stretchOrder.buyerComment}</p>
                                    </div>
                                </div>
                                <div className="popoxel">
                                    <button className="btn btn1" onClick={() => editOrder(editingOrder.stretchOrder._id)}>Լռացնել</button>
                                    <p>{editingOrder.stretchOrder.status}</p>
                                    <p> {parseDate(editingOrder.stretchOrder.date)}</p>

                                </div>
                            </div>
                        </div>

                        : null
                }

            </div>
            <div className="viewStrechOrder_order">
                {
                    editingOrder.stretchOrder.groupedStretchCeilings ||
                        editingOrder.stretchOrder.groupedAdditionals ||
                        editingOrder.stretchOrder.groupedProfils ||
                        editingOrder.stretchOrder.groupedLightPlatforms ||
                        editingOrder.stretchOrder.groupedLightRings ?
                        <div className="viewStrechOrder_buyer_title_name">Ապրանքացանկ | Չափագրում-{parseDate(editingOrder.stretchOrder.measureDate)}</div>
                        : null
                }
                <div className="viewStrechOrder_order_apranq">

                    <div>

                        {
                            editingOrder.stretchOrder.groupedStretchCeilings ?
                                <div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Ձգվող առաստաղ</th>
                                                <th>Լայնություն</th>
                                                <th>Երկարություն</th>
                                                <th>Ք/Մ</th>
                                                <th>Գին</th>
                                                <th>Ընդամենը</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {
                                                stretchTexture.map((e: any, i: any) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>
                                                                {e.textureName}
                                                            </td>
                                                            <td>
                                                                {e.stretchHeight}
                                                            </td>
                                                            <td>
                                                                {e.stretchWidth}
                                                            </td>
                                                            <td>
                                                                {e.stretchSquer}
                                                            </td>
                                                            <td>
                                                                {e.stretchPrice}
                                                            </td>
                                                            <td>
                                                                {e.stretchTotal}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>

                                : null
                        }
                    </div>
                    <div>
                        {
                            editingOrder.stretchOrder.groupedAdditionals ?
                                <div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Լռացուցիչ</th>
                                                <th>Քանակ</th>
                                                <th>Գին</th>
                                                <th>Ընդամենը</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {
                                                additionals.map((e: any, i: any) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>
                                                                {e.additionalName}
                                                            </td>
                                                            <td>
                                                                {e.additionalQuantity}
                                                            </td>
                                                            <td>
                                                                {e.additionalPrice}
                                                            </td>
                                                            <td>
                                                                {e.additionalTotal}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>

                                : null
                        }
                    </div>
                    <div className="order_profil_platform">

                        <div>
                            {
                                editingOrder.stretchOrder.groupedProfils ?
                                    <div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Պրոֆիլ</th>
                                                    <th>Քանակ</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {
                                                    profil.map((e: any, i: any) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>
                                                                    {e.profilName}
                                                                </td>
                                                                <td>
                                                                    {e.profilQuantity}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    : null
                            }
                        </div>
                        <div>
                            {
                                editingOrder.stretchOrder.groupedLightPlatforms ?
                                    <div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Լույսի պլատֆորմ</th>
                                                    <th>Քանակ</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {
                                                    lightPlatform.map((e: any, i: any) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>
                                                                    {e.lightPlatform}
                                                                </td>
                                                                <td>
                                                                    {e.lightPlatformQuantity}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    : null
                            }
                        </div>
                    </div>
                    <div>

                    </div>
                    <div className="order_profil_platform">
                        {
                            editingOrder.stretchOrder.groupedLightRings ?
                                <div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Լույսի օղակ</th>
                                                <th>Քանակ</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {
                                                lightRing.map((e: any, i: any) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>
                                                                {e.lightRingName
                                                                }
                                                            </td>
                                                            <td>
                                                                {e.lightRingQuantity}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>

                                : null
                        }
                        <div className="cha">
                            {
                                editingOrder.stretchOrder?.orderComment ?
                                    <div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Նկարագրություն</th>

                                                </tr>

                                            </thead>
                                            <tbody>
                                                {
                                                    stretchTexture.map((e: any, i: any) => {
                                                        return (

                                                            <td key={i}>
                                                                {e.orderComment}
                                                            </td>


                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    : null
                            }
                        </div>
                    </div>

                </div>




            </div>
            <div className="">
                <div className="viewStrechOrder_buyer_title_name">Վճարում</div>
                <div className="viewStrechOrder_order_pey">

                    <div >

                        {
                            editingOrder.stretchOrder?.paymentMethod ?
                                <div className="pey_method">
                                    <div>Վճարման եղանակ</div>
                                    <div>{editingOrder.stretchOrder.paymentMethod}</div>
                                </div>

                                : null
                        }
                    </div>
                    <div>

                        {
                            editingOrder.stretchOrder?.balance ?
                                <div className="pey_method">
                                    <div>Ընդամենը</div>
                                    <div>{editingOrder.stretchOrder.balance}</div>
                                </div>

                                : null
                        }
                    </div>
                    <div>

                        {
                            editingOrder.stretchOrder?.prepayment ?
                                <div className="pey_method">
                                    <div>Կանխավճար</div>
                                    <div>{editingOrder.stretchOrder.prepayment}</div>
                                </div>

                                : null
                        }
                    </div>
                    <div>

                        {
                            editingOrder.stretchOrder?.groundTotal ?
                                <div className="pey_method">
                                    <div>Մնացորդ</div>
                                    <div>{editingOrder.stretchOrder.groundTotal}</div>
                                </div>

                                : null
                        }
                    </div>
                </div>
            </div>
        </div>

    );
}

