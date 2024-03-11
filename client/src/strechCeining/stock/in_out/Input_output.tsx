import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { selectCategory } from "../../features/category/categorySlice";
import { getAllCategory } from "../../features/category/categoryApi";
import React from "react";
import { getAllProduct, updateProductsLists } from "../../features/product/productApi";
import { selectProduct } from "../../features/product/productSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { StockMenu } from "../../../component/menu/StockMenu";

export const Input_output: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['access_token']);

    const [updatedProducts, setUpdatedProducts] = useState<any[]>([]);

    useEffect(() => {
        dispatch(getAllProduct(cookies)).then((resultAction) => {
            const result = resultAction.payload;
            if ("error" in result) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        });
        dispatch(getAllCategory(cookies)).then((resultAction) => {
            const result = resultAction.payload;
            if ("error" in result) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        });
    }, []);

    const product = useAppSelector(selectProduct);
    const category = useAppSelector(selectCategory);


    const inputQuantity = (e: number, id: any) => {
        setUpdatedProducts((prevProducts) => {
            const updatedProduct = prevProducts.find((product) => product._id === id) || {};
            return [
                ...prevProducts.filter((product) => product._id !== id),
                { ...updatedProduct, quantityIn: e, _id: id },
            ];
        });
    };
    const outputQuantity = (e: number, id: any) => {
        setUpdatedProducts((prevProducts) => {
            const updatedProduct = prevProducts.find((product) => product._id === id) || {};
            return [
                ...prevProducts.filter((product) => product._id !== id),
                { ...updatedProduct, quantityOut: e, _id: id },
            ];
        });
    };

    const updateProduct = () => {
        const updatedProductList = product.arrProduct.map((p) => ({ ...p }));
        let updatedProductLists: any = []
        updatedProducts.forEach((updatedProduct) => {
            const productIndex = updatedProductList.findIndex((product: any) => product._id === updatedProduct._id);

            if (updatedProduct.quantityIn !== undefined) {
                updatedProductList[productIndex].quantity = updatedProductList[productIndex].quantity + updatedProduct.quantityIn
            }

            if (updatedProduct.quantityOut !== undefined) {
                updatedProductList[productIndex].quantity = updatedProductList[productIndex].quantity - updatedProduct.quantityOut
            }
            updatedProductLists.push(updatedProductList[productIndex])

        });

        setUpdatedProducts([]);
        dispatch(updateProductsLists({ updatedProductLists, cookies })).then((resultAction) => {
            const result = resultAction.payload;
            if ("error" in result) {
                alert(result.error);
            }
        });

        window.location.reload();

    };


    return (
        <div style={{textAlign:"center"}}>
            <StockMenu />
            {
                category?.arrCategory && category.arrCategory.length > 0 ? (
                    <div style={{
                        display: "flex",
                        width: "100%"
                    }}>
                        {category.arrCategory.map((e: any, index: number) => (
                            <div key={e._id}  style={{
                                width: "100%",
                                margin: "10px",
                                border: "2px solid black",
                                textAlign: "center"
                            }}>
                                <h6>
                                    {e.name}
                                </h6>
                                <div >
                                    <table  className='buyerSectionName'>
                                        <thead >
                                            <tr  >
                                                <th >Անուն</th>
                                                <th >Քանակ</th>
                                                <th>Մուտք</th>
                                                <th>Ելք</th>
                                            </tr>
                                        </thead>
                                        {e.product.map((productItem: any, i: number) => (
                                            <tbody key={i}>
                                                <tr>
                                                    <td >{productItem.name}</td>
                                                    <td >{productItem.quantity}</td>
                                                    <td ><input style={{width:"60px"}}  onChange={(e) => inputQuantity(+e.target.value, productItem._id)} /></td>
                                                    <td ><input style={{width:"60px"}}  onChange={(e) => outputQuantity(+e.target.value, productItem._id)} /></td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null
            }
            <button onClick={updateProduct}>Save</button>
        </div>
    )
}