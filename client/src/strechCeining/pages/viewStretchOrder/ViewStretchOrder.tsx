import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './viewStretchOrder.css'
import { findStretchOrder } from "../../stretchCeilingOrder/stretchOrderApi";
import { selectStretchOrder } from "../../stretchCeilingOrder/stretchOrderSlice";
import ViewStretchTexturesSection from "./ViewStretchTexturesSection";
import ViewProfilSection from "./ViewProfilSection";
import ViewLightPlatformSection from "./ViewLightPlatformSection";
import ViewLightRingSection from "./ViewLightRingSection";
import ViewAdditionalSection from "./ViewAdditionalSection";
import ViewWorkSection from "./ViewWorkSection";
import ViewBardutyunSection from "./ViewBardutyunSection";
import ViewOtherSection from "./ViewOtherSection";


export const ViewStretchOrder: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const params = useParams()

    const [rooms, setRooms] = useState<any[]>([]);
    const [works, setWorks] = useState<any[]>([]);

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
                }
            }
        });
    }, []);


    const order = useAppSelector(selectStretchOrder).stretchOrder;
    const user = useAppSelector(selectUser);

    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }


    function editOrder() {
        window.open('/stretchceiling/editStretchOrder/' + params.id, '_blank');

    }

    return (<>
        {
            order && Object.values(order).length > 0 ?
                <div className=''>
                    <div style={{
                        height: "30px",
                        display: "flex",
                        justifyContent: "end",
                        padding: "2px 10px",
                        gap: "20px"
                    }}
                        className="admin_profile_Strech">
                        <p style={{ color: "white", marginTop: "10px" }}>կարգավիճակ -- {order.status}</p>
                        <button type="button" onClick={editOrder}>Լրացնել</button>
                    </div>
                    <div className=''>
                        <div >
                            <table className='buyerSectionName'>
                                <thead>
                                    <tr style={{
                                        background: "#dfdce0",
                                        height: "10px"
                                    }}>
                                        <th>Կոդ</th>
                                        <th>ԱԱ/սկիզբ</th>
                                        <th>ԱԱ/ավարտ</th>
                                        <th>Անուն Ազգանուն</th>
                                        <th>Մարզ</th>
                                        <th>Հասցե</th>
                                        <th>Հեռախես</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{
                                        height: "10px"
                                    }}>
                                        <td>{order.code}</td>
                                        <td>{parseDate(order.measureDate)}</td>
                                        <td>{parseDate(order.installDate)}</td>
                                        <td>{order.buyer.buyerName}</td>
                                        <td>{order.buyer.buyerRegion}</td>
                                        <td>{order.buyer.buyerAddress}</td>
                                        <td>
                                            <div className='buyerPhone1_2'>
                                                {order.buyer.buyerPhone1} / {order.buyer.buyerPhone2}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p style={{ height: "5px" }}></p>
                    <div>
                        <div >
                            <table className='paymentSection' >
                                <thead>
                                    <tr style={{
                                        background: "#dfdce0",
                                        height: "10px"
                                    }}>
                                        <th>Վճարման միջոց</th>
                                        <th>Գումար</th>
                                        <th>Կանխավճար</th>
                                        <th>Մնացորդ</th>
                                        <th>Նկարագրություն</th>
                                        <th>Աշխատակից</th>
                                        <th>Աշխատավարձ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{
                                        height: "10px"
                                    }}>
                                        <td>
                                            {order.paymentMethod}
                                        </td>
                                        <td>{order.balance}</td>
                                        <td>{order.prepayment}</td>
                                        <td>{order.groundTotal}</td>
                                        <td>{order.buyerComment}</td>
                                        <td>{order.stretchWorker?.stretchWorkerName}</td>
                                        <td>{order.salary}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div style={{ height: "20px" }} className="admin_profile_Strech"></div>
                    <div className="grid-container">
                        <ViewWorkSection works={works} />
                        {
                            order && order.orderComment ?
                                <div style={{ border: "1px solid black", padding: "5px" }}>
                                    <p>{order.orderComment}</p>
                                </div>
                                : null
                        }
                    </div>
                    <div >
                        {rooms && rooms.length > 0 ?
                            rooms.map((room: any) => {
                                return (
                                    <div key={room.id} >
                                        <div style={{ backgroundColor: "GrayText", paddingLeft: "100px", color: "white" }}>
                                            <h5>{room.name}</h5>
                                        </div>
                                        <div className="apranqacank">
                                            <ViewStretchTexturesSection room={room} />
                                            <ViewProfilSection room={room} />
                                            <ViewLightPlatformSection room={room} />
                                            <ViewLightRingSection room={room} />
                                            <ViewBardutyunSection room={room} />
                                            <ViewAdditionalSection room={room} />
                                            <ViewOtherSection room={room} />

                                        </div>
                                    </div>
                                );
                            })
                            : null}
                    </div>


                </div>
                : null
        }
    </>);
}

