import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../app/hooks';
import { CoopStretchBuyerProps } from '../../features/coopStrechBuyer/coopStrechBuyerSlice';
import { allCoopStretchBuyer } from '../../features/coopStrechBuyer/coopStrechBuyerApi';

const CoopBuyerSection: React.FC<any> = ({ register, setValue }: any) => {
    const dispatch = useAppDispatch();
    const [checkedBuyer, setCheckedBuyer] = useState(false);
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const [coopBuyer, setCoopBuyer] = useState<CoopStretchBuyerProps[]>([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const buyerResult = await dispatch(allCoopStretchBuyer(cookies)).unwrap();
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
            if (result.coopBuyer) {
                setCoopBuyer(result.coopBuyer);
            }
        };

        fetchData();
    }, []);

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
            const selectedBuyer = coopBuyer.find((element: CoopStretchBuyerProps) => element._id === buyer.target.value);
            
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
                                <select id="selectCoop" {...register('buyerId', { required: true })} onChange={(event) => selectedBuyer(event)}>
                                    {coopBuyer && coopBuyer.length > 0 ? (
                                        coopBuyer.map((e: any) => {
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

export default CoopBuyerSection;
