import { useNavigate } from "react-router-dom"
import { selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { userProfile } from "../../features/user/userApi";
import { useCookies } from 'react-cookie'
import { ChangeEvent, useEffect } from "react";


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
    const btnBuy = () => {
        navigate("/buyProduct")
    }

    function goTo(event: ChangeEvent<HTMLSelectElement>): void {
        if (event.target.value !== "Ապրանք") {
            navigate(event.target.value)
        }

    }

    return (
        <div className="admin_profile">
            <div className="admin_profile">
                <button className="btn nav-link" onClick={btnHome}>Գլխավոր</button>
                <select onChange={(e) => goTo(e)} className="btn" style={{ height: "35px" }}>
                    <option>Ապրանք</option>
                    <option value={"/stretchTexture"}>Ձգվող Առաստաղ</option>
                    <option value={"/stretchceiling/addStretchBardutyun"}>Բարդություն</option>
                    <option value={"/stretchceiling/addStretchProfil"}>Պրոֆիլ</option>
                    <option value={"/stretchceiling/addStretchLightPlatform"}>Լույսի Պլատֆորմ</option>
                    <option value={"/stretchceiling/addStretchLightRing"}>Լույսի Օղակ</option>
                    <option value={"/stretchceiling/addTagStretchWork"}>Աշխատանք</option>
                    <option value={"/stretchceiling/addStretchAdditional"}>Այլ Ապրանք</option>
                </select>
                <button className="btn nav-link" onClick={btnAddCategoryProduct}>Ավելացնել Խումբ</button>
                <button className="btn nav-link" onClick={btnAddProduct}>Ավելացնել ապրանք</button>
                <button className="btn nav-link" onClick={btnIn_out}>Մուտք/Ելք</button>
                <button className="btn nav-link" onClick={btnBuy}>Գնում</button>
            </div>

        </div>)
}