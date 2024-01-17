
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

    return (<div>

        <nav className="navbar_head">
            <div className="navbar_container">
                <div className="navbar_logo">

                    <button className="btn" onClick={btnHome}>Գլխավոր էջ</button>
                    <a className="" href="#">
                        <img src="/interno.png" alt="" height="50px" />
                    </a>
                </div>
                <div className="menu_search">
                    <div className="menu_search_item">
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
                        <div>
                            {
                                data?.profile && data?.profile?.role === "admin" || data?.profile?.role === "user" ?


                                    <div className="user_name_surname">
                                        <div className="userNameSurname">
                                            <div >
                                                {data.profile.name}
                                            </div>
                                            <div>
                                                {data.profile.surname}
                                            </div>
                                        </div>

                                        <div>
                                            <button className="btn" onClick={() => {
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
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    </div>


                    <div>

                    </div>
                </div>

            </div>
        </nav>
    </div>)
}