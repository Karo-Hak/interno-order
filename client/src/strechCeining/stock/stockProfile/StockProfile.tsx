import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { getAllProduct } from "../../features/product/productApi";
import { getAllCategory } from "../../features/category/categoryApi";
import { selectProduct } from "../../features/product/productSlice";
import { selectCategory } from "../../features/category/categorySlice";
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/user/userSlice';
import { userProfile } from '../../../features/user/userApi';
import './stockProfile.css'
import { StockMenu } from '../../../component/menu/StockMenu';


export const StockProfile: React.FC = (): JSX.Element => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })

        dispatch(getAllCategory(cookies)).then((resultAction) => {
            const result = resultAction.payload;
            if ("error" in result) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        });

    }, [])

    const category = useAppSelector(selectCategory);

    return (<div style={{
        width: "100%"
    }}>
        <StockMenu />
        {
            category?.arrCategory && category.arrCategory.length > 0 ? (
                <div style={{
                    display: "flex",
                    width: "100%"
                }}>
                    {category.arrCategory.map((e: any, index: number) => (
                        <div key={e._id} style={{
                            width: "100%",
                            margin: "10px",
                            border: "2px solid black",
                            padding: "5px",
                            textAlign: "center"
                        }} >
                            <h6 >
                                {e.name}
                            </h6>
                            <table className='buyerSectionName'>
                                <thead>
                                    <tr>
                                        <th >Name</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                {e.product.map((productItem: any, i: number) => (
                                    <tbody key={productItem._id}>
                                        <tr>
                                            <td >{productItem.name}</td>
                                            <td>{productItem.quantity}</td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    ))}
                </div>
            ) : null
        }


    </div>);
}

