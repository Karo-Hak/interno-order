import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { useForm } from "react-hook-form";
import { useAppDispatch } from '../../../app/hooks';
import { User } from '../../../features/user/userSlice';
import { userProfile } from '../../../features/user/userApi';
import { newPlintBuyer } from '../../features/plintBuyer/plintBuyerApi';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import { PlintCoopProps } from '../../features/plintCoop/plintCoopSlice';
import { allPlintCoop, newPlintCoop } from '../../features/plintCoop/plintCoopApi';

export const AddPlintCoop: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const [user, setUser] = useState<User>()
    const [plintCoop, setPlintCoop] = useState<PlintCoopProps[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                const coopResult = await dispatch(allPlintCoop(cookies)).unwrap();

                handleResult(userProfileResult);
                handleResult(coopResult);
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
            if (result) {
                console.log(result.plintCoop);
                
                setPlintCoop(result.plintCoop);
            }
        };

        fetchData();
    }, []);


    const addPlintCoop = (plintCoop: object) => {
        dispatch(newPlintCoop({ plintCoop, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }


    return (
        <>

            <PlintMenu />

            <div className="addStretchBuyer_head_name">Gnordi tvyalner</div>

            <form onSubmit={handleSubmit(addPlintCoop)} >
                <div className="addStrerchBuyer_info">

                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="name">Անուն</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            {...register("name", { required: true })} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="discount">Զեղչ</label>
                        <input
                            id="discount"
                            type="text"
                            placeholder="Discount"
                            {...register("discount", { required: true })} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="phone1">Հեռախոս</label>
                        <input
                            id="phone1"
                            type="text"
                            placeholder="Phone"
                            {...register("phone1", { required: true })} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="phone">Հեռախոս</label>
                        <input
                            id="phone2"
                            type="text"
                            placeholder="Phone"
                            {...register("phone2")} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="region">Մարզ</label>
                        <input
                            id="region"
                            type="text"
                            placeholder="Region"
                            {...register("region", { required: true })} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <label htmlFor="address">Հասցե</label>
                        <input
                            id="address"
                            type="text"
                            placeholder="Address"
                            {...register("address", { required: true })} />
                    </div>
                    <div className="addStrerchBuyer_info_section">
                        <button >Գրանցել</button>
                    </div>
                </div>



            </form>
            {
                plintCoop && plintCoop.length > 0 ?
                    <div className="addStretchBuyer_table" >
                        <div className="addStretchBuyer_head_name">Gnordneri cucak</div>

                        <table className="table " >
                            <thead>
                                <tr>
                                    <th scope="col">Անուն</th>
                                    <th scope="col">Զեղչ</th>
                                    <th scope="col">Հեռախոս</th>
                                    <th scope="col">Հեռախոս</th>
                                    <th scope="col">Մարզ</th>
                                    <th scope="col">Հասցե</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    plintCoop.map((e: any) => {
                                        return (
                                            <tr key={e._id}>
                                                <td>{e.name}</td>
                                                <td>{e.discount}</td>
                                                <td>{e.phone1}</td>
                                                <td>{e.phone2}</td>
                                                <td>{e.region}</td>
                                                <td>{e.address}</td>
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

        </>
    );
}

