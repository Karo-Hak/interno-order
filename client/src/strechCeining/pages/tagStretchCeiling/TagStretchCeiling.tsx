import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ChangeEvent, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './tagStrechCeiling.css'
import NewStretchOrderSection from "./NewStretchOrderSection";

export const TagStretchCeiling: React.FC = (): JSX.Element => {
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

    const tagStretchBuyer = () => {
        window.open("/tagstretchceiling/addTagStretchBuyer")
    }
    function goTo(event: ChangeEvent<HTMLSelectElement>): void {
        window.open(event.target.value)

    }
    const newTagStretchOrder = () => {
        window.open("/stretchceiling/addTagStretchOrder")
    }
    return (
        <>
            <div className="admin_profile_Strech">
                <div >
                    <button className="btn" onClick={newTagStretchOrder} >Նոր Պատվեր</button>
                    <select onChange={(e) => goTo(e)} className="btn" style={{ height: "35px" }}>
                        <option>Ապրանք</option>
                        <option value={"/stretchTexture"}>Ձգվող Առաստաղ</option>
                        <option value={"/stretchceiling/addStretchBardutyun"}>Բարդություն</option>
                        <option value={"/stretchceiling/addStretchProfil"}>Պրոֆիլ</option>
                        <option value={"/stretchceiling/addStretchLightPlatform"}>Լույսի Պլատֆորմ</option>
                        <option value={"/stretchceiling/addStretchLightRing"}>Լույսի Օղակ</option>
                        <option value={"/stretchceiling/addStretchAdditional"}>Լռացուցիչ</option>
                    </select>
                    <button className="btn" onClick={tagStretchBuyer}>Ավելացնել Գնորդ</button>
                    <button className="btn">Դիտել Պատվերները</button>
                </div>
            </div>
            <div className="newStretchOrderSection">
                <NewStretchOrderSection />
            </div>
        </>
    );
}

