import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './viewStretchOrder.css'
import { findStretchOrder, updateStretchPayed } from "../../features/stretchCeilingOrder/stretchOrderApi";
import { selectStretchOrder } from "../../features/stretchCeilingOrder/stretchOrderSlice";
import ViewStretchTexturesSection from "./ViewStretchTexturesSection";
import ViewProfilSection from "./ViewProfilSection";
import ViewLightPlatformSection from "./ViewLightPlatformSection";
import ViewLightRingSection from "./ViewLightRingSection";
import ViewAdditionalSection from "./ViewAdditionalSection";
import ViewWorkSection from "./ViewWorkSection";
import ViewBardutyunSection from "./ViewBardutyunSection";
import ViewOtherSection from "./ViewOtherSection";
import { StretchMenu } from "../../../component/menu/StretchMenu";
import StretchImageUpload from "../../uploadStretchImg/uploadStretchImg";
import ModalStretchStatus from "../../../component/modal/ModalStretchStatus";
import ConfirmationButton from "../../../component/confirmButten/ConfirmationButton";
import AddPayment from "../../../component/confirmButten/AddPayment";
import DeletOrder from "../../../component/confirmButten/DeletOrder";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ViewStretchOrderPDF from "./ViewStretchOrderPDF";


export const ViewStretchOrder: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const params = useParams()
    const navigate = useNavigate();
    const type = "tag"

    const [rooms, setRooms] = useState<any[]>([]);
    const [works, setWorks] = useState<any[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const order = useAppSelector(selectStretchOrder).stretchOrder;

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = () => {
        setIsDownloading(true);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
                handleResult(userProfileResult);
                const stretchOrderResult = await dispatch(findStretchOrder({ params, cookies })).unwrap();
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
            if (result.rooms && typeof result.rooms === "object" && result.rooms !== null) {
                const rooms = Object.values(result.rooms);
                setRooms(rooms);
            }

            if (result.groupedWorks !== undefined && result.groupedWorks !== null) {
                const works = Object.values(result.groupedWorks);
                setWorks(works);
            }
            if (result.picUrl) {
                setImages(result.picUrl)
            }

        };

        fetchData();
    }, []);


    const user = useAppSelector(selectUser);

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
        <StretchMenu />

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
                        <p style={{ color: "white", marginTop: "10px" }}>կարգավիճակ -- {order.status}</p>
                        <button type="button" onClick={handleOpenModal}>Փոխել Կարգավիճակը</button>
                        <AddPayment type={type} />
                        <button type="button" onClick={editOrder}>Լրացնել</button>
                        <ConfirmationButton payed={order.payed} />
                        <DeletOrder />
                    </div>

                    <div className=''>
                        <div >
                            <table className='buyerSectionName'>
                                <thead>
                                    <tr style={{
                                        background: "#dfdce0",
                                        height: "10px"
                                    }}>
                                        <th>Կոդ</th>
                                        <th>ԱԱ/սկիզբ</th>
                                        <th>ԱԱ/ավարտ</th>
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
                                        <td>{order.code}</td>
                                        <td>{parseDate(order.measureDate)}</td>
                                        <td>{parseDate(order.installDate)}</td>
                                        <td>{order.buyer.buyerName}</td>
                                        <td>{order.buyer.buyerRegion}</td>
                                        <td>{order.buyer.buyerAddress}</td>
                                        <td>
                                            <div className='buyerPhone1_2'>
                                                {order.buyer.buyerPhone1} / {order.buyer.buyerPhone2}
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
                                        <th>Աշխատակից</th>
                                        <th>Աշխատավարձ</th>
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
                                        <td>{order.stWorker?.name}</td>
                                        <td>{order.salary}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div style={{ height: "20px", color: "white" }} className="admin_profile_Strech"> Ընդամենը -
                        - {order.roomSum} -/- {(((+order.roomSum - +order.balance) / +order.roomSum) * 100).toFixed(2)} %
                    </div>

                    <div className="grid-container">
                        <ViewWorkSection works={works} />
                        {
                            order && order.orderComment ?
                                <div style={{ border: "1px solid black", padding: "5px" }}>
                                    <p>{order.orderComment}</p>
                                </div>
                                : null
                        }

                    </div>
                    <ModalStretchStatus isOpen={isModalOpen} onClose={handleCloseModal} />
                    <div >
                        {rooms && rooms.length > 0 ?
                            rooms.map((room: any) => {
                                return (
                                    <div key={room.id} >
                                        <div style={{ backgroundColor: "GrayText", paddingLeft: "100px", color: "white" }}>
                                            <h5>{room.name} - {room.sum}</h5>
                                        </div>
                                        <div className="apranqacank">
                                            <ViewStretchTexturesSection room={room} />
                                            <ViewProfilSection room={room} />
                                            <ViewLightPlatformSection room={room} />
                                            <ViewLightRingSection room={room} />
                                            <ViewBardutyunSection room={room} />
                                            <ViewAdditionalSection room={room} />
                                            <ViewOtherSection room={room} />
                                        </div>
                                    </div>
                                );
                            })
                            : null}
                    </div>
                    <div>
                        <StretchImageUpload />
                    </div>
                    <div>
                        <button onClick={handleDownloadPDF} disabled={isDownloading}>
                            {isDownloading ? 'Создание PDF...' : 'Скачать PDF'}
                        </button>
                        {isDownloading && order && (
                            <PDFDownloadLink document={<ViewStretchOrderPDF order={order} />} fileName="order.pdf">
                                {({ blob, url, loading, error }) =>
                                    loading ? 'Загрузка документа...' : 'Готово! Нажмите для скачивания.'
                                }
                            </PDFDownloadLink>
                        )}
                    </div>
                </div>
                : null
        }
    </>);
}

