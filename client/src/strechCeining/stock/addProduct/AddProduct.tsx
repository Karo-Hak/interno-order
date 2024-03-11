import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./addProduct.css"
import { selectCategory } from "../../features/category/categorySlice";
import { getAllCategory } from "../../features/category/categoryApi";
import React from "react";
import { addProduct, getAllProduct } from "../../features/product/productApi";
import { selectProduct } from "../../features/product/productSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { StockMenu } from "../../../component/menu/StockMenu";

export const AddProduct: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['access_token']);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()

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

    const saveProduct = (product: any) => {
        dispatch(addProduct({ product, cookies })).then((resultAction) => {
            const result = resultAction.payload;
            if ("error" in result) {
                alert(result.error);
            }
        });
        window.location.reload();
    }



    return (
        <div style={{
            width: "100%"
        }}>
            <StockMenu />
            <form onSubmit={handleSubmit(saveProduct)}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                    gap: "20px"
                }}>
                <div className="divLabel">
                    <label htmlFor="category">Խումբ</label>
                    <select style={{ border: "1px solid black" }} id="category"  {...register("categoryProduct", { required: true })} >
                        <option></option>
                        {
                            category?.arrCategory && category.arrCategory.length > 0 ?
                                category.arrCategory.map((e: any) => {
                                    return <option key={e._id} value={e._id}
                                    >{e.name}</option>
                                })
                                : null
                        }
                    </select>
                </div>
                <div className="divLabel">
                    <label htmlFor="addProduct">Ապրանք</label>
                    <input id="addProduct" type="text" placeholder="Name" {...register("name", { required: true })} />
                </div>
                <div className="divLabel">
                    <label htmlFor="quantity">Քանակ</label>
                    <input id="quantity" type="text" placeholder="quantity" {...register("quantity")} />
                </div>
                <button >Գրանցել</button>
            </form>
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
                            }}>
                                <h6 >
                                    {e.name}
                                </h6>
                                <div>
                                    <table className='buyerSectionName'>
                                        <thead>
                                            <tr >
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
                            </div>
                        ))}
                    </div>
                ) : null
            }

        </div>
    )
}