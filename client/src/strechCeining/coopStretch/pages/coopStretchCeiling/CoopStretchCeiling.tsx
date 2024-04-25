import { selectUser } from "../../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { ChangeEvent, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../../features/user/userApi";
import './coopStrechCeiling.css'
import { CoopStretchMenu } from "../../../../component/menu/CoopStretchMenu";

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


    return (
        <>
           <CoopStretchMenu/>
        </>
    );
}

