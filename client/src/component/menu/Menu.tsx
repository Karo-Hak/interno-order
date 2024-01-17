
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
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })


    }, [])

    const btnHome = () => {
        navigate("/admine/profile")
    }
    const wallpaper = () => {
        navigate("/wallpaper")
    }
    const coopStrechCeiling = () => {
        if (data.profile.sphere.includes("Stretch Ceiling Coop")) {
            navigate("/stretchceilingcoop")
        }
    }
    const tagStretchCeiling = () => {
        if (data.profile.sphere.includes("Stretch Ceiling")) {
            navigate("/stretchceiling")
        }
    }

    const addUser = () => {
        if (data.profile.role === "admin") {
            window.open("/addUser")
        }
    }

    return (<>
      
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark manu">
            <div className="container-fluid">
                <div>
                    <a className="navbar-brand" href="#">
                        <img src="/interno.png" alt="" height="30" />
                    </a>
                    <button className="btn" onClick={btnHome}>Գլխավոր էջ</button>
                </div>
                <div>

                    {
                        data?.profile && data.profile?.role === "admin" ?
                            <div className="menu_head">
                                <button className="btn" onClick={addUser}>Օգտատեր</button>
                                <button className="btn" onClick={wallpaper}>Ֆոտոպաստառ</button>
                                <button className="btn" onClick={tagStretchCeiling}>Ձգվող առաստաղ</button>
                                <button className="btn" onClick={coopStrechCeiling}>Համ․ Ձգվող առաստաղ</button>
                            </div>
                            :
                            null
                    }
                    {
                        data?.profile?.role === "user" ?
                            <div>
                                {
                                    data.profile.sphere.includes("Wallpaper") ?
                                        <button className="btn" onClick={wallpaper}>Ֆոտոպաստառ</button>
                                        :
                                        null
                                }

                                {
                                    data.profile.sphere.includes("Stretch Ceiling") ?
                                        <button className="btn" onClick={tagStretchCeiling}>Ձգվող առաստաղ</button>
                                        :
                                        null
                                }
                                
                                {
                                    data.profile.sphere.includes("Stretch Ceiling Coop") ?
                                        <button className="btn" onClick={coopStrechCeiling}>Համ․ Ձգվող առաստաղ</button>
                                        :
                                        null
                                }

                            </div>
                            :
                            null
                    }
                </div>
                {
                    data?.profile && data?.profile?.role === "admin" || data?.profile?.role === "user" ?
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
                                    Դուրս Գալ
                                </button>
                            </li>
                        </ul>
                        :
                        null
                }
            </div>
        </nav>
    </>)
}