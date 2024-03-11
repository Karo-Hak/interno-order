import { useNavigate } from "react-router-dom"
import { selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser, userProfile } from "../../features/user/userApi";
import { useCookies } from 'react-cookie'
import { ChangeEvent, useEffect } from "react";

interface wallpaperMenuProps {

}

export const WallpaperMenu: React.FC<wallpaperMenuProps> = (): JSX.Element => {
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


    function goTo(event: ChangeEvent<HTMLSelectElement>): void {
        window.open(event.target.value)
    }

    const addBuyer = () => {
        navigate('/wallpaper/addBuyer');
    }
    const addCooperate = () => {
        if (user.profile.role === "admin") {
            navigate("/wallpaper/addCooperate")
        }
    }
    const addTexture = () => {
        if (user.profile.role === "admin") {
            navigate("/wallpaper/addTexture")
        }
    }
    const search = () => {
        navigate("/wallpaper/searchOrder")
    }

    const addWallpaperOrder = () => {
        navigate("/wallpaper/addOrder")
    }

    const home = () => {
        navigate("/wallpaper")
    }

    return (
        <div className="admin_profile">
            <div style={{
                textAlign: 'left',
                width: "10%"
            }}>
                <button className="btn" onClick={home}>Գլխավոր Էջ</button>
            </div>
            <div className="admin_profile">
                <div >
                    <button className="btn" onClick={addWallpaperOrder}>Ավելացնել Պատվեր</button>
                    <button className="btn" onClick={addBuyer} >Ավելացնել Գնորդ</button>
                    <button className="btn" onClick={addCooperate} >Ավելացնել Գործընկեր</button>
                    <button className="btn" onClick={addTexture} >Ավելացնել Տեսակ</button>
                    <button className="btn" onClick={search} >Դիտել Պատվերները</button>
                </div>
            </div>
            <div style={{ width: "10%" }}></div>

        </div>)
}