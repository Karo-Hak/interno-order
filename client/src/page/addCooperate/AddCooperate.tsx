import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlice";
import { getAllCooperate, getCoopSpher, newCooperate } from "../../features/cooperate/cooperateApi";
import { selectCooperate } from "../../features/cooperate/cooperateSlice";
import { userProfile } from "../../features/user/userApi";
import { WallpaperMenu } from "../../component/menu/WallpaperMenu";

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
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
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
            <WallpaperMenu />
            <div style={{
                margin:"20px"
            }}>
                <form onSubmit={handleSubmit(saveCooperate)}>
                    <div style={{
                        display: "flex",
                        gap: "5px"
                    }}>
                        <div className="divLabel">
                            <label htmlFor="cooperateName">Անուն</label>
                            <input id="cooperateName" type="text" placeholder="Name" {...register("name", { required: true })} />
                        </div>
                        <div className="divLabel">
                            <label htmlFor="cooperateSurname">Ազգանուն</label>
                            <input id="cooperateSurname" type="text" placeholder="Surname" {...register("surname")} />
                        </div>
                        <div className="divLabel">
                            <label htmlFor="cooperatePhone">Հեռախես</label>
                            <input id="cooperatePhone" type="text" placeholder="Phone" {...register("phone")} />
                        </div>
                        <div className="divLabel">
                            <label htmlFor="cooperateRate">Գործընկերոջ տոկոս</label>
                            <input id="cooperateRate" type="text" placeholder="Cooperate Rate" {...register("cooperateRate", { required: true })} />
                        </div>
                        {
                            cooperate?.cooperationSphere && cooperate.cooperationSphere.length > 0 ?

                                <div className="divLabel">
                                    <label htmlFor="cooperateSpher">Գործընկերոջ ոլորտ</label>
                                    <select id="cooperateSpher" aria-label="Default select example" {...register("cooperationSphere", { required: true })}>
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
                        <button >Գրանցել</button>
                    </div>
                </form>
            </div>
            {
                cooperate?.arrCooperate && cooperate.arrCooperate.length > 0 ?
                    <div style={{
                        margin:"20px"
                    }}>
                        <table className="tableName">
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