import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/user/userSlice"
import { userProfile } from "../../features/user/userApi"
import { useCookies } from "react-cookie"
import { Await, useNavigate } from "react-router-dom"
import './homePage.css'


export const HomePage: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const [sphere, setSphere] = useState([""])

    const user = useAppSelector(selectUser)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                handleResult(userProfileResult);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        const handleResult = (result: any) => {
            if ("error" in result) {
                alert(result);
                setCookie("access_token", "", { path: "/" });
                navigate("/");
            } else {
                processResult(result);
            }
        };

        const processResult = (result: any) => {
            if (result.user) {
                setSphere(result.user.sphere);
            }
        };

        fetchData();
    }, []);


    const wallpaper = () => {
        if (sphere.includes("Wallpaper")) {
            navigate("/wallpaper")
        } else {
            alert("you don't have permission to access on Wallpaper")
        }
    }
    const stretch = () => {
        if (sphere.includes("Stretch Ceiling")) {
            navigate("/stretchceiling")
        }  else {
            alert("you don't have permission to access on Stretch Ceiling")
        }
    }
    const stock = () => {
        if (sphere.includes("Stock")) {
            navigate("/stock")
        }  else {
            alert("you don't have permission to access on Stock")
        }
    }
    const coopStretch = () => {
        // if (sphere.includes("Stretch Ceiling Coop")) {
        //     navigate("/stretchceilingcoop")
        // }  else {
        // }
        alert("Hay hay hay!!!! el inch kuzeir")
    }
    const wpcPanel = () => {
        // if (sphere.includes("Wpc Panel")) {
        //     navigate("/wpcPanel")
        // }  else {
        // }
        alert("Hay hay hay!!!! el inch kuzeir")
    }
    const plinth = () => {
        // if (sphere.includes("Plinth")) {
        //     navigate("/plinth")
        // }  else {
        // }
        alert("Hay hay hay!!!! el inch kuzeir")
    }

    return (<>
        <div className="homePageDiv">
            <div onClick={wallpaper}>
                <img className="homeImg" src="/img/wallpaper.jpg"></img>
                <p>Ֆոտոպաստար</p>
            </div>

            <div onClick={stretch}>
                <img className="homeImg" src="/img/stretch.jpg"></img>
                <p>Ձգվող Առաստաղ</p>
            </div>

            <div onClick={stock}>
                <img className="homeImg" src="/img/stock.jpg"></img>
                <p>Պահեստ</p>
            </div>
            <div onClick={coopStretch}>
                <img className="homeImg" src="/img/coopStrtch.jpg"></img>
                <p>Համ․ Առաստաղ</p>
            </div>
            <div onClick={wpcPanel}>
                <img className="homeImg" src="/img/WpcPanel.jpg"></img>
                <p>3D Պանել</p>
            </div>
            <div onClick={plinth}>
                <img className="homeImg" src="/img/plint.jpg"></img>
                <p>Հատակապատաարանքափայտ</p>
            </div>
        </div>
    </>)
}