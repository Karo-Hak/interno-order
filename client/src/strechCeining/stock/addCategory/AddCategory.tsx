import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./addCategory.css"
import { selectCategory } from "../../features/category/categorySlice";
import { addCategory, getAllCategory } from "../../features/category/categoryApi";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { StockMenu } from "../../../component/menu/StockMenu";

export const AddCategory: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['access_token']);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()

    useEffect(() => {
        dispatch(getAllCategory(cookies)).then((resultAction) => {
            const result = resultAction.payload;
            if ("error" in result) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        });
    }, []);

    const category = useAppSelector(selectCategory);


    const saveCategory = (category: any) => {
        dispatch(addCategory({ category, cookies })).then((resultAction) => {
            const result = resultAction.payload;
            if ("error" in result) {
                alert(result.error);
            }
        });
        window.location.reload();
    }


    return (<>
        <StockMenu />
        <div style={{
            display: 'flex',
            padding: "50px",
            gap: '50px'
        }}>
            <form className="formCat" onSubmit={handleSubmit(saveCategory)}>
                <div>
                    <input id="addCategory" type="text" placeholder="Name" {...register("name", { required: true })} />
                    <button>Գրանցել</button>
                </div>
            </form>
            {
                category?.arrCategory && category.arrCategory.length > 0 ? (
                    <div >
                        {category.arrCategory.map((e: any, index: number) => (
                            <div key={e._id} >
                                <h6 className="catName">
                                    {e.name}
                                </h6>
                            </div>
                        ))}
                    </div>
                ) : null
            }
        </div>
    </>)
}