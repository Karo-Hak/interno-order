import './order.css'
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectOrder } from '../../features/order/orderSlice';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { findOrder, updateOrder, updatePrepayment, } from "../../features/order/orderApi";
import ImageUpload from '../uploadImg/uploadImg';
import { selectUser } from '../../features/user/userSlice';
import InputModal from '../../component/modal/Modal';



export const Order: React.FC = (): JSX.Element => {
    const user = useAppSelector(selectUser)
    const order = useAppSelector(selectOrder);
    const dispatch = useAppDispatch()
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const params = useParams()
    const [prepayment, setPrepayment] = useState<number>(0)



    useEffect(() => {
        dispatch(findOrder({ params, cookies })).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
    }, [])

    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }

    const orderDone = (id: string) => {
        dispatch(updateOrder({ id, cookies })).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
            window.location.reload()
        })
    }


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const updateOrderInfo = (id: any) => {
        navigate("/updateOrderInfo/" + params.id)
    }


    return (
        <div>
            <div className="profile">

                {
                    order?.order._id ?
                        <div className='divOrder'>
                            <div>
                                <h5 >Date - {parseDate(order.order.date)} | Status - {order.order.status}</h5>
                                Գնորդ
                                <table className="table" style={{ color: "white" }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Անուն</th>
                                            <th scope="col">Հեռախոս</th>
                                            <th scope="col">Հասցե</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={order.order._id}>
                                            <td>{order.order.buyer.name}</td>
                                            <td>{order.order.buyer.phone}</td>
                                            <td>{order.order.buyer.adress}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {
                                    order?.order.cooperate ?
                                        <div>
                                            Գործընկեր
                                            <table className="table" style={{ color: "white" }}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Անուն</th>
                                                        <th scope="col">Հեռախոս</th>
                                                        <th scope="col">Տոկոս</th>
                                                        <th scope="col">Գումար</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr key={order.order._id}>
                                                        <td>{order.order.cooperate.name} {order.order.cooperate.սւռնամե}</td>
                                                        <td>{order.order.cooperate.phone}</td>
                                                        <td>{order.order.cooperate.cooperateRate}</td>
                                                        <td>{order.order.cooperateTotal}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        :
                                        null
                                }
                                <table className="table" style={{ color: "white" }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Եր/Լա</th>
                                            <th scope="col">Ք/Մ</th>
                                            <th scope="col">Գ/Ծ</th>
                                            <th scope="col">Գին</th>
                                            <th scope="col">Զեղչ %</th>
                                            <th scope="col">Գումար</th>
                                            <th scope="col">Վճարված</th>
                                            <th scope="col">Տեսակ</th>
                                            <th scope="col">Վերջնաժամկետ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{order.order.weight} x {order.order.height}</td>
                                            <td>{order.order.sqMetr}</td>
                                            <td>{order.order.metr}</td>
                                            <td>{order.order.price}</td>
                                            <td>{order.order.discount}</td>
                                            <td>{order.order.total}</td>
                                            <td>{order.order.prepayment}</td>
                                            <td>{order.order.texture.name}</td>
                                            <td>{parseDate(order.order.deadline)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className='divOrder'>
                                    <h5>Մնացորդ {order.order.groundTotal}</h5>
                                    <ImageUpload />
                                </div>
                                <div>
                                    <button className='btn' onClick={handleOpenModal}>Կատարել Վճարում</button>
                                    <InputModal isOpen={isModalOpen} onClose={handleCloseModal} />
                                </div>
                                {
                                    user?.profile && user?.profile.role == "admin" && order?.order.status === "progress" ?
                                        <div>
                                            <button className='btn' onClick={() => orderDone(order.order._id)}>Ավարտված</button>
                                            <button className='btn' onClick={()=>updateOrderInfo(order.order_id)}>Փոխել</button>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            <div style={{ border: "2px solid whight" }}>
                                <h6>{order.order.comment}</h6>
                            </div>
                            <div>
                                <img src={order.order.picUrl} className='rounded float-end orderImg'></img>
                            </div>
                        </div>
                        :
                        null
                }
            </div>

        </div >
    )
}


