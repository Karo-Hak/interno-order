import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { PlintMenu } from "../../../component/menu/PlintMenu";
import { viewNewPlintOrder, viewPlintOrdersList } from "../../features/plintOrder/plintOrderApi";

export const PlintHonePage: React.FC = (): JSX.Element => {
    const user = useAppSelector(selectUser);
    const [plint, setPlint] = useState([])

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const plintResult = await dispatch(viewNewPlintOrder(cookies)).unwrap();
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

    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} - ${dateObj.getMonth() + 1} - ${dateObj.getFullYear()} `;
    }

    function viewOrder(id: any) {
        window.open('/plint/viewPlintOrder/' + id, '_blank');
    }
console.log(plint);


    return (
        <>
            <PlintMenu />
            <div>
                {
                    plint.length > 0 ?
                        <div>
                            <div className='newStretchOrderSection_head'>
                                <div className='newStretchOrderSection_head_name'>
                                    Շրիշակ
                                </div>
                            </div>

                            <div className=''>
                                <div className=''>

                                    <table className="newStretchOrders" >
                                        <thead >
                                            <tr className=' back_color' >
                                                <th style={{ width: "30px" }}>Կոդ </th>
                                                <th>Գրնցման/ԱԱ</th>
                                                <th>Անուն Ազգանուն</th>
                                                <th>Հասցե</th>
                                                <th>Հեռախոս</th>
                                                <th>Գումար</th>
                                                <th>Կանխավճար</th>
                                                <th>Մնացորդ</th>
                                                <th>Դիտել</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                plint.map((e: any) => {
                                                    return (
                                                        <tr key={e._id}>
                                                            <td>
                                                                <p
                                                                    style={{
                                                                        width: "40px",
                                                                    }}>
                                                                    {e.code}
                                                                </p>
                                                            </td>
                                                            <td >
                                                                <p
                                                                    style={{
                                                                        width: "130px"
                                                                    }}>
                                                                    {parseDate(e.date)}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <p
                                                                    style={{
                                                                        minWidth: "160px"
                                                                    }}>
                                                                    {e.buyer.name}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <p>
                                                                {e.buyer.region}  {e.buyer.address}
                                                                </p>
                                                            </td>
                                                            <td >
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        border: "none",
                                                                        gap: "5px",
                                                                        width: "215px"
                                                                    }}>
                                                                    <p
                                                                        style={{
                                                                            minWidth: "100px"
                                                                        }}>
                                                                        {e.buyer.phone1}
                                                                    </p>
                                                                    <p
                                                                        style={{
                                                                            minWidth: "100px"
                                                                        }}>
                                                                        {
                                                                            e.buyer.phone2 ?
                                                                                e.buyer.phone2
                                                                                : " ---------"
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td >
                                                                <p
                                                                    style={{
                                                                        minWidth: "80px"
                                                                    }}>
                                                                    {e.balance}
                                                                </p>
                                                            </td>
                                                            <td >
                                                                <p
                                                                    style={{
                                                                        minWidth: "80px"
                                                                    }}>{e.prepayment}</p>
                                                            </td>
                                                            <td >
                                                                <p
                                                                    style={{
                                                                        minWidth: "80px"
                                                                    }}>
                                                                    {e.groundTotal}
                                                                </p>
                                                            </td>
                                                            <td >
                                                                <button
                                                                    onClick={() => viewOrder(e._id)}
                                                                >
                                                                    Ավելին
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> : null
                }
            </div>
        </>
    );
}
