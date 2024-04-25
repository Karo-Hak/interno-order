import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie'
import './viewCoopStretchOrder.css'
import ImageGallery from "./ImageGallery";
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { userProfile } from '../../../../features/user/userApi';
import { findCoopStretchOrder } from '../../features/coopStrechOrder/coopStretchOrderApi';
import { User } from '../../../../features/user/userSlice';
import { CoopStretchMenu } from '../../../../component/menu/CoopStretchMenu';
import { CoopStretchOrderProps } from '../../features/coopStrechOrder/coopStretchOrderSlice';
import ViewCoopStretchTexturesSection from './ViewCoopStretchTexturesSection';
import ViewCoopProfilSection from './ViewCoopProfilSection';
import ViewCoopLightPlatformSection from './ViewCoopLightPlatformSection';
import ViewCoopLightRingSection from './ViewCoopLightRingSection';
import AddPayment from '../../../../component/confirmButten/AddPayment';


export const ViewCoopStretchOrder: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const params = useParams()
    const navigate = useNavigate();

    const [images, setImages] = useState<any[]>([]);
    const [order, setOrder] = useState<CoopStretchOrderProps>()
    const [user, setUser] = useState<User>()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                handleResult(userProfileResult);
                const stretchOrderResult = await dispatch(findCoopStretchOrder({ params, cookies })).unwrap();
                handleResult(stretchOrderResult);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        const handleResult = (result: any) => {
            if ("error" in result) {
                console.error(result.error);
                // setCookie("access_token", "", { path: "/" });
                // navigate("/");
            } else {
                processResult(result);
            }
        };

        const processResult = (result: any) => {
            if (result.user) {
                setUser(result.user)
            }
            if (result.order) {
                setOrder(result.order)
            }

        };

        fetchData();
    }, []);




    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }


    function editOrder() {
        navigate('/stretchceiling/editStretchOrder/' + params.id);

    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };



    return (<>
        <CoopStretchMenu />

        {
            order && Object.values(order).length > 0 ?
                <div className=''>
                    <div style={{
                        height: "30px",
                        display: "flex",
                        justifyContent: "end",
                        padding: "2px 10px",
                        gap: "20px"
                    }}
                        className="admin_profile_Strech">
                        <AddPayment/>
                        <button type="button" onClick={editOrder}>Լրացնել</button>
                        {/* <ConfirmationButton payed={order.payed} /> */}
                        {/* <DeletOrder/> */}
                    </div>
                    <div className=''>
                        <div >
                            <table className='buyerSectionName'>
                                <thead>
                                    <tr style={{
                                        background: "#dfdce0",
                                        height: "10px"
                                    }}>
                                        <th>ԱԱ</th>
                                        <th>Անուն Ազգանուն</th>
                                        <th>Մարզ</th>
                                        <th>Հասցե</th>
                                        <th>Հեռախես</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{
                                        height: "10px"
                                    }}>
                                        <td>{parseDate(order.date)}</td>
                                        <td>{order.buyer.name}</td>
                                        <td>{order.buyer.region}</td>
                                        <td>{order.buyer.address}</td>
                                        <td>
                                            <div className='buyerPhone1_2'>
                                                {order.buyer.phone1} / {order.buyer.phone2}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <p style={{ height: "5px" }}></p>
                    <div>
                        <div >
                            <table className='paymentSection' >
                                <thead>
                                    <tr style={{
                                        background: "#dfdce0",
                                        height: "10px"
                                    }}>
                                        <th>Վճարման միջոց</th>
                                        <th>Գումար</th>
                                        <th>Կանխավճար</th>
                                        <th>Մնացորդ</th>
                                        <th>Նկարագրություն</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{
                                        height: "10px"
                                    }}>
                                        <td>
                                            {order.paymentMethod}
                                        </td>
                                        <td>{order.balance}</td>
                                        <td>{order.prepayment}</td>
                                        <td>{order.groundTotal}</td>
                                        <td>{order.buyerComment}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="grid-container">

                        {/* <div >
                            <ImageGallery thumbnailImages={images} fullSizeImages={images}/>
                            <StretchImageUpload/>
                        </div> */}
                    </div>
                    <div style={{display:"flex", justifyContent:"center", gap:"10px"}} >
                        {
                            order.groupedStretchTextureData &&
                                order.groupedStretchTextureData.length > 0 ?
                                <ViewCoopStretchTexturesSection stretch={order.groupedStretchTextureData} />
                                : null

                        }
                        {
                            order.groupedStretchProfilData &&
                                order.groupedStretchProfilData.length > 0 ?
                                <ViewCoopProfilSection profil={order.groupedStretchProfilData} />
                                : null

                        }
                        {
                            order.groupedLightPlatformData &&
                                order.groupedLightPlatformData.length > 0 ?
                                <ViewCoopLightPlatformSection lightPlatform={order.groupedLightPlatformData} />
                                : null

                        }
                        {
                            order.groupedLightRingData &&
                                order.groupedLightRingData.length > 0 ?
                                <ViewCoopLightRingSection lightRing={order.groupedStretchTextureData} />
                                : null

                        }
                    </div>
                </div>
                : null
        }
    </>);
}

