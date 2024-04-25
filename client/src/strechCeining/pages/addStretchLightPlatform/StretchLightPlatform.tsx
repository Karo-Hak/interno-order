import { User } from "../../../features/user/userSlice";
import { useAppDispatch } from "../../../app/hooks";
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchLightPlatform.css'
import { StretchLightPlatformProps } from "../../features/strechLightPlatform/strechLightPlatformSlice";
import { useForm } from "react-hook-form";
import { addStretchLightPlatform, getAllStretchLightPlatform } from "../../features/strechLightPlatform/strechLightPlatformApi";
import { StretchMenu } from "../../../component/menu/StretchMenu";

export const StretchLightPlatform: React.FC = (): JSX.Element => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>()
    const [user, setUser] = useState<User>()
    const [stretchLightPlatform, setStretchLightPlatform] = useState<StretchLightPlatformProps[]>([])
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                const stretchProfilResult = await dispatch(getAllStretchLightPlatform(cookies)).unwrap();
                handleResult(userProfileResult);
                handleResult(stretchProfilResult);
            } catch (error) {
                console.error('An error occurred:', error);
            }
        };

        const handleResult = (result: any) => {
            if ('error' in result) {
                console.error(result.error);
                setCookie('access_token', '', { path: '/' });
                navigate('/');
            } else {
                processResult(result);
            }
        };

        const processResult = (result: any) => {
            if (result.user) {
                setUser(result.user);
            }
            if (result.lightPlatform) {
                setStretchLightPlatform(result.lightPlatform);
            }
        };

        fetchData();
    }, []);


    const selectLightPlatformPrice = (event: ChangeEvent<HTMLSelectElement>): void => {
        const selectedId = event.target.value;
        const lightPlatform = stretchLightPlatform.find((e: StretchLightPlatformProps) => e._id === selectedId);
        if (lightPlatform) {
            setValue(`price`, lightPlatform.price);
            setValue(`coopPrice`, lightPlatform.coopPrice);
        } else {
            setValue(`price`, 0);
            setValue(`coopPrice`, 0);
        }
    };

    const newLightPlatform = (stretchLightPlatform: StretchLightPlatformProps) => {
        dispatch(addStretchLightPlatform({ stretchLightPlatform, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }

    return (
        <>
            <StretchMenu />
            <div >
                <form onSubmit={handleSubmit(newLightPlatform)} >
                    <div style={{
                        display: 'flex',
                        margin: "20px",
                        gap: "10px"
                    }}>
                        <div className="divLabel">
                            <label htmlFor="name">Անվանում</label>
                            <select className="select" id="id"
                                {...register("id", { required: true })}
                                onChange={(e) => selectLightPlatformPrice(e)}
                            >
                                <option></option>
                                {
                                    stretchLightPlatform && stretchLightPlatform.length > 0 ?
                                        stretchLightPlatform.map((e: StretchLightPlatformProps) => {
                                            return (
                                                <option key={e._id} value={e._id}>{e.name}</option>
                                            )
                                        })
                                        :
                                        null
                                }
                            </select>
                        </div>
                        <div className="divLabel">
                            <label htmlFor="price">Գին</label>
                            <input id="price" type="number" placeholder="Price"  {...register("price", { required: true })} />
                        </div>
                        <div className="divLabel">
                            <label htmlFor="coopPrice">Համ․ Գին</label>
                            <input id="copPrice" type="number" placeholder="Coop Price"  {...register("coopPrice", { required: true })} />
                        </div>
                        <button>Գրանցել</button>
                    </div>
                </form>
                {
                    stretchLightPlatform && stretchLightPlatform.length > 0 ?
                        <div style={{
                            margin: "20px",
                            width: "500px"
                        }}>
                            <table className="tableName">
                                <thead>
                                    <tr>
                                        <th scope="col">Անվանում</th>
                                        <th scope="col">Գին</th>
                                        <th scope="col">Համ․ Գին</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        stretchLightPlatform.map((e: StretchLightPlatformProps) => {
                                            return (
                                                <tr key={e._id}>
                                                    <td>{e.name}</td>
                                                    <td>{e.price}</td>
                                                    <td>{e.coopPrice}</td>
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

