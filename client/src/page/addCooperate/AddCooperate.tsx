import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlice";
import { getAllCooperate, getCoopSpher, newCooperate } from "../../features/cooperate/cooperateApi";
import { selectCooperate } from "../../features/cooperate/cooperateSlice";

export const AddCooperate: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const cooperate = useAppSelector(selectCooperate);
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['access_token']);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()

    useEffect(() => {
        dispatch(getAllCooperate(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
        dispatch(getCoopSpher(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate('/')
            }
        })
    }, [])

    const saveCooperate = (cooperate: any) => {

        cooperate = { ...cooperate, phone: cooperate.phone.replace(/\s/g, "") }
        dispatch(newCooperate({ cooperate, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }

    return (
        <div>
            <div className="profile">
                <form className="divBtn" onSubmit={handleSubmit(saveCooperate)}>
                    <div style={{ display: "flex", gap: "5px" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="cooperateName">Անուն</label>
                            <input id="cooperateName" className="userInput" type="text" placeholder="Name" {...register("name", { required: true })} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="cooperateSurname">Ազգանուն</label>
                            <input id="cooperateSurname" className="userInput" type="text" placeholder="Surname" {...register("surname")} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="cooperatePhone">Հեռախես</label>
                            <input id="cooperatePhone" className="userInput" type="text" placeholder="Phone" {...register("phone")} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="cooperateRate">Գործընկերոջ տոկոս</label>
                            <input id="cooperateRate" className="userInput" type="text" placeholder="Cooperate Rate" {...register("cooperateRate", { required: true })} />
                        </div>
                        {
                            cooperate?.cooperationSphere && cooperate.cooperationSphere.length > 0 ?

                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label htmlFor="cooperateSpher">Գործընկերոջ ոլորտ</label>
                                    <select id="cooperateSpher"  aria-label="Default select example" {...register("cooperationSphere", { required: true })}>
                                        <option value={0}>Select</option>
                                        {
                                            cooperate.cooperationSphere.map((e: any) => {
                                                return (
                                                    <option key={e._id} value={e._id}>
                                                        {e.name}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                :
                                null
                        }
                    </div>
                    <button className="btn" >Գրանցել</button>
                </form>
            </div>
            {
                cooperate?.arrCooperate && cooperate.arrCooperate.length > 0 ?
                    <div className="profile">
                        <table className="table" style={{ color: "white" }}>
                            <thead>
                                <tr>
                                    <th scope="col">Անուն</th>
                                    <th scope="col">Ազգանուն</th>
                                    <th scope="col">Հեռախես</th>
                                    <th scope="col">Տոկոս</th>
                                    <th scope="col">Ոլորտ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cooperate.arrCooperate.map((e: any) => {
                                        return (
                                            <tr key={e._id}>
                                                <td>{e.name}</td>
                                                <td>{e.surname}</td>
                                                <td>{e.phone}</td>
                                                <td>{e.cooperateRate}</td>
                                                <td>{e.cooperationSphere.name}</td>
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
    )
} 