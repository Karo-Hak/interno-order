import { selectUser } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { userProfile } from "../../../features/user/userApi";
import './viewPlintOrder.css'
import { PDFDownloadLink } from "@react-pdf/renderer";
import { findPlintOrder } from "../../features/plintOrder/plintOrderApi";
import { PlintMenu } from "../../../component/menu/PlintMenu";
import { PlintOrderProps } from "../../features/plintOrder/plintOrderSlice";
import ViewPlintSection from "./ViewPlintSection";
import ViewPlintOrderPDF from "./ViewPlintOrderPDF";
import PlintDone from "../../../component/confirmButten/PlintDone";


export const ViewPlintOrder: React.FC = (): JSX.Element => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const params = useParams()
    const navigate = useNavigate();

    const [plint, setPlint] = useState<any[]>([]);
    const [order, setOrder] = useState<PlintOrderProps>()
    const [done, setDone] = useState<boolean>(false)

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = () => {
        setIsDownloading(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userProfileResult = await dispatch(userProfile(cookies)).unwrap();
            handleResult(userProfileResult);
            const plintOrderResult = await dispatch(findPlintOrder({ params, cookies })).unwrap();
            handleResult(plintOrderResult);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const handleResult = (result: any) => {
        if ("error" in result) {
            console.error(result.error);
            setCookie("access_token", "", { path: "/" });
            navigate("/");
        } else {
            processResult(result);
        }
    };

    const processResult = (result: any) => {
        if (result.order) {
            setOrder(result.order)
        }

        if (result.order !== undefined && result.order.groupedPlintData !== null) {
            const plint = Object.values(result.order.groupedPlintData);
            setPlint(plint);
        }

    };



    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }


    function editOrder() {
        navigate('/plint/EditPlintOrder/' + params.id);

    }

    const statuse = () => {
        setDone(true);
    };
console.log(order);

    return (<>
        <PlintMenu />

        {
            order && Object.values(order).length > 0 ?
                <div className=''>
                    {
                        !order.done ?
                            <div style={{
                                height: "30px",
                                display: "flex",
                                justifyContent: "end",
                                padding: "2px 10px",
                                gap: "20px"
                            }}
                                className="admin_profile_Strech">
                                <PlintDone done={order.done} />
                                {/* <DeletOrder /> */}
                                <button type="button" onClick={editOrder}>Լրացնել</button>
                            </div>
                            :
                            null
                    }

                    <div className=''>
                        <div>
                            <table className='buyerSectionName'>
                                <thead>
                                    <tr style={{
                                        background: "#dfdce0",
                                        height: "10px"
                                    }}>
                                        <th>Կոդ</th>
                                        <th>Ամսաթիվ</th>
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
                                        <th>Զեղչ %</th>
                                        <th>Առ․ հասցե</th>
                                        <th>Առ․ Հեռախես</th>
                                        <th>Առ․ գումար</th>
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
                                        <td>{order.discount}</td>
                                        <td>{order.deliveryAddress}</td>
                                        <td>{order.deliveryPhone}</td>
                                        <td>{order.deliverySum}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div style={{ height: "20px", color: "white" }} className="admin_profile_Strech"> Ընդամենը</div>

                    <div className="grid-container">
                        <ViewPlintSection plint={plint} />
                    </div>
                    <div>
                        <button onClick={handleDownloadPDF} disabled={isDownloading}>
                            {isDownloading ? 'Создание PDF...' : 'Скачать PDF'}
                        </button>
                        {isDownloading && order && (
                            <PDFDownloadLink document={<ViewPlintOrderPDF order={order} plint={plint} />} fileName="order.pdf">
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

