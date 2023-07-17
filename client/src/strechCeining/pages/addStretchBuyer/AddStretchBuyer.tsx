import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './addStretchBuyer.css'
import { useForm } from "react-hook-form";
import { newStretchBuyer } from "../../StrechBuyer/strechBuyerApi";

export const StretchBuyer: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
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
      
    }, [])

    const addStretchBuyer = (stretchBuyer: any) => {
        dispatch(newStretchBuyer({ stretchBuyer, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()

    }


    return (
        <>

            <div className="profile">
                <form onSubmit={handleSubmit(addStretchBuyer)} >
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
                            <button className="btn">Գրանցել</button>
                        </div>
                    </div>



                </form>
                {/* {
                    stretchTexture.arrStretchTexture && stretchTexture.arrStretchTexture.length > 0 ?
                        <div className="profile" style={{fontSize:"12px"}}>
                            <table className="table" style={{ color: "white" }}>
                                <thead>
                                    <tr>
                                        <th scope="col">Անվանում</th>
                                        <th scope="col">Լայնություն</th>
                                        <th scope="col">Չ/Մ</th>
                                        <th scope="col">Գին Գարպուն</th>
                                        <th scope="col">Գին Ատրեզ</th>
                                        <th scope="col">Համ Գին Գարպուն </th>
                                        <th scope="col">Համ Գին Ատրեզ</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        stretchTexture.arrStretchTexture.map((e: any) => {
                                            return (
                                                <tr key={e._id}>
                                                    <td>{e.name}</td>
                                                    <td>{e.weight}</td>
                                                    <td>{e.unyt}</td>
                                                    <td>{e.priceGarpun}</td>
                                                    <td>{e.priceOtrez}</td>
                                                    <td>{e.priceCoopGarpun}</td>
                                                    <td>{e.priceCoopOtrez}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        :
                        null
                } */}



            </div>

        </>
    );
}

