import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { allPlintCoop } from '../../features/plintCoop/plintCoopApi';
import { PlintCoopProps } from '../../features/plintCoop/plintCoopSlice';

const PlintCoopSection: React.FC<any> = ({ register, setValue }: any) => {
    const dispatch = useAppDispatch();
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

    function selectedCoop(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedCoop = plintCoop.find((element: PlintCoopProps) => element._id === event.target.value);
        if (selectedCoop) {
            setValue('coopDiscount', selectedCoop.coopDiscount);
            setValue('plintcoopId', selectedCoop._id);
        }
    }

    return (
        <div>
            <select id="selectCoop" {...register('plintcoopId')} onChange={selectedCoop}>
                <option value=""></option>
                {plintCoop && plintCoop.length > 0
                    ? plintCoop.map((e: PlintCoopProps) => (
                        <option key={e._id} value={e._id}>
                            {e.name}
                        </option>
                    ))
                    : null}
            </select>
        </div>
    );
};

export default PlintCoopSection;
