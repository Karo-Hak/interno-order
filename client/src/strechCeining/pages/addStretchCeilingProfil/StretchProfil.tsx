import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchProfil.css'
import { selectStretchProfil } from "../../features/strechProfil/strechProfilSlice";
import { getAllUnyt } from "../../unyt/unytApi";
import { selectUnyt } from "../../unyt/unytSlice";
import { useForm } from "react-hook-form";
import { addStretchProfil, getAllStretchProfil } from "../../features/strechProfil/strechProfilApi";
import { StretchMenu } from "../../../component/menu/StretchMenu";

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
            <StretchMenu />
            <div>
                <form onSubmit={handleSubmit(newStretchProfil)} >
                    <div style={{
                        display: "flex",
                        margin: "20px",
                        gap: "10px"
                    }}>
                        <div className="divLabel">
                            <label htmlFor="id">Անվանում</label>
                            <select style={{
                                border: "1px solid black"
                            }}
                                id="id"
                                {...register("id", { required: true })}>
                                <option></option>
                                {
                                    stretchProfil.arrStretchProfil && stretchProfil.arrStretchProfil.length > 0 ?
                                        stretchProfil.arrStretchProfil.map((e: any, i: any) => {
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
                    stretchProfil.arrStretchProfil && stretchProfil.arrStretchProfil.length > 0 ?
                        <div style={{
                            margin:"20px",
                            width:"500px"
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
                                        stretchProfil.arrStretchProfil.map((e: any) => {
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

