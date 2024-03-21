import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import NewStretchOrderSection from "./NewStretchOrderSection";
import { StretchMenu } from "../../../component/menu/StretchMenu";
import MesurStretchOrderSection from "./MesurStretchOrderSection";
import InstalStretchOrderSection from "./InstalStretchOrderSection";
import './tagStrechCeiling.css'

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


    return (
        <>
            <StretchMenu />
            <div className="newStretchOrderSection">
                <NewStretchOrderSection />
                <MesurStretchOrderSection/>
                <InstalStretchOrderSection/>
            </div>
        </>
    );
}

