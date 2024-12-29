import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { useForm } from "react-hook-form";
import { useAppDispatch } from '../../../app/hooks';
import { User } from '../../../features/user/userSlice';
import { userProfile } from '../../../features/user/userApi';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import { PlintProps } from '../../features/plint/plintSlice';
import { getAllPlint } from '../../features/plint/plintApi';
import './addPlintProduction.css';
import { newPlintProduction } from '../../features/plintProduction/plintProductionApi';

export const PlintProduction: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<any>()
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const [user, setUser] = useState<User>()
    const [plintData, setPlintData] = useState<PlintProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                const plintResult = await dispatch(getAllPlint(cookies)).unwrap();
                handleResult(userProfileResult);
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
            if (result.user) {
                setUser(result.user);
            } else if (result.plint) {
                setPlintData(result.plint);
            }
        };

        fetchData();
    }, []);


    const addPlintProduction = (plintProduction: object) => {
        dispatch(newPlintProduction({ plintProduction, cookies, user })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        // window.location.reload()

    }
    const selectedTexture = (texture: React.ChangeEvent<HTMLSelectElement>) => {
        if (texture.target.value) {
            const selectedTexture = plintData.find((element: PlintProps) => element._id === texture.target.value);
            if (selectedTexture) {
                setValue("name", selectedTexture.name);

            }
        }
    }

    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} - ${dateObj.getMonth() + 1} - ${dateObj.getFullYear()} `;
    }

    return (
        <>

            <PlintMenu />
            <div className="addStretchBuyer_head_name">Շրիշակ Մուտքի փաստաթուղթ</div>
            <form onSubmit={handleSubmit(addPlintProduction)} >
                <div className='divAddProduction'>
                    <div className="divLabel">
                        <label htmlFor="date">Ամսաթիվ</label>
                        <input id="date" type="date" placeholder="date"  {...register("date", { required: true })} />
                    </div>
                    <div className="divLabel">
                        <label htmlFor="weight">Անվանում</label>
                        <select
                            style={{ border: "1px solid black" }}
                            id="selectCoop"
                            {...register('productId', { required: true })}
                            onChange={(event) => selectedTexture(event)}>
                            <option></option>
                            {plintData && plintData.length > 0 ? (
                                plintData.map((e: any) => {
                                    return (
                                        <option key={e._id} value={e._id}>
                                            {e.name}
                                        </option>
                                    );
                                })
                            ) : null}
                        </select>
                    </div>
                    <div className="divLabel">
                        <label htmlFor="weight">Քանակ</label>
                        <input id="quantity" type="number" placeholder="quantity"  {...register("quantity", { required: true })} />
                    </div>
                    <button >Գրանցել</button>
                </div>
            </form>
        </>
    );
}

