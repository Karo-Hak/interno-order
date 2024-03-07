import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchBardutyun.css'
import { selectStretchBardutyun } from "../../strechBardutyun/strechBardutyunSlice";
import { getAllUnyt } from "../../unyt/unytApi";
import { selectUnyt } from "../../unyt/unytSlice";
import { useForm } from "react-hook-form";
import { addStretchBardutyun, getAllStretchBardutyun } from "../../strechBardutyun/strechBardutyunApi";

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
            <div className="addStretchBuyer_head">
                <div className="addStretchBuyer_head_name">Բարդություն</div>

                <form onSubmit={handleSubmit(newStretchBardutyun)} >
                    <div className="addStrerchBuyer_info">
                        <div className="addStrerchBuyer_info_section">
                            <label htmlFor="name">Անվանում</label>
                            <input id="name" type="text" placeholder="Name"  {...register("name", { required: true })} />
                        </div>
                        <div className="addStrerchBuyer_info_section">
                            <label htmlFor="name">Գին</label>
                            <input id="name" type="text" placeholder="Name"  {...register("price", { required: true })} />
                        </div>
                        <div className="addStrerchBuyer_info_section">
                            <button className="btn btn1">Գրանցել</button>
                        </div>
                    </div>
                </form>
                {
                    stretchBardutyun.arrStretchBardutyun && stretchBardutyun.arrStretchBardutyun.length > 0 ?
                        <div className="addStretchBuyer_table">
                            <table className="table" >
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

