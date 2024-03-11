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
import { WallpaperMenu } from "../../component/menu/WallpaperMenu";

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

    return (
        <div>
            <WallpaperMenu />
            <div >
                <form onSubmit={handleSubmit(saveTexture)}>
                    <div style={{
                        display: "flex",
                        gap:"10px",
                        margin:"20px"
                    }}>
                        <div className="divLabel">
                            <label htmlFor="addTexture">Անվանում</label>
                            <input id="addTexture" type="text" placeholder="Name" {...register("name", { required: true })} />
                        </div>
                        <div className="divLabel">
                            <label htmlFor="addPrice">Գին</label>
                            <input id="addPrice" type="number" placeholder="Price" {...register("price", { required: true })} />
                        </div>
                        <button>Գրանցել</button>
                    </div>
                </form>
                {
                    texture?.arrTexture && texture.arrTexture.length > 0 ?
                        <div style={{ 
                            width: "500px",
                            margin:"20px"
                            }}>
                            <table className="tableName">
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