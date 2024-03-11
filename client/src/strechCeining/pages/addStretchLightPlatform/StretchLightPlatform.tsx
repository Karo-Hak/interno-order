import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchLightPlatform.css'
import { selectStretchLightPlatform } from "../../features/strechLightPlatform/strechLightPlatformSlice";
import { getAllUnyt } from "../../unyt/unytApi";
import { selectUnyt } from "../../unyt/unytSlice";
import { useForm } from "react-hook-form";
import { addStretchLightPlatform, getAllStretchLightPlatform } from "../../features/strechLightPlatform/strechLightPlatformApi";
import { StretchMenu } from "../../../component/menu/StretchMenu";

export const StretchLightPlatform: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
    const stretchLightPlatform = useAppSelector(selectStretchLightPlatform)
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
        dispatch(getAllStretchLightPlatform(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })

    }, [])

    const newLightPlatform = (stretchLightPlatform: any) => {
        dispatch(addStretchLightPlatform({ stretchLightPlatform, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }

    return (
        <>
            <StretchMenu />
            <div >
                <form onSubmit={handleSubmit(newLightPlatform)} >
                    <div style={{
                        display: 'flex',
                        margin: "20px",
                        gap: "10px"
                    }}>
                        <div className="divLabel">
                            <label htmlFor="name">Անվանում</label>
                            <select className="select" id="id"  {...register("id", { required: true })}>
                                <option></option>
                                {
                                    stretchLightPlatform.arrStretchLightPlatform && stretchLightPlatform.arrStretchLightPlatform.length > 0 ?
                                        stretchLightPlatform.arrStretchLightPlatform.map((e: any, i: any) => {
                                            return (
                                                <option key={e._id} value={e._id}>{e.name}</option>
                                            )
                                        })
                                        :
                                        null
                                }
                            </select>
                        </div>
                        <div className="divLabel">
                            <label htmlFor="price">Գին</label>
                            <input id="price" type="number" placeholder="Price"  {...register("price", { required: true })} />
                        </div>
                        <button>Գրանցել</button>
                    </div>
                </form>
                {
                    stretchLightPlatform.arrStretchLightPlatform && stretchLightPlatform.arrStretchLightPlatform.length > 0 ?
                        <div style={{
                            margin: "20px",
                            width: "500px"
                        }}>
                            <table className="tableName">
                                <thead>
                                    <tr>
                                        <th scope="col">Անվանում</th>
                                        <th scope="col">Գին</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        stretchLightPlatform.arrStretchLightPlatform.map((e: any) => {
                                            return (
                                                <tr key={e._id}>
                                                    <td>{e.name}</td>
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

