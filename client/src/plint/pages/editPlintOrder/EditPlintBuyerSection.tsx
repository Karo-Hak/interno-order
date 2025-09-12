import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { PlintBuyerProps } from '../../features/plintBuyer/plintBuyerSlice';
import { useAppDispatch } from '../../../app/hooks';
import { allPlintBuyer } from '../../features/plintBuyer/plintBuyerApi';
import { PlintCoopProps } from '../../features/plintCoop/plintCoopSlice';
import EditPlintCoopSection from './EditPlintCoopSection';

interface EditPlintBuyerSectionProps {
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    orderBuyer: PlintBuyerProps;
    setOrderBuyer: (value: PlintBuyerProps) => void;
    orderCoop:PlintCoopProps
}

const EditPlintBuyerSection: React.FC<EditPlintBuyerSectionProps> = ({ register, setValue, orderBuyer, setOrderBuyer, orderCoop }: EditPlintBuyerSectionProps) => {
    const dispatch = useAppDispatch();
    const [checkedBuyer, setCheckedBuyer] = useState(false);
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const [plintBuyer, setPlintBuyer] = useState<PlintBuyerProps[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const buyerResult = await dispatch(allPlintBuyer(cookies)).unwrap();
                handleResult(buyerResult);
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
            if (result.buyer) {
                setPlintBuyer(result.buyer);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setValue('phone1', orderBuyer.phone1)
        setValue('phone2', orderBuyer.phone2)
        setValue('region', orderBuyer.region)
        setValue('address', orderBuyer.address)
        setValue('name', orderBuyer.name)
    }, [orderBuyer])

    function handleCheckboxBuyer(event: any) {
        setCheckedBuyer(event.target.checked);
    }
    useEffect(() => {
        if (checkedBuyer === false) {
            setValue("buyerId", false)
        }
    }, [checkedBuyer])


    function selectedBuyer(buyer: React.ChangeEvent<HTMLSelectElement>) {
        if (buyer.target.value) {
            const selectedBuyer = plintBuyer.find((element: PlintBuyerProps) => element._id === buyer.target.value);
            if (selectedBuyer) {
                setValue('phone1', selectedBuyer.phone1)
                setValue('phone2', selectedBuyer.phone2)
                setValue('region', selectedBuyer.region)
                setValue('address', selectedBuyer.address)
                setValue('name', selectedBuyer.name)
            }
        }
    }


    return (
        <div >
            <table className='buyerSectionName'>
                <thead>
                    <tr style={{ background: "#dfdce0" }}>
                        <th>Անուն Ազգանուն/ <input id="buyerCheckbox" type="checkbox" onChange={handleCheckboxBuyer} /></th>
                        <th>Գործընկեր</th>
                        <th>Մարզ</th>
                        <th>Հասցե</th>
                        <th>Հեռախես</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>

                        <td>
                            {!checkedBuyer ? (
                                <input id="buyerName" type="text" placeholder=" Buyer Name" {...register('name', { required: true })} />
                            ) : (
                                <select id="buyerId" {...register('buyerId', { required: true })} onChange={(event) => selectedBuyer(event)}>
                                    {plintBuyer && plintBuyer.length > 0 ? (
                                        plintBuyer.map((e: any) => {
                                            return (
                                                <option key={e._id} value={e._id}>
                                                    {e.name}
                                                </option>
                                            );
                                        })
                                    ) : null}
                                </select>
                            )}
                        </td>
                        {
                            
                        }
                        <td>
                            <EditPlintCoopSection register={register} setValue={setValue} orderCoop={orderCoop} />
                        </td>
                        <td>
                            <input id="buyerRegion" type="text" placeholder="Region" {...register('region', { required: true })} />
                        </td>
                        <td>
                            <input style={{ width: "300px" }} id="buyerAddress" type="text" placeholder="Address" {...register('address', { required: true })} />
                        </td>
                        <td>
                            <div className='buyerPhone1_2'>
                                <input id="buyerPhone1" type="string" placeholder="Phone"  {...register('phone1', { required: true })} />
                                <input id="buyerPhone2" type="string" placeholder="Phone"  {...register('phone2')} />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EditPlintBuyerSection;
