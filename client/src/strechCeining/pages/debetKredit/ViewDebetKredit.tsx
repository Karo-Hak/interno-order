import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { StretchMenu } from "../../../component/menu/StretchMenu";
import { viewDebetKredit } from "../../features/debetKredit/debetKreditApi";
import DebetKreditSection from "./DebetKreditSection";
import { DebetKreditSearchLogic } from "./DebetKreditLogic";
import { viewOrdersList } from "../../features/stretchCeilingOrder/stretchOrderApi";
import StretchOrderBalanceList from "./StretchOrderBalanceList";

export const ViewDebetKredit: React.FC = (): JSX.Element => {

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    const [ordersList, setOrdersList] = useState<any[]>([]);
    const [ordersListFilter, setOrdersListFilter] = useState<any[]>([]);
    const [orderType, setOrderType] = useState<string>("");
    const [searchBuyer, setSearchBuyer] = useState<string>("");
    const [orders, setOrders] = useState<any[]>([]);

    const currentDate = new Date();
    const [startDate, setStartDate] = useState(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), 2)
            .toISOString()
            .split('T')[0]
    );
    const [endDate, setEndDate] = useState(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1,)
            .toISOString()
            .split('T')[0]
    );

    const fetchData = async () => {
        try {
            const dateFilter = { startDate, endDate };
            const stretchOrderResult = await dispatch(
                viewDebetKredit({ dateFilter, cookies })
            ).unwrap();
            const ordersResult = await dispatch(
                viewOrdersList({ dateFilter, cookies })
            ).unwrap();
            handleResult(stretchOrderResult);
            handleResult(ordersResult);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]); // при смене дат тоже обновляем

    const handleResult = (result: any) => {
        console.log(result.data);

        if ("error" in result) {
            alert(result);
            setCookie("access_token", "", { path: "/" });
            navigate("/");
        } else if (result.data) {
            setOrdersList(result.data || []);
            setOrdersListFilter(result.data || []);
        } else if (result.order) {
            setOrders(result.order || []);
        }
    };

    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }

    const filterBuyer = () => {
        DebetKreditSearchLogic(
            ordersListFilter,
            orderType,
            ordersList,
            setOrdersList,
            searchBuyer
        );
    }

    const clearSearch = () => {
        setSearchBuyer("");
        DebetKreditSearchLogic(
            ordersListFilter,
            orderType,
            ordersList,
            setOrdersList,
            ""
        );
    }

    return (
        <div>
            <StretchMenu />
            <div className="divFilter">
                <div className="divDate">
                    <div className="divLabel">
                        <label htmlFor="startDate">Ամսատիվ սկիզբ</label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="divLabel">
                        <label htmlFor="endDate">Ամսաթիվ վերջ</label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="divDate">
                    <div className="divLabel">
                        <label htmlFor="endDate">Գնորդ</label>
                        <div>
                            <input
                                id="stretchBuyer"
                                type="text"
                                value={searchBuyer}
                                onChange={(e) => setSearchBuyer(e.target.value)}
                            />
                            <button type="button" onClick={clearSearch}>X</button>
                            <button type="button" onClick={filterBuyer}>Որոնել</button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "50px" }}>
                <DebetKreditSection
                    ordersList={ordersList}
                    parseDate={parseDate}
                    orders={orders}
                />
                <StretchOrderBalanceList
                    parseDate={parseDate}
                    orders={orders}
                    onReloadOrders={fetchData}   // 👈 вот это главное
                />
            </div>
        </div>
    );
};
