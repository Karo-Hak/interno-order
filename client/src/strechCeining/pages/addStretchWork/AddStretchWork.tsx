import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './addStretchWork.css'
import { useForm } from "react-hook-form";
import { allStretchWork, newStretchWork } from "../../features/StrechWork/strechWorkApi";
import { selectStretchWork } from "../../features/StrechWork/strechWorkSlice";
import { StockMenu } from "../../../component/menu/StockMenu";

export const StretchWork: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
    const work = useAppSelector(selectStretchWork)
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
        dispatch(allStretchWork(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })

    }, [])

    const addStretchWork = (stretchWork: any) => {
        dispatch(newStretchWork({ stretchWork, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()

    }

    return (
        <>
        <StockMenu />
            <div className="addStretchBuyer_head">
                <div className="addStretchBuyer_head_name">Աշխատակից</div>
                <form onSubmit={handleSubmit(addStretchWork)} >
                    <div className="addStrerchBuyer_info">
                        <div className="addStrerchBuyer_info_section">
                            <label htmlFor="name">Անվանում</label>
                            <input id="name" type="text" placeholder="Name"  {...register("name", { required: true })} />
                        </div>
                        <div className="addStrerchBuyer_info_section">
                            <label htmlFor="price">Գին</label>
                            <input id="price" type="number" placeholder="Price"  {...register("price", { required: true })} />
                        </div>
                        <div className="addStrerchBuyer_info_section">
                            <button className="btn btn1">Գրանցել</button>
                        </div>
                    </div>

                </form>
                {
                    work.arrStretchWork && work.arrStretchWork.length > 0 ?
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
                                         work.arrStretchWork.map((e: any) => {
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

