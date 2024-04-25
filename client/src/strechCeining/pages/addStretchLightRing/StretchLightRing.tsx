import { User } from "../../../features/user/userSlice";
import { useAppDispatch } from "../../../app/hooks";
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchLightRing.css'
import { StretchLightRingProps, selectStretchLightRing } from "../../features/strechLightRing/strechLightRingSlice";
import { useForm } from "react-hook-form";
import { addStretchLightRing, getAllStretchLightRing } from "../../features/strechLightRing/strechLightRingApi";
import { StretchMenu } from "../../../component/menu/StretchMenu";

export const StretchLightRing: React.FC = (): JSX.Element => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>()
    const [user, setUser] = useState<User>();
    const [stretchLightRing, setStretchLightRing] = useState<StretchLightRingProps[]>([])
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                const stretchLightRingResult = await dispatch(getAllStretchLightRing(cookies)).unwrap();
                handleResult(userProfileResult);
                handleResult(stretchLightRingResult);
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
            if (result.lightRing) {
                setStretchLightRing(result.lightRing);
            }
        };

        fetchData();
    }, []);

    const selectLightRingPrice = (event: ChangeEvent<HTMLSelectElement>): void => {
        const selectedId = event.target.value;
        const lightRing = stretchLightRing.find((e: StretchLightRingProps) => e._id === selectedId);
        if (lightRing) {
            setValue(`price`, lightRing.price);
            setValue(`coopPrice`, lightRing.coopPrice);
        } else {
            setValue(`price`, 0);
            setValue(`coopPrice`, 0);
        }
    };

    const newLightRing = (stretchLightRing: StretchLightRingProps) => {
        dispatch(addStretchLightRing({ stretchLightRing, cookies })).unwrap().then(res => {
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
                <form onSubmit={handleSubmit(newLightRing)} >
                    <div style={{
                        display: 'flex',
                        margin: "20px",
                        gap: "10px"
                    }}>
                        <div className="divLabel">
                            <label htmlFor="id">Անվանում/Մ</label>
                            <select className="select" id="id"
                                {...register("id", { required: true })}
                                onChange={(e) => selectLightRingPrice(e)}
                            >
                                <option></option>
                                {
                                    stretchLightRing && stretchLightRing.length > 0 ?
                                        stretchLightRing.map((e: StretchLightRingProps) => {
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
                            <input id="coopPrice" type="number" placeholder="Coop Price"  {...register("coopPrice", { required: true })} />
                        </div>
                        <button>Գրանցել</button>
                    </div>
                </form>
                {
                    stretchLightRing && stretchLightRing.length > 0 ?
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
                                        stretchLightRing.map((e: StretchLightRingProps) => {
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

