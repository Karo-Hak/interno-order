import { useNavigate } from "react-router-dom"
import { selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser, userProfile } from "../../features/user/userApi";
import { useCookies } from 'react-cookie'
import { ChangeEvent, useEffect } from "react";

interface StretchMenuProps {

}

export const StretchMenu: React.FC<StretchMenuProps> = (): JSX.Element => {
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
        navigate("/tagstretchceiling/addTagStretchBuyer")
    }
    const tagStretchBuyerNewWindow = () => {
        window.open("/tagstretchceiling/addTagStretchBuyer")
    }

    const tagStretchWorker = () => {
        navigate("/tagstretchceiling/addTagStretchWorker")
    }
    const tagStretchWorkerNewWindow = () => {
        window.open("/tagstretchceiling/addTagStretchWorker")
    }

    function goTo(event: ChangeEvent<HTMLSelectElement>): void {
        if (event.target.value !== "Ապրանք") {
            navigate(event.target.value)
        }

    }
    
    const newTagStretchOrder = () => {
        navigate("/stretchceiling/addTagStretchOrder")
    }
    const newTagStretchOrderNewWindow = () => {
        window.open("/stretchceiling/addTagStretchOrder")
    }

    const home = () => {
        navigate("/stretchceiling")
    }
    const viewStretchOrders = () => {
        navigate("/stretchceiling/viewStretchOrdersList")
    }
    const viewStretchOrdersNewWindow = () => {
        window.open("/stretchceiling/viewStretchOrdersList")
    }
    const viewMaterialsOrders = () => {
        navigate("/stretchceiling/viewMaterial")
    }
    const viewMaterialsOrdersNewWindow = () => {
        window.open("/stretchceiling/viewMaterial")
    }
    const viewDebetKredit = () => {
        navigate("/stretchceiling/debet-kredit")
    }
    const viewDebetKreditNewWindow = () => {
        window.open("/stretchceiling/viewMaterial")
    }
    const stretchWallet = () => {
        navigate("/stretchceiling/stretch-wallet")
    }
    const stretchWalletNewWindow = () => {
        window.open("/stretchceiling/stretch-wallet")
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
                    <option value={"/stretchceiling/addStretchBardutyun"}>Բարդություն</option>
                    <option value={"/stretchceiling/addStretchProfil"}>Պրոֆիլ</option>
                    <option value={"/stretchceiling/addStretchLightPlatform"}>Լույսի Պլատֆորմ</option>
                    <option value={"/stretchceiling/addStretchLightRing"}>Լույսի Օղակ</option>
                    <option value={"/stretchceiling/addTagStretchWork"}>Աշխատանք</option>
                    <option value={"/stretchceiling/addStretchAdditional"}>Այլ Ապրանք</option>
                </select> */}
                <button className="btn" onClick={tagStretchBuyer} onContextMenu={tagStretchBuyerNewWindow}>Ավելացնել Գնորդ</button>
                <button className="btn" onClick={tagStretchWorker} onContextMenu={tagStretchWorkerNewWindow}>Ավելացնել Աշխատակից</button>
                <button className="btn" onClick={viewStretchOrders} onContextMenu={viewStretchOrdersNewWindow}>Դիտել Պատվերները</button>
                <button className="btn" onClick={viewMaterialsOrders} onContextMenu={viewMaterialsOrdersNewWindow}>Նյութածախս</button>
                <button className="btn" onClick={viewDebetKredit} onContextMenu={viewDebetKreditNewWindow}>Դեբետ/Կրեդիտ</button>
                <button className="btn" onClick={stretchWallet} onContextMenu={stretchWalletNewWindow}>Դրամարկղ</button>
            </div>
            <div style={{width:"10%"}}></div>
        </div>
    )
}