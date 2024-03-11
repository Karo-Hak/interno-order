import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchLightRing.css'
import { selectStretchLightRing } from "../../features/strechLightRing/strechLightRingSlice";
import { getAllUnyt } from "../../unyt/unytApi";
import { selectUnyt } from "../../unyt/unytSlice";
import { useForm } from "react-hook-form";
import { addStretchLightRing, getAllStretchLightRing } from "../../features/strechLightRing/strechLightRingApi";
import { StretchMenu } from "../../../component/menu/StretchMenu";

export const StretchLightRing: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
    const stretchLightRing = useAppSelector(selectStretchLightRing)
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
        dispatch(getAllStretchLightRing(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })

    }, [])

    const newLightRing = (stretchLightRing: any) => {
        dispatch(addStretchLightRing({ stretchLightRing, cookies })).unwrap().then(res => {
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
                <form onSubmit={handleSubmit(newLightRing)} >
                    <div style={{
                        display: 'flex',
                        margin: "20px",
                        gap: "10px"
                    }}>
                        <div className="divLabel">
                            <label htmlFor="id">Անվանում/Մ</label>
                            <select className="select" id="id"  {...register("id", { required: true })}>
                                <option></option>
                                {
                                    stretchLightRing.arrStretchLightRing && stretchLightRing.arrStretchLightRing.length > 0 ?
                                        stretchLightRing.arrStretchLightRing.map((e: any, i: any) => {
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
                    stretchLightRing.arrStretchLightRing && stretchLightRing.arrStretchLightRing.length > 0 ?
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
                                        stretchLightRing.arrStretchLightRing.map((e: any) => {
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

