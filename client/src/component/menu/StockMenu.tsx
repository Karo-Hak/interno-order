import { useNavigate } from "react-router-dom"
import { selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { userProfile } from "../../features/user/userApi";
import { useCookies } from 'react-cookie'
import { useEffect } from "react";


interface StockMenuProps {

}

export const StockMenu: React.FC<StockMenuProps> = (): JSX.Element => {
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })


    }, [])


    const btnHome = () => {
        navigate("/stock")
    }
    const btnAddCategoryProduct = () => {
        navigate("/addCategory")
    }
    const btnAddProduct = () => {
        navigate("/addProduct")
    }
    const btnIn_out = () => {
        navigate("/in_out")
    }

    return (
        <div className="admin_profile">
           <div className="admin_profile">
                            <button className="btn nav-link" onClick={btnHome}>Գլխավոր</button>
                            <button className="btn nav-link" onClick={btnAddCategoryProduct}>Ավելացնել Խումբ</button>
                            <button className="btn nav-link" onClick={btnAddProduct}>Ավելացնել ապրանք</button>
                            <button className="btn nav-link" onClick={btnIn_out}>Մուտք/Ելք</button>
                        </div>

        </div>)
}