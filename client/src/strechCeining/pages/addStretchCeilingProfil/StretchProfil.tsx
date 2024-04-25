import { User, selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './stretchProfil.css'
import { StretchProfilProps, selectStretchProfil } from "../../features/strechProfil/strechProfilSlice";
import { getAllUnyt } from "../../unyt/unytApi";
import { selectUnyt } from "../../unyt/unytSlice";
import { useForm } from "react-hook-form";
import { addStretchProfil, getAllStretchProfil } from "../../features/strechProfil/strechProfilApi";
import { StretchMenu } from "../../../component/menu/StretchMenu";

export const StretchProfil: React.FC = (): JSX.Element => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>()
    const [user, setUser] = useState<User>()
    const [stretchProfil, setStretchProfil] = useState<StretchProfilProps[]>([])
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                const stretchProfilResult = await dispatch(getAllStretchProfil(cookies)).unwrap();
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
            if (result.stretchProfil) {
                setStretchProfil(result.stretchProfil);
            }
        };

        fetchData();
    }, []);

    const selectProfilPrice = (event: ChangeEvent<HTMLSelectElement>): void => {
        const selectedId = event.target.value;
        const profil = stretchProfil.find((e: StretchProfilProps) => e._id === selectedId);
        if (profil) {
            setValue(`price`, profil.price);
            setValue(`coopPrice`, profil.coopPrice);
        } else {
            setValue(`price`, 0);
            setValue(`coopPrice`, 0);
        }
    };

    const newStretchProfil = (stretchProfil: StretchProfilProps) => {
        dispatch(addStretchProfil({ stretchProfil, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
    }

    return (
        <>
            <StretchMenu />
            <div>
                <form onSubmit={handleSubmit(newStretchProfil)} >
                    <div style={{
                        display: "flex",
                        margin: "20px",
                        gap: "10px"
                    }}>
                        <div className="divLabel">
                            <label htmlFor="id">Անվանում</label>
                            <select style={{
                                border: "1px solid black"
                            }}
                                id="id"
                                {...register("id", { required: true })}
                                onChange={(e) => selectProfilPrice(e)}
                            >

                                <option></option>
                                {
                                    stretchProfil && stretchProfil.length > 0 ?
                                        stretchProfil.map((e: StretchProfilProps) => {
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
                    stretchProfil && stretchProfil.length > 0 ?
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
                                        stretchProfil.map((e: StretchProfilProps) => {
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

