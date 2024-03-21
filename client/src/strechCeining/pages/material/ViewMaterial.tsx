import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { viewMaterialList } from "../../features/stretchCeilingOrder/stretchOrderApi";
import { MaterialSearchLogic } from "./MaterialSearchLogic";
import { StretchMenu } from "../../../component/menu/StretchMenu";
import MaterialListSection from "./MaterialListSection";

export const ViewMaterial: React.FC = (): JSX.Element => {

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const [ordersList, setOrdersList] = useState([])
    const [ordersListFilter, setOrdersListFilter] = useState([])
    const currentDate = new Date();
    const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 2).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2).toISOString().split('T')[0]);
    const [status, setStatus] = useState<string>("")
    const [searchBuyer, setSearchBuyer] = useState<string>("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dateFilter = { startDate, endDate }
                const stretchOrderResult = await dispatch(viewMaterialList({ dateFilter, cookies })).unwrap();
                handleResult(stretchOrderResult);
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
            if (result) {
                setOrdersList(result)
                setOrdersListFilter(result)
            }
        };

        fetchData();
        setStatus("")
    }, [startDate, endDate]);

    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const selectedStatus = event.currentTarget.value;
        if (selectedStatus !== "Ընտրել") {
            setStatus(selectedStatus);
            MaterialSearchLogic(ordersListFilter, selectedStatus, ordersList, setOrdersList, searchBuyer);
        } else {
            setStatus("");
            setOrdersList(ordersListFilter)
        }
    };

    const filterBuyer = () => {
        setSearchBuyer("")
        MaterialSearchLogic(ordersListFilter, status, ordersList, setOrdersList, searchBuyer);
    }

    const clearSearch = () => {
        const clearBuyer = ""
        MaterialSearchLogic(ordersListFilter, status, ordersList, setOrdersList, clearBuyer);
    }

    return (
        <div>
            <StretchMenu />
            <div className="divFilter">
                <div className="divDate">
                    <div className="divLabel">
                        <label htmlFor="startDate">Ամսատիվ սկիզբ</label>
                        <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="divLabel">
                        <label htmlFor="endDate">Ամսաթիվ վերջ</label>
                        <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
                <div className="divDate">
                    <div className="divLabel">
                        <label htmlFor="endDate">Գնորդ</label>
                        <div>
                            <input id="stretchBuyer" type="text" value={searchBuyer} onChange={(e) => setSearchBuyer(e.target.value)} ></input>
                            <button type="button" onClick={() => { setSearchBuyer(""); clearSearch(); }}>x</button>
                            <button type="button" onClick={filterBuyer}>Որոնել</button>
                        </div>
                    </div>
                    <div className="divLabel">
                        <label htmlFor="startDate">Կարգավիճակ</label>
                        <select value={status}
                            style={{ border: "1px solid black" }}
                            id="status"
                            onChange={handleSelectChange}>
                            <option>Ընտրել</option>
                            <option value={"progress"}>Գրանցված</option>
                            <option value={"measurement"}>Չափագրում</option>
                            <option value={"installation"}>Տեղադրում</option>
                            <option value={"dane"}>Ավարտված</option>
                        </select>
                    </div>
                </div>
            </div>
            <MaterialListSection ordersList={ordersList} parseDate={parseDate} />

        </div>
    )
}
