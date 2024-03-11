import { selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { userProfile } from "../../features/user/userApi";
import { viewNewOrders } from "../../features/order/orderApi";
import { selectOrder } from "../../features/order/orderSlice";
import { WallpaperMenu } from "../../component/menu/WallpaperMenu";
import './adminProfile.css'

export const AdminProfile: React.FC = (): JSX.Element => {
    const user = useAppSelector(selectUser);
    const newOrders = useAppSelector(selectOrder);
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);

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


    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }

    const viewOrder = (id: any) => {
        window.open("/order/" + id)

    }

    return (
        <>
            <WallpaperMenu />
            <div className='newStretchOrderSection_head'>
                <div className='newStretchOrderSection_head_name'>
                    Ֆոտոպաստար պատվերներ
                </div>
            </div>
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

