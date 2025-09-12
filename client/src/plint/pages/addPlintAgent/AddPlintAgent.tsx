import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { useForm } from "react-hook-form";
import { useAppDispatch } from '../../../app/hooks';
import { User } from '../../../features/user/userSlice';
import { userProfile } from '../../../features/user/userApi';
import { PlintMenu } from '../../../component/menu/PlintMenu';
import { allPlintCoop } from '../../features/plintCoop/plintCoopApi';
import { PlintAgentProps } from '../../features/plintAgent/plintAgentSlice';
import { allPlintAgent, newPlintAgent } from '../../features/plintAgent/plintAgentApi';

export const AddPlintAgent: React.FC = (): JSX.Element => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const [user, setUser] = useState<User>()
    const [plintAgent, setPlintAgent] = useState<PlintAgentProps[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                const agentResult = await dispatch(allPlintAgent(cookies)).unwrap();

                handleResult(userProfileResult);
                handleResult(agentResult);
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
                setPlintAgent(result.plintAgent);
            }
        };

        fetchData();
    }, []);


    const addPlintAgent = (plintAgent: object) => {
        dispatch(newPlintAgent({ plintAgent, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }


    return (
        <>

            <PlintMenu />

            <div className="addStretchBuyer_head_name"> + Միջնորդ</div>

            <form onSubmit={handleSubmit(addPlintAgent)} >
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
                            {...register("agentDiscount", { required: true })} />
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
                plintAgent && plintAgent.length > 0 ?
                    <div className="addStretchBuyer_table" >
                        <div className="addStretchBuyer_head_name">Միջնորդ</div>

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
                                    plintAgent.map((e: any) => {
                                        return (
                                            <tr key={e._id}>
                                                <td>{e.name}</td>
                                                <td>{e.agentDiscount}</td>
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

