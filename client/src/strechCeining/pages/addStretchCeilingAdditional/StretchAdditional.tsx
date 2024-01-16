import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchAdditional.css'
import { selectStretchAdditional } from "../../strechAdditional/strechAdditionalSlice";
import { getAllUnyt } from "../../unyt/unytApi";
import { selectUnyt } from "../../unyt/unytSlice";
import { useForm } from "react-hook-form";
import { addStretchAdditional, getAllStretchAdditional } from "../../strechAdditional/strechAdditionalApi";

export const StretchAdditional: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
    const stretchAdditional = useAppSelector(selectStretchAdditional)
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

        dispatch(getAllStretchAdditional(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })

    }, [])

    const newStretchAdditional = (stretchAdditional: any) => {
        dispatch(addStretchAdditional({ stretchAdditional, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }

 

    return (
        <>
            <div className="profile">
                <form onSubmit={handleSubmit(newStretchAdditional)} >
                    <div className="divAllStrech">
                        <div>
                            <label htmlFor="name">Անվանում</label>
                            <input id="name" type="text" placeholder="Name"  {...register("name", { required: true })} />
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
                    stretchAdditional.arrStretchAdditional && stretchAdditional.arrStretchAdditional.length > 0 ?
                        <div className="profile">
                            <table className="table" style={{ color: "white" }}>
                                <thead>
                                    <tr>
                                        <th scope="col">Անվանում</th>
                                        <th scope="col">Գին</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        stretchAdditional.arrStretchAdditional.map((e: any) => {
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

