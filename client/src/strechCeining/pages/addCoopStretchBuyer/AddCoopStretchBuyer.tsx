import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './addCoopStretchBuyer.css'
import { useForm } from "react-hook-form";
import { allCoopStretchBuyer, newCoopStretchBuyer } from "../../CoopStrechBuyer/coopStrechBuyerApi";
import { selectCoopStretchBuyer } from "../../CoopStrechBuyer/coopStrechBuyerSlice";

export const CoopStretchBuyer: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
    const buyer = useAppSelector(selectCoopStretchBuyer)
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
        dispatch(allCoopStretchBuyer(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })

    }, [])

    const addCoopStretchBuyer = (coopStretchBuyer: any) => {
        dispatch(newCoopStretchBuyer({ coopStretchBuyer, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()

    }

    console.log(buyer.arrCoopStretchBuyer);

    return (
        <>

            <div className="profile">
                <form onSubmit={handleSubmit(addCoopStretchBuyer)} >
                    <div className="divAllStrech">

                        <div>
                            <label htmlFor="name">Անուն</label>
                            <input id="name" className="userInput form-control" type="text" placeholder="Name"  {...register("name", { required: true })} />
                        </div>
                        <div>
                            <label htmlFor="weight">Հեռախոս</label>
                            <input id="phone" className="userInput form-control" type="number" placeholder="Phone"  {...register("phone", { required: true })} />
                        </div>
                        <div>
                            <label htmlFor="adress">Հասցե</label>
                            <input id="adress" className="userInput form-control" type="text" placeholder="Adress"  {...register("adress", { required: true })} />
                        </div>
                    </div>
                        <div>
                            <button className="btn">Գրանցել</button>
                        </div>
                </form>
                {
                    buyer.arrCoopStretchBuyer && buyer.arrCoopStretchBuyer.length > 0 ?
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
                                        buyer.arrCoopStretchBuyer.map((e: any) => {
                                            return (
                                                <tr key={e._id}>
                                                    <td>{e.name}</td>
                                                    <td>{e.phone}</td>
                                                    <td>{e.adress}</td>
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

