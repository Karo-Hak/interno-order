import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchTexture.css'
import { selectStretchTexture } from "../../strechTexture/strechTextureSlice";
import { getAllUnyt } from "../../unyt/unytApi";
import { selectUnyt } from "../../unyt/unytSlice";
import { useForm } from "react-hook-form";
import { addStretchTexture, getAllStretchTexture } from "../../strechTexture/strechTextureApi";

export const StretchTexture: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
    const stretchTexture = useAppSelector(selectStretchTexture)
    const unyt = useAppSelector(selectUnyt)
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
        dispatch(getAllUnyt(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
        dispatch(getAllStretchTexture(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })

    }, [])

    const newStretchTexture = (stretchTexture: any) => {
        console.log(stretchTexture);
        dispatch(addStretchTexture({ stretchTexture, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });

    }

    console.log(stretchTexture.arrStretchTexture
    );


    return (
        <>

            <div className="profile">
                <form onSubmit={handleSubmit(newStretchTexture)} >
                    <div className="divAllStrech">
                        <div className="stretchDiv">
                            <div>
                                <label htmlFor="name">Անվանում</label>
                                <input id="name" className="userInput form-control" type="text" placeholder="Name"  {...register("name", { required: true })} />
                            </div>
                            <div>
                                <label htmlFor="weight">Լայնություն</label>
                                <input id="weight" className="userInput form-control" type="number" placeholder="Weight"  {...register("weight", { required: true })} />
                            </div>
                            <div>
                                <label htmlFor="unyt">Չ/Մ</label>
                                <select id="unyt" className="userInput form-select"  {...register("unyt", { required: true })}>
                                    {
                                        unyt.arrUnyt?.stretchTextureUnyt && unyt.arrUnyt.stretchTextureUnyt.length > 0 ?
                                            unyt.arrUnyt.stretchTextureUnyt.map((e: any, i: any) => {
                                                return (
                                                    <option key={e._id} value={e.name}>{e.name}</option>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="stretchDiv">
                            <label>Վաճառքի գին</label>
                            <p>________________</p>
                            <div>
                                <label htmlFor="priceGarpun">Գին Գարպուն</label>
                                <input id="priceGarpun" className="userInput form-control" type="number" placeholder="Price Garpun"  {...register("priceGarpun", { required: true })} />
                            </div>
                            <div>
                                <label htmlFor="priceOtrez">Գին Կտրվածք</label>
                                <input id="priceOtrez" className="userInput form-control" type="number" placeholder="Price Otrez"  {...register("priceOtrez", { required: true })} />
                            </div>
                        </div>
                        <div className="stretchDiv">
                            <label>Համագործակցության գին</label>
                            <p>_______________________________</p>
                            <div>
                                <label htmlFor="priceCoopGarpun">Գին Գարպուն</label>
                                <input id="priceCoopGarpun" className="userInput form-control" type="number" placeholder="Price Garpun"  {...register("priceCoopGarpun", { required: true })} />
                            </div>
                            <div>
                                <label htmlFor="priceCoopOtrez">Գին Կտրվածք</label>
                                <input id="priceCoopOtrez" className="userInput form-control" type="number" placeholder="Price Otrez"  {...register("priceCoopOtrez", { required: true })} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button className="btn">Գրանցել</button>
                    </div>


                </form>
                {
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
                }



            </div>

        </>
    );
}

