import { useNavigate } from "react-router-dom"
import { selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser, userProfile } from "../../features/user/userApi";
import { useCookies } from 'react-cookie'
import { ChangeEvent, useEffect } from "react";

interface CoopStretchMenuProps {

}

export const CoopStretchMenu: React.FC<CoopStretchMenuProps> = (): JSX.Element => {
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

    const tagStretchBuyer = () => {
        navigate("/coopStretchceiling/AddCoopStretchBuyer")
    }
    const tagStretchBuyerNewWindow = () => {
        window.open("/coopStretchceiling/AddCoopStretchBuyer")
    }


    function goTo(event: ChangeEvent<HTMLSelectElement>): void {
        if (event.target.value !== "Ապրանք") {
            navigate(event.target.value)
        }

    }
    
    const newTagStretchOrder = () => {
        navigate("/coopStretchceiling/addCoopStretchOrder")
    }
    const newTagStretchOrderNewWindow = () => {
        window.open("/coopStretchceiling/addCoopStretchOrder")
    }

    const home = () => {
        navigate("/coopStretchceiling")
    }
    const viewStretchOrders = () => {
        navigate("/coopStretchceiling/viewCoopStretchOrdersList")
    }
    const viewStretchOrdersNewWindow = () => {
        window.open("/coopStretchceiling/viewCoopStretchOrdersList")
    }
    const viewMaterialsOrders = () => {
        navigate("/coopStretchceiling/coopViewMaterial")
    }
    const viewMaterialsOrdersNewWindow = () => {
        window.open("/coopStretchceiling/coopViewMaterial")
    }
    const viewDebetKredit = () => {
        navigate("/coopStretchceiling/viewCoopDebetKredit")
    }
    const viewDebetKreditNewWindow = () => {
        window.open("/coopStretchceiling/viewCoopDebetKredit")
    }

    return (
        <div className="admin_profile">
            <div style={{
                textAlign: 'left',
                width: "10%"
            }}>
                <button className="btn" onClick={home} >Գլխավոր Էջ</button>
            </div>
            <div className="admin_profile">
                <button className="btn" onClick={newTagStretchOrder} onContextMenu={newTagStretchOrderNewWindow} >Նոր Պատվեր</button>
                {/* <select onChange={(e) => goTo(e)} className="btn" style={{ height: "35px" }}>
                    <option>Ապրանք</option>
                    <option value={"/stretchTexture"}>Ձգվող Առաստաղ</option>
                    <option value={"/stretchceiling/addStretchProfil"}>Պրոֆիլ</option>
                    <option value={"/stretchceiling/addStretchLightPlatform"}>Լույսի Պլատֆորմ</option>
                    <option value={"/stretchceiling/addStretchLightRing"}>Լույսի Օղակ</option>
                </select> */}
                <button className="btn" onClick={tagStretchBuyer} onContextMenu={tagStretchBuyerNewWindow}>Ավելացնել Գնորդ</button>
                <button className="btn" onClick={viewStretchOrders} onContextMenu={viewStretchOrdersNewWindow}>Դիտել Պատվերները</button>
                <button className="btn" onClick={viewMaterialsOrders} onContextMenu={viewMaterialsOrdersNewWindow}>Նյութածախս</button>
                <button className="btn" onClick={viewDebetKredit} onContextMenu={viewDebetKreditNewWindow}>Դեբետ/Կրեդիտ</button>
            </div>
            <div style={{width:"10%"}}></div>
        </div>
    )
}