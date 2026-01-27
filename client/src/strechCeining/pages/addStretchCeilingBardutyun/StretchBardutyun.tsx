import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchBardutyun.css'
import { selectStretchBardutyun } from "../../features/strechBardutyun/strechBardutyunSlice";
import { getAllUnyt } from "../../unyt/unytApi";
import { selectUnyt } from "../../unyt/unytSlice";
import { useForm } from "react-hook-form";
import { addStretchBardutyun, getAllStretchBardutyun } from "../../features/strechBardutyun/strechBardutyunApi";
import { StretchMenu } from "../../../component/menu/StretchMenu";
import { StockMenu } from "../../../component/menu/StockMenu";

export const StretchBardutyun: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
    const stretchBardutyun = useAppSelector(selectStretchBardutyun)
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
        dispatch(getAllStretchBardutyun(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })

    }, [])

    const newStretchBardutyun = (stretchBardutyun: any) => {
        dispatch(addStretchBardutyun({ stretchBardutyun, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }

    return (
        <>
            <StockMenu />
            <div style={{
                margin: "20px"
            }}>
                <form onSubmit={handleSubmit(newStretchBardutyun)} >
                    <div style={{
                        display: "flex",
                        gap: "10px"
                    }} >
                        <div className="divLabel">
                            <label htmlFor="name">Անվանում</label>
                            <input id="name" type="text" placeholder="Name"  {...register("name", { required: true })} />
                        </div>
                        <div className="divLabel">
                            <label htmlFor="name">Գին</label>
                            <input id="name" type="text" placeholder="Name"  {...register("price", { required: true })} />
                        </div>
                        <button >Գրանցել</button>
                    </div>
                </form>
                {
                    stretchBardutyun.arrStretchBardutyun && stretchBardutyun.arrStretchBardutyun.length > 0 ?
                        <div style={{
                            margin: "20px 0 ",
                            width: "500px"
                        }}>
                            <table className="tableName" >
                                <thead>
                                    <tr>
                                        <th scope="col">Անվանում</th>
                                        <th scope="col">Գին</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        stretchBardutyun.arrStretchBardutyun.map((e: any) => {
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

