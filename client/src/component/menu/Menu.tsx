
import { useNavigate } from "react-router-dom"
import { selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser, userProfile } from "../../features/user/userApi";
import { useCookies } from 'react-cookie'
import { useEffect } from "react";
import './menu.css'


export const Menu: React.FC = (): JSX.Element => {
    const data = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {

            dispatch(userProfile(cookies)).unwrap().then(res => {
                if ("error" in res) {
                    setCookie("access_token", '', { path: '/' })
                    navigate("/")
                }
            })
        }, 100)

    }, [])

    const btnHome = () => {
        if(data.profile.role == "admin"){
            navigate("/admine/profile")
        } else {
            navigate("/user/profile")
        }
        
    }

    return (<>
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img src="/interno.png" alt="" height="30" />
                </a>
                <button className="btn" onClick={btnHome}>Home</button>
                {
                    data.profile ?
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" >{data.profile.name}</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link">{data.profile.surname}</a>
                            </li>
                            <li>
                                <button className="logount, btn" onClick={() => {
                                    dispatch(logoutUser(cookies)).unwrap().then(res => {
                                        if ("error" in res) {
                                            alert(res.error)
                                        }
                                        setCookie("access_token", '', { path: '/' })
                                        navigate("/")
                                    })
                                }}>
                                    logout
                                </button>
                            </li>
                        </ul>
                        :
                        <p></p>

                }
            </div>

        </nav></>)
}