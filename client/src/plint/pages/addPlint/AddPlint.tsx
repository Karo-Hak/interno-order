import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { PlintMenu } from "../../../component/menu/PlintMenu";
import { addNewPlint, getAllPlint } from "../../features/plint/plintApi";
import { PlintProps } from "../../features/plint/plintSlice";
import { useForm } from "react-hook-form";

export const AddPlint: React.FC = (): JSX.Element => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>()

    const user = useAppSelector(selectUser);
    const [plint, setPlint] = useState([])

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const plintResult = await dispatch(getAllPlint(cookies)).unwrap();
                handleResult(plintResult);
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
            if (result.plint) {
                setPlint(result.plint);
            }
        };

        fetchData();
    }, []);

    const newPlint = (plint: PlintProps) => {
        dispatch(addNewPlint({ plint, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }


    return (
        <>
            <PlintMenu />
            <div>
                <form onSubmit={handleSubmit(newPlint)} >
                    <div style={{
                        display: "flex",
                        margin: "20px",
                        gap: "10px"
                    }}>

                        <div className="divLabel">
                            <label htmlFor="name">Անվանում</label>
                            <input id="name" type="text" placeholder="Name"  {...register("name", { required: true })} />
                        </div>
                        <div className="divLabel">
                            <label htmlFor="price">Գին</label>
                            <input id="price" type="text" placeholder="Price"  {...register("price", { required: true })} />
                        </div>
                        <div className="divLabel">
                            <label htmlFor="quantity">Քանակ</label>
                            <input id="quantity" type="text" placeholder="Quantity"  {...register("quantity", { required: true })} />
                        </div>
                        <button>Գրանցել</button>
                    </div>
                </form>
                {
                    plint && plint.length > 0 ?
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
                                        plint.map((e: PlintProps) => {
                                            return (
                                                <tr key={e._id}>
                                                    <td>{e.name}</td>
                                                    <td>{e.price}</td>
                                                    <td>{e.quantity}</td>
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
