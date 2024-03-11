
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



    const addUser = () => {
        if (data.profile.role === "admin") {
            window.open("/addUser")
        }
    }

 


    return (<div>
        <nav className="navbar_head">
            <div className="navbar_container">
                <div className="menu_search">
                    <div className="menu_search_item">
                        <div className="navbar_logo">
                            <a href="/home">
                                <img src="/interno.png" alt="" height="50px" />
                            </a>
                        </div>
                        {
                            data?.profile && data.profile?.role === "admin" ?

                                <div className="menu_head">
                                    <button className="btn" onClick={addUser}>Օգտատեր</button>
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
                </div>
            </div>
        </nav>
    </div>)
}