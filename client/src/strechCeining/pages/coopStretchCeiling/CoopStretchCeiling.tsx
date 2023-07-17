import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
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

    const stretchTexture = () => {
        window.open('/stretchTexture')
    }
    const coopStretchBuyer = () => {
        window.open("/coopstretchceiling/addCoopStretchBuyer")
    }
    return (
        <>

            <div className="profile">
                <div className="divBtn">
                    <button className="btn" >Նոր Պատվեր</button>
                    <button className="btn" onClick={stretchTexture} >Ավելացնել Ձգվող Առաստաղ</button>
                    <button className="btn" onClick={coopStretchBuyer}>Ավելացնել Գործընկեր</button>
                    <button className="btn">Դիտել Պատվերները</button>
                </div>

            </div>

            <div className="divBtn">

            </div>

        </>
    );
}

