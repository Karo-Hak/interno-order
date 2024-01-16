import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './addStretchBuyer.css'
import { useForm } from "react-hook-form";
import { allStretchBuyer, newStretchBuyer } from "../../StrechBuyer/strechBuyerApi";
import { selectStretchBuyer } from "../../StrechBuyer/strechBuyerSlice";

export const StretchBuyer: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
    const buyer = useAppSelector(selectStretchBuyer)
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
        dispatch(allStretchBuyer(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })

    }, [])

    const addStretchBuyer = (stretchBuyer: any) => {
        dispatch(newStretchBuyer({ stretchBuyer, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()

    }

    console.log(buyer.arrStretchBuyer
    );

    return (
        <>

            <div className="profile">
                <form onSubmit={handleSubmit(addStretchBuyer)} >
                    <div className="divAllStrech">

                        <div>
                            <label htmlFor="name">Անուն</label>
                            <input id="name" type="text" placeholder="Name"  {...register("buyerName", { required: true })} />
                        </div>
                        <div>
                            <label htmlFor="phone">Հեռախոս</label>
                            <input id="phone" type="number" placeholder="Phone"  {...register("buyerPhone", { required: true })} />
                        </div>
                        <div>
                            <label htmlFor="adress">Հասցե</label>
                            <input id="adress" type="text" placeholder="Address"  {...register("buyerAddress", { required: true })} />
                        </div>

                    </div>
                    <div>
                        <button className="btn">Գրանցել</button>
                    </div>


                </form>
                {
                    buyer.arrStretchBuyer && buyer.arrStretchBuyer.length > 0 ?
                        <div className="profile" >
                            <table className="table" style={{ color: "white" }}>
                                <thead>
                                    <tr>
                                        <th scope="col">Անուն</th>
                                        <th scope="col">Հեռախոս</th>
                                        <th scope="col">Հասցե</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        buyer.arrStretchBuyer.map((e: any) => {
                                            return (
                                                <tr key={e._id}>
                                                    <td>{e.buyerName}</td>
                                                    <td>{e.buyerPhone}</td>
                                                    <td>{e.buyerAddress}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        :
                        null
                }




            </div>

        </>
    );
}

