import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { userProfile } from '../../../features/user/userApi';
import './stretchTexture.css';
import { StretchTextureProps } from '../../features/strechTexture/strechTextureSlice';
import { User } from '../../../features/user/userSlice';
import { getAllStretchTexture, addStretchTexture, updateStretchTexture } from '../../features/strechTexture/strechTextureApi';
import { StockMenu } from '../../../component/menu/StockMenu';



export const StretchTexture: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<any>();
    const [user, setUser] = useState<User>();
    const [stretchTexture, setStretchTexture] = useState<StretchTextureProps[]>([]);
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const [checkedTexture, setCheckedTexture] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                const stretchTextureResult = await dispatch(getAllStretchTexture(cookies)).unwrap();

                handleResult(userProfileResult);
                handleResult(stretchTextureResult);
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
            if (result.stretchTexture) {
                setStretchTexture(result.stretchTexture);
            }
        };

        fetchData();
    }, []);


    function handleCheckboxTexture(event: any) {
        setCheckedTexture(event.target.checked);
    }
    useEffect(() => {
        if (checkedTexture === false) {
            reset()
        }
    }, [checkedTexture])

    const newStretchTexture = (stretchTexture: object) => {
        if (!checkedTexture) {
            dispatch(addStretchTexture({ stretchTexture, cookies })).unwrap().then(res => {
                if ("error" in res) {
                    alert(res.error)
                }
            });
        } else {
            dispatch(updateStretchTexture({ stretchTexture, cookies })).unwrap().then(res => {
                if ("error" in res) {
                    alert(res.error)
                }
            });
        }
        window.location.reload()
    }

    const selectedTexture = (texture: React.ChangeEvent<HTMLSelectElement>) => {
        if (texture.target.value) {
            const selectedTexture = stretchTexture.find((element: StretchTextureProps) => element._id === texture.target.value);
            if (selectedTexture) {
                setValue("name", selectedTexture.name);
                setValue("width", selectedTexture.width);
                setValue("price", selectedTexture.price);
                setValue("coopPrice", selectedTexture.coopPrice);
                // setValue("priceCoopOtrez", selectedTexture.priceCoopOtrez);
            }
        }
    }



    return (
        <>
            <StockMenu />
            <div style={{
                margin: "20px"
            }}>

                <form onSubmit={handleSubmit(newStretchTexture)} >
                    <div style={{
                        display: "flex",
                        gap: "10px"
                    }}>
                        <div className="divLabel">
                            <label htmlFor="name">
                                Անվանում_
                                <input id="buyerCheckbox" type="checkbox" onChange={handleCheckboxTexture} />
                                _Փոփոխել
                            </label>

                            {!checkedTexture ? (
                                <input id="name" type="text" placeholder="Name"  {...register("name", { required: true })} />
                            ) : (
                                <select
                                    style={{ border: "1px solid black" }}
                                    id="selectCoop"
                                    {...register('_id', { required: true })}
                                    onChange={(event) => selectedTexture(event)}>
                                    <option></option>
                                    {stretchTexture && stretchTexture.length > 0 ? (
                                        stretchTexture.map((e: any) => {
                                            return (
                                                <option key={e._id} value={e._id}>
                                                    {e.name}
                                                </option>
                                            );
                                        })
                                    ) : null}
                                </select>
                            )}
                        </div>
                        <div className="divLabel">
                            <label htmlFor="weight">Լայնություն</label>
                            <input id="weight" type="number" placeholder="Weight"  {...register("width", { required: true })} />
                        </div>

                        <div className="divLabel">
                            <label htmlFor="price">Գին</label>
                            <input id="price" type="number" placeholder="Price"  {...register("price", { required: true })} />
                        </div>

                        <div className="divLabel">
                            <label htmlFor="coopPrice">Համ․ Գին Գարպուն</label>
                            <input id="coopPrice" type="number" placeholder="Price Garpun"  {...register("coopPrice", { required: true })} />
                        </div>
                        {/* <div className="divLabel">
                            <label htmlFor="priceCoopOtrez">Համ․ Գին Կտրվածք</label>
                            <input id="priceCoopOtrez" type="number" placeholder="Price Otrez"  {...register("priceCoopOtrez", { required: true })} />
                        </div> */}
                        <button >Գրանցել</button>
                    </div>
                </form>

                {
                    stretchTexture && stretchTexture.length > 0 ?
                        <div style={{
                            margin: "20px"
                        }}>
                            <table className="tableName" >
                                <thead>
                                    <tr>
                                        <th scope="col">Անվանում</th>
                                        <th scope="col">Լայնություն</th>
                                        <th scope="col">Գին</th>
                                        <th scope="col">Համ Գին</th>
                                        {/* <th scope="col">Համ Գին Ատրեզ</th> */}

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        stretchTexture.map((e: any) => {
                                            return (
                                                <tr key={e._id}>
                                                    <td>{e.name}</td>
                                                    <td>{e.weight}</td>
                                                    <td>{e.price}</td>
                                                    <td>{e.coopPrice}</td>
                                                    {/* <td>{e.priceCoopOtrez}</td> */}
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

