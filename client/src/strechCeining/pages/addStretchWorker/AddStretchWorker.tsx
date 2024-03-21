import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './addStretchWorker.css'
import { useForm } from "react-hook-form";
import { allStretchWorker, newStretchWorker } from "../../features/StrechWorker/strechWorkerApi";
import { selectStretchWorker } from "../../features/StrechWorker/strechWorkerSlice";
import { StretchMenu } from "../../../component/menu/StretchMenu";

export const StretchWorker: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const user = useAppSelector(selectUser);
    const worker = useAppSelector(selectStretchWorker)
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
        dispatch(allStretchWorker(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })

    }, [])

    const addStretchWorker = (stretchWorker: any) => {
        dispatch(newStretchWorker({ stretchWorker, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()

    }



    return (
        <>
        <StretchMenu />
            <div className="addStretchBuyer_head_name">Gnordi tvyalner</div>
            
            <form onSubmit={handleSubmit(addStretchWorker)} >
                <div className="addStrerchBuyer_info">
                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="name">Անուն</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            {...register("name", { required: true })} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="phone">Հեռախոս</label>
                        <input
                            id="phone"
                            type="number"
                            placeholder="Phone"
                            {...register("stretchWorkerPhone1", { required: true })} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="phone">Հեռախոս</label>
                        <input
                            id="phone"
                            type="number"
                            placeholder="Phone"
                            {...register("stretchWorkerPhone2")} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="region">Մարզ</label>
                        <input
                            id="region"
                            type="text"
                            placeholder="Region"
                            {...register("stretchWorkerRegion", { required: true })} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="adress">Հասցե</label>
                        <input
                            id="adress"
                            type="text"
                            placeholder="Address"
                            {...register("stretchWorkerAddress", { required: true })} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <button >Գրանցել</button>
                    </div>
                </div>

            </form>
            {
                worker.arrStretchWorker && worker.arrStretchWorker.length > 0 ?
                    <div className="addStretchBuyer_table" >
                        <div className="addStretchBuyer_head_name">Աշխատակիցներ</div>
                        <table className="table " >
                            <thead>
                                <tr>
                                    <th scope="col">Անուն</th>
                                    <th scope="col">Հեռախոս</th>
                                    <th scope="col">Հեռախոս</th>
                                    <th scope="col">Մարզ</th>
                                    <th scope="col">Հասցե</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    worker.arrStretchWorker.map((e: any) => {
                                        return (
                                            <tr key={e._id}>
                                                <td>{e.name}</td>
                                                <td>{e.stretchWPhone1}</td>
                                                <td>{e.stretchWPhone2}</td>
                                                <td>{e.stretchWRegion}</td>
                                                <td>{e.stretchWAddress}</td>
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

        </>
    );
}

