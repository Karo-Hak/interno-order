import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { PlintAgentProps } from '../../features/plintAgent/plintAgentSlice';
import { allPlintAgent } from '../../features/plintAgent/plintAgentApi';

const PlintAgentSection: React.FC<any> = ({register, setValue  }: any) => {

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const [plintAgent, setPlintAgent] = useState<PlintAgentProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const agentResult = await dispatch(allPlintAgent(cookies)).unwrap();
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
            if (result.plintAgent) {
                setPlintAgent(result.plintAgent);
            }
        };

        fetchData();
    }, [cookies, dispatch, navigate, setCookie]);

    function selectedAgent(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedAgent = plintAgent.find((element: PlintAgentProps) => element._id === event.target.value);
        if (selectedAgent) {
            setValue('agentDiscount', selectedAgent.agentDiscount);
            setValue('plintAgentId', selectedAgent._id);
        }
    }

    return (
        <div>
            <select id="selectAgent" {...register('plintAgentId')} onChange={selectedAgent}>
                <option value=""></option>
                {plintAgent && plintAgent.length > 0
                    ? plintAgent.map((e: PlintAgentProps) => (
                        <option key={e._id} value={e._id}>
                            {e.name}
                        </option>
                    ))
                    : null}
            </select>
        </div>
    );
};

export default PlintAgentSection;
