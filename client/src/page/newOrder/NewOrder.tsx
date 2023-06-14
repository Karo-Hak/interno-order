import './newOrder.css'
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectOrder } from '../../features/order/orderSlice';
import { useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { findNewOrder, findOrder, updateOrder, } from "../../features/order/orderApi";
import ImageUpload from '../uploadImg/uploadImg';
import { selectUser } from '../../features/user/userSlice';


export const NewOrder: React.FC = (): JSX.Element => {
    const user = useAppSelector(selectUser)
    const order = useAppSelector(selectOrder);
    const dispatch = useAppDispatch()
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const params = useParams()



    useEffect(() => {

        dispatch(findNewOrder({ params, cookies })).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
            }
        })
    }, [])

    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }
console.log(order.order.texture.name);

    return (
        <div>
            <div className="profile">

                {
                    order?.order && order?.order._id ?
                        <div className='divOrder'>
                            <div>
                                <h5 >Date - {parseDate(order.order.date)} | Status - {order.order.status}</h5>
                                <table className="table" style={{ color: "white" }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Phone</th>
                                            <th scope="col">Adress</th>


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
                                <table className="table" style={{ color: "white" }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Weight/Height</th>
                                            <th scope="col">Square</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Picture</th>
                                            <th scope="col">Texture</th>
                                            <th scope="col">Prepayment</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Deadline</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{order.order.weight} x {order.order.height}</td>
                                            <td>{order.order.sqMetr}</td>
                                            <td>{order.order.price}</td>
                                            <td>{order.order.picCode}</td>
                                            <td>{order.order.texture.name}</td>
                                            <td>{order.order.prepayment}</td>
                                            <td>{order.order.total}</td>
                                            <td>{parseDate(order.order.deadline)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className='divOrder'>
                                    <h5>Balance {order.order.groundTotal}</h5>
                                    <ImageUpload />
                                </div>
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


