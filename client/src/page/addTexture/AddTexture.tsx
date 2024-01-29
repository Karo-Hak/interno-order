import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAllTexture, newTexture } from "../../features/texture/textureApi";
import { Texture, selectTexture } from "../../features/texture/textureSlice";
import "./addTexture.css"
import { selectUser } from "../../features/user/userSlice";
import { userProfile } from "../../features/user/userApi";

export const AddTexture: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const texture = useAppSelector(selectTexture);
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['access_token']);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()

    useEffect(() => {
        dispatch(getAllTexture(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
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

    const saveTexture = (texture: any) => {
        dispatch(newTexture({ texture, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }

    const addBuyer = () => {
        navigate('/wallpaper/addBuyer');
    }
    const addCooperate = () => {
        if (user.profile.role === "admin") {
            navigate("/wallpaper/addCooperate")
        }
    }
    const addTexture = () => {
        if (user.profile.role === "admin") {
            navigate("/wallpaper/addTexture")
        }
    }
    const search = () => {
        navigate("/wallpaper/searchOrder")
    }
    const openOrderForm = () => {
        navigate("/wallpaper")
    }

    return (
        <div>
            <div className="admin_profile">
                <div >
                    {/* <button className="btn" onClick={openCoopSpher}>Add cooperation sphere</button> */}
                    <button className="btn" onClick={openOrderForm}>Ավելացնել Պատվեր</button>
                    <button className="btn" onClick={addBuyer} >Ավելացնել Գնորդ</button>
                    {
                        user.profile && user.profile.role === "admin" ?
                            <>
                                <button className="btn" onClick={addCooperate} >Ավելացնել Գործընկեր</button>
                                <button className="btn" onClick={addTexture} >Ավելացնել Տեսակ</button>
                            </>
                            :
                            null
                    }
                    <button className="btn" onClick={search} >Դիտել Պատվերները</button>
                </div>
            </div>
            <div className="divTexture">
                <form className="divBtn" onSubmit={handleSubmit(saveTexture)}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="addTexture">Անվանում</label>
                        <input id="addTexture" className="userInput" type="text" placeholder="Name" {...register("name", { required: true })} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="addPrice">Գին</label>
                        <input id="addPrice" className="userInput" type="number" placeholder="Price" {...register("price", { required: true })} />
                    </div>
                    <button className="btn" >Գրանցել</button>
                </form>
                {
                    texture?.arrTexture && texture.arrTexture.length > 0 ?
                        <div className="divTexture">
                            <table className="table" style={{ color: "white" }}>
                                <thead>
                                    <tr>
                                        <th>Անվանում</th>
                                        <th>Գին</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        texture.arrTexture.map((e: Texture) => {
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
        </div>
    )
}