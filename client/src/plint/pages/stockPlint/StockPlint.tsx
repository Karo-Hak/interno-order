import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { useAppDispatch } from '../../../app/hooks';
import './stockPlint.css'
import { getAllPlint } from '../../features/plint/plintApi';
import { PlintMenu } from '../../../component/menu/PlintMenu';

export const StockPlint: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const [plint, setPlint] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stockPlintResult = await dispatch(getAllPlint(cookies)).unwrap();
                handleResult(stockPlintResult);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        const handleResult = (result: any) => {
            if ("error" in result) {
                alert(result);
                setCookie("access_token", "", { path: "/" });
                navigate("/");
            } else {
                processResult(result);
            }
        };

        const processResult = (result: any) => {
            if (result.plint) {
                setPlint(result.plint)
            }
        };

        fetchData();
    }, [cookies, dispatch, navigate]);

    const third = Math.ceil(plint.length / 3);
    const firstThird = plint.slice(0, third);
    const secondThird = plint.slice(third, third * 2);
    const thirdPart = plint.slice(third * 2);

    return (
        <div style={{ width: "100%" }}>
            <PlintMenu />
            
            <div className="tables-container1">
                <table className='table1'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    {firstThird.map((productItem: any) => (
                        <tbody key={productItem._id}>
                            <tr>
                                <td>{productItem.name}</td>
                                <td>{productItem.stockBalance}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>

                <table className='table1'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    {secondThird.map((productItem: any) => (
                        <tbody key={productItem._id}>
                            <tr>
                                <td>{productItem.name}</td>
                                <td>{productItem.stockBalance}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>

                <table className='table1'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    {thirdPart.map((productItem: any) => (
                        <tbody key={productItem._id}>
                            <tr>
                                <td>{productItem.name}</td>
                                <td>{productItem.stockBalance}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        </div>
    );
}
