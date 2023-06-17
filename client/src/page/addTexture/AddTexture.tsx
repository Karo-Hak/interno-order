import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAllTexture, newTexture } from "../../features/texture/textureApi";
import { Texture, selectTexture } from "../../features/texture/textureSlice";
import "./addTexture.css"

export const AddTexture: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        texture.arrTexture.map((e: Texture) => {
                                            return (
                                                <tr key={e._id}>
                                                    <td>{e.name}</td>
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