import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ChangeEvent, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './coopStrechCeiling.css'

export const CoopStretchCeiling: React.FC = (): JSX.Element => {
    const user = useAppSelector(selectUser);

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })

    }, [])

    const coopStretchBuyer = () => {
        window.open("/coopstretchceiling/addCoopStretchBuyer")
    }
    function goTo(event: ChangeEvent<HTMLSelectElement>): void {
        window.open(event.target.value)

    }
    const newCoopStretchOrder = () => {
        window.open("/coopStretchceiling/addCoopStretchOrder")
    }
    return (
        <>
            <div className="profile">
                <div className="divBtn">
                    <button className="btn" onClick={newCoopStretchOrder} >Նոր Պատվեր</button>
                    <select onChange={(e) => goTo(e)} className="btn selectCoop form-control">
                        <option>Ապրանք</option>
                        <option value={"/stretchTexture"}>Ձգվող Առաստաղ</option>
                        <option value={"/stretchceiling/addStretchBardutyun"}>Բարդություն</option>
                        <option value={"/stretchceiling/addStretchProfil"}>Պրոֆիլ</option>
                        <option value={"/stretchceiling/addStretchLightPlatform"}>Լույսի Պլատֆորմ</option>
                        <option value={"/stretchceiling/addStretchLightRing"}>Լույսի Օղակ</option>
                    </select>
                    <button className="btn" onClick={coopStretchBuyer}>Ավելացնել Գործընկեր</button>
                    <button className="btn">Դիտել Պատվերները</button>
                </div>
            </div>
            <div className="divBtn">
            </div>
        </>
    );
}

