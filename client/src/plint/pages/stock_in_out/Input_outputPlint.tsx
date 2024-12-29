import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { PlintMenu } from "../../../component/menu/PlintMenu";
import { getAllPlint, updatePlint } from "../../features/plint/plintApi";
import { useForm } from "react-hook-form";

export const InputOutputPlint: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const [plint, setPlint] = useState([])
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()


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

    const save = (data: any) => {
        const filteredData = Object.entries(data)
            .filter(([key, value]) => value !== "" && !isNaN(Number(value)))
            .reduce((acc, [key, value]) => {
                acc[key] = parseFloat(value as string);
                return acc;
            }, {} as any);

        dispatch(updatePlint({ filteredData, cookies }))
            .unwrap()
            .then((res: { error?: any; message?: string; }) => { 
                if (res.error) { 
                    alert(res.error);
                } else {
                    reset();
                }
            })
            .catch((error) => {
                alert("An unexpected error occurred: " + error.message);
            });
        window.location.reload()

    };



    const third = Math.ceil(plint.length / 3);
    const firstThird = plint.slice(0, third);
    const secondThird = plint.slice(third, third * 2);
    const thirdPart = plint.slice(third * 2);

    return (
        <div style={{ width: "100%" }}>
            <PlintMenu />
            <form onSubmit={handleSubmit(save)} >

                <div className="tables-container1">
                    <table className='table1'>
                        <thead>
                            <tr>
                                <th>Անվանում</th>
                                <th>Քանակ</th>
                                <th>Իր․ քանակ</th>
                            </tr>
                        </thead>
                        {firstThird.map((productItem: any) => (
                            <tbody key={productItem._id}>
                                <tr>
                                    <td>{productItem.name}</td>
                                    <td>{productItem.quantity}</td>
                                    <td>
                                        <input id={`quantity${productItem._id}`} placeholder="quantity"  {...register(productItem._id)} />
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>

                    <table className='table1'>
                        <thead>
                            <tr>
                                <th>Անվանում</th>
                                <th>Քանակ</th>
                                <th>Իր․ քանակ</th>
                            </tr>
                        </thead>
                        {secondThird.map((productItem: any) => (
                            <tbody key={productItem._id}>
                                <tr>
                                    <td>{productItem.name}</td>
                                    <td>{productItem.quantity}</td>
                                    <td>
                                        <input id={`quantity${productItem._id}`} placeholder="quantity"  {...register(productItem._id)} />
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>

                    <table className='table1'>
                        <thead>
                            <tr>
                                <th>Անվանում</th>
                                <th>Քանակ</th>
                                <th>Իր․ քանակ</th>
                            </tr>
                        </thead>
                        {thirdPart.map((productItem: any) => (
                            <tbody key={productItem._id}>
                                <tr>
                                    <td>{productItem.name}</td>
                                    <td>{productItem.quantity}</td>
                                    <td>
                                        <input id={`quantity${productItem._id}`} placeholder="quantity"  {...register(productItem._id)} />
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
                <div className="addStrerchBuyer_info_section">
                    <button className="btn btn1">Գրանցել</button>
                </div>
            </form>
        </div>
    )
}