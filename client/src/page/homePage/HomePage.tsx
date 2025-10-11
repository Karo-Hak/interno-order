import React from 'react';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlice";
import { userProfile } from "../../features/user/userApi";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import './homePage.css';

export const HomePage: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const [sphere, setSphere] = useState<string[]>([]);

    const user = useAppSelector(selectUser);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                handleResult(userProfileResult);
            } catch (error) {
                console.error("Произошла ошибка:", error);
            }
        };

        const handleResult = (result: any) => {
            if ("error" in result) {
                alert(result.error);
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
    }, [dispatch, cookies, setCookie, navigate]);

    const wallpaper = () => {
        if (sphere.includes("Wallpaper")) {
            navigate("/wallpaper");
        } else {
            alert("Եսի քո տեղը չի");
        }
    };

    const stretch = () => {
        if (sphere.includes("Stretch Ceiling")) {
            navigate("/stretchceiling");
        } else {
            alert("Եսի քո տեղը չի");
        }
    };

    const stock = () => {
        if (sphere.includes("Stock")) {
            navigate("/stock");
        } else {
            alert("Եսի քո տեղը չի");
        }
    };

    const coopStretch = () => {
        if (sphere.includes("Stretch Ceiling Coop")) {
            navigate("/coopStretchceiling/report");
        } else {
            alert("Եսի քո տեղը չի");
        }
    };
    
    const wpcPanel = () => {
        alert("Էլ ինչ կուզեիր");
    };
    
    const plinth = () => {
        if (sphere.includes("Plinth") || sphere.includes("Plinth TAG") || sphere.includes("Plinth Interno")) {
            navigate("/plint/homePage");
        } else {
            alert("Եսի քո տեղը չի");
        }
    };

    return (
        <div className="homepageBody">
            <div className="wellcome">
                <h1>Wellcome to INTERNO Group</h1>
            </div>
            <div className="homePageDiv">
                <div onClick={wallpaper}>
                    <img className="homeImg" src="/img/wallpaper.jpg"/>
                    <p>Ֆոտոպաստառ</p>
                </div>
                <div onClick={stretch}>
                    <img className="homeImg" src="/img/stretch.jpg"/>
                    <p>Ձգվող Առաստաղ</p>
                </div>
                <div onClick={stock}>
                    <img className="homeImg" src="/img/stock.jpg"/>
                    <p>Պահեստ</p>
                </div>
                <div onClick={coopStretch}>
                    <img className="homeImg" src="/img/coopStrtch.jpg"/>
                    <p>Համ․ Ձգվող Առաստաղ</p>
                </div>
                <div onClick={plinth}>
                    <img className="homeImg" src="/img/plint.jpg"/>
                    <p>Շրիշակ</p>
                </div>
                <div onClick={wpcPanel}>
                    <img className="homeImg" src="/img/WpcPanel.jpg"/>
                    <p>3D Պանել</p>
                </div>
            </div>
        </div>
    );
};
