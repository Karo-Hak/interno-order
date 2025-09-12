import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { PlintMenu } from "../../../component/menu/PlintMenu";
import { addNewPlint, getAllPlint, updatePlintPrice } from "../../features/plint/plintApi";
import { PlintProps } from "../../features/plint/plintSlice";
import { useForm } from "react-hook-form";


export const AddPlint: React.FC = (): JSX.Element => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>()

    const user = useAppSelector(selectUser);
    const [plint, setPlint] = useState([])
    const [selectedPlint, setSelectedPlint] = useState()
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const [checkedPlint, setCheckedPlint] = useState(false);



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

    const updatePlint = (plint: PlintProps) => {
        if (checkedPlint) {
            const updatedPlint = {
                ...plint,
                _id: plint._id,
            };

            dispatch(updatePlintPrice({ plint: updatedPlint, cookies })).unwrap().then(res => {
                if ("error" in res) {
                    alert(res.error);
                }
            });
            window.location.reload();
        } else {
            dispatch(addNewPlint({ plint, cookies })).unwrap().then(res => {
                if ("error" in res) {
                    alert(res.error);
                }
            });
            window.location.reload();
        }
    };



    function handleCheckboxBuyer(event: any) {
        setCheckedPlint(event.target.checked);
    }


    function selectedPlintPrice(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedId = event.target.value;

        if (selectedId && plint) {
            const foundPlint = plint.find((element: PlintProps) => element._id === selectedId) as PlintProps | undefined;

            if (foundPlint) {
                setValue('_id', selectedId);
                setValue('name', foundPlint.name);
                setValue('price1', foundPlint.price1);
                setValue('price2', foundPlint.price2);
                setValue('quantity', foundPlint.quantity);
            }
        }
    }


    return (
        <>
            <PlintMenu />
            <div>
                <form onSubmit={handleSubmit(updatePlint)} >
                    <div style={{
                        display: "flex",
                        margin: "20px",
                        gap: "10px"
                    }}>

                        <div className="divLabel">
                            <label htmlFor="name">Թարմացնել գինը</label>
                            <input id="Checkbox" type="checkbox" onChange={handleCheckboxBuyer} />
                        </div>

                        <div className="divLabel">
                            <label htmlFor="name">Անվանում</label>
                            {!checkedPlint ? (
                                <input id="name" type="text" placeholder="Name"  {...register("name", { required: true })} />
                            ) : (
                                <select id="selectPlint" {...register('_id', { required: true })} onChange={(event) => selectedPlintPrice(event)}>
                                    <option>Ընտրել ապրանք</option>
                                    {plint && plint.length > 0 ? (
                                        plint.map((e: any) => {
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
                            <label htmlFor="price1">Մանրածախ Գին</label>
                            <input id="price1" type="text" placeholder="Price1"  {...register("price1", { required: true })} />
                        </div>
                        <div className="divLabel">
                            <label htmlFor="price2">Մեծածախ Գին</label>
                            <input id="price2" type="text" placeholder="Price2"  {...register("price2", { required: true })} />
                        </div>
                        {
                            !checkedPlint ?
                                <div className="divLabel">
                                    <label htmlFor="quantity">Քանակ</label>
                                    <input id="quantity" type="text" placeholder="Quantity"  {...register("quantity", { required: true })} />
                                </div>
                                :
                                null

                        }
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
                                        <th scope="col">Մանրածախ Գին</th>
                                        <th scope="col">Մեծածախ Գին</th>
                                        <th scope="col">Համ․ Գին</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        plint.map((e: PlintProps) => {
                                            return (
                                                <tr key={e._id}>
                                                    <td>{e.name}</td>
                                                    <td>{e.price1}</td>
                                                    <td>{e.price2}</td>
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
