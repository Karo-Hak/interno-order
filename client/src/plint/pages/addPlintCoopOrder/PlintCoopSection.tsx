import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { PlintCoopProps } from '../../features/plintCoop/plintCoopSlice';
import { allPlintCoop } from '../../features/plintCoop/plintCoopApi';
import PlintAgentSection from './plintAgentSection';

const PlintCoopSection: React.FC<any> = ({ register, setValue }: any) => {
    const dispatch = useAppDispatch();
    const [checkedBuyer, setCheckedBuyer] = useState(false);
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const [plintCoop, setPlintCoop] = useState<PlintCoopProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coopResult = await dispatch(allPlintCoop(cookies)).unwrap();
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
            if (result.plintCoop) {
                setPlintCoop(result.plintCoop);
            }
        };

        fetchData();
    }, [cookies, dispatch, navigate, setCookie]);


    useEffect(() => {
        if (checkedBuyer === false) {
            setValue("buyerId", false)
        }
    }, [checkedBuyer])


    function selectedBuyer(buyer: React.ChangeEvent<HTMLSelectElement>) {
        if (buyer.target.value) {
            const selectedBuyer = plintCoop.find((element: PlintCoopProps) => element._id === buyer.target.value);

            if (selectedBuyer) {
                setValue('phone1', selectedBuyer.phone1)
                setValue('phone2', selectedBuyer.phone2)
                setValue('region', selectedBuyer.region)
                setValue('address', selectedBuyer.address)
                setValue('name', selectedBuyer.name)
            }
        }
    }

console.log(plintCoop);

    return (
        <div >
            <table className='buyerSectionName'>
                <thead>
                    <tr style={{ background: "#dfdce0" }}>
                        <th>Անուն Ազգանուն</th>
                        <th>Միջնորդ</th>
                        <th>Մարզ</th>
                        <th>Հասցե</th>
                        <th>Հեռախես</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>

                        <td>
                            <select id="selectPlint" {...register('buyerId', { required: true })} onChange={(event) => selectedBuyer(event)}>
                                <option>Ընտրել Գործընկեր</option>
                                {plintCoop && plintCoop.length > 0 ? (
                                    plintCoop.map((e: any) => {
                                        return (
                                            <option key={e._id} value={e._id}>
                                                {e.name}
                                            </option>
                                        );
                                    })
                                ) : null}
                            </select>
                        </td>
                        <td>
                            <PlintAgentSection register={register} setValue={setValue}/>
                        </td>
                        <td>
                            <input id="buyerRegion" type="text" placeholder=" Buyer Region" {...register('region', { required: true })} />
                        </td>
                        <td>
                            <input style={{ width: "300px" }} id="buyerAddress" type="text" placeholder="Buyer Address" {...register('address', { required: true })} />
                        </td>
                        <td>
                            <div className='buyerPhone1_2'>
                                <input id="buyerPhone1" type="string" placeholder=" Buyer Phone" name="buyerPhone"  {...register('phone1', { required: true })} />
                                <input id="buyerPhone2" type="string" placeholder=" Buyer Phone" name="buyerPhone"  {...register('phone2')} />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PlintCoopSection;
