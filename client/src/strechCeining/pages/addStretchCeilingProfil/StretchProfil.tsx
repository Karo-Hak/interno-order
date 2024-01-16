import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchProfil.css'
import { selectStretchProfil } from "../../strechProfil/strechProfilSlice";
import { getAllUnyt } from "../../unyt/unytApi";
import { selectUnyt } from "../../unyt/unytSlice";
import { useForm } from "react-hook-form";
import { addStretchProfil, getAllStretchProfil } from "../../strechProfil/strechProfilApi";

export const StretchProfil: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
    const stretchProfil = useAppSelector(selectStretchProfil)
    const unyt = useAppSelector(selectUnyt)
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })
        dispatch(getAllUnyt(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })
        dispatch(getAllStretchProfil(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })

    }, [])

    const newStretchProfil = (stretchProfil: any) => {
        dispatch(addStretchProfil({ stretchProfil, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }

    return (
        <>
            <div className="profile">
                <form onSubmit={handleSubmit(newStretchProfil)} >
                    <div className="divAllStrech">

                        <div>
                            <label htmlFor="name">Անվանում</label>
                            <input id="name"  type="text" placeholder="Name"  {...register("name", { required: true })} />
                        </div>
                        <div>
                            <label htmlFor="unyt">Չ/Մ</label>
                            <select id="unyt" {...register("unyt", { required: true })}>
                                {
                                    unyt.arrUnyt && unyt.arrUnyt.length > 0 ?
                                        unyt.arrUnyt.map((e: any, i: any) => {
                                            return (
                                                <option key={e._id} value={e.name}>{e.name}</option>
                                            )
                                        })
                                        :
                                        null
                                }
                            </select>
                        </div>
                        <div>
                            <label htmlFor="price">Գին</label>
                            <input id="price" type="number" placeholder="Price"  {...register("price", { required: true })} />
                        </div>
                    </div>
                    <div>
                        <button className="btn">Գրանցել</button>
                    </div>
                </form>
                {
                    stretchProfil.arrStretchProfil && stretchProfil.arrStretchProfil.length > 0 ?
                        <div className="profile">
                            <table className="table" style={{ color: "white" }}>
                                <thead>
                                    <tr>
                                        <th scope="col">Անվանում</th>
                                        <th scope="col">Չ/Մ</th>
                                        <th scope="col">Գին</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        stretchProfil.arrStretchProfil.map((e: any) => {
                                            return (
                                                <tr key={e._id}>
                                                    <td>{e.name}</td>
                                                    <td>{e.unyt}</td>
                                                    <td>{e.price}</td>
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

