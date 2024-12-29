import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAppDispatch } from "../../../app/hooks"
import "./viewPlintOrdersList.css"
import { searchLogic } from "./searchLogic"
import { viewPlintOrdersList } from "../../features/plintOrder/plintOrderApi"
import { PlintMenu } from "../../../component/menu/PlintMenu"




export const ViewPlintOrdersList: React.FC = (): JSX.Element => {

    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();
    const [ordersList, setOrdersList] = useState<any>([])
    const [ordersListFilter, setOrdersListFilter] = useState([])
    const currentDate = new Date();
    const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 2).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2).toISOString().split('T')[0]);
    const [status, setStatus] = useState<string>("")
    const [searchBuyer, setSearchBuyer] = useState<string>("")
    const [listSum, setListSum] = useState("")
    const [totalOrders, setTotalOrders] = useState(0)

    let squerOrders = 0

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dateFilter = { startDate, endDate }
                const stretchOrderResult = await dispatch(viewPlintOrdersList({ dateFilter, cookies })).unwrap();
                handleResult(stretchOrderResult);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        const handleResult = (result: any) => {
            if ("error" in result) {
                alert(result);
                // setCookie("access_token", "", { path: "/" });
                // navigate("/");
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
            searchLogic(ordersListFilter, selectedStatus, ordersList, setOrdersList, searchBuyer);
        } else {
            setStatus("");
            setOrdersList(ordersListFilter)
        }
    };

    const filterBuyer = () => {
        setSearchBuyer("")
        searchLogic(ordersListFilter, status, ordersList, setOrdersList, searchBuyer);
    }

    const clearSearch = () => {
        const clearBuyer = ""
        searchLogic(ordersListFilter, status, ordersList, setOrdersList, clearBuyer);
    }


    function viewOrder(id: any) {
        navigate('/plint/viewPlintOrder/' + id);
    }
    function viewOrderNewWindow(id: any) {
        window.open('/plint/viewPlintOrder/' + id, '_blank');
    }

    useEffect(() => {
        let sum = 0
        ordersList.map((e: any) => {
            sum += e.balance
        })
        setTotalOrders(sum)
    }, [ordersList])


    return (
        <div>
            <PlintMenu />
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
                            <option value={"dane"}>Գրանցված</option>
                            <option value={"done"}>Ավարտված</option>
                        </select>
                    </div>
                    <div className="m_Sum">
                        <p> Ընդամենը -- {totalOrders} -- Դրամ </p>
                    </div>
                </div>
            </div>
            {
                ordersList.length > 0 ?

                    <div>

                        <div className='newStretchOrderSection_head'>
                            <div className='newStretchOrderSection_head_name'>
                                Ձգվող առաստաղ (Պատվերներ)
                            </div>
                        </div>

                        <div className=''>
                            <div className=''>

                                <table className="newPlintOrders" >
                                    <thead>
                                        <tr>
                                            <th>Կոդ </th>
                                            <th>Ամսաթիվ</th>
                                            <th>Անուն Ազգանուն</th>
                                            <th>Մարզ/Հասցե</th>
                                            <th>Հեռախոս</th>
                                            <th>Գումար</th>
                                            <th>Կանխավճար</th>
                                            <th>Մնացորդ</th>
                                            <th>Դիտել</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ordersList.map((e: any) => {
                                                let color = ""
                                                if (e.done) {
                                                    color = "green"
                                                } else if (e.payed === false) {
                                                    color = "lightBlue"
                                                } else {
                                                    color = "#ebdc52"
                                                }
                                                return (
                                                    <tr key={e._id}
                                                        style={{ backgroundColor: color }}
                                                    >
                                                        <td>
                                                            <p>
                                                                {e.code}
                                                            </p>
                                                        </td>
                                                        <td >
                                                            <p
                                                                style={{
                                                                    width: "100px",
                                                                }}>
                                                                {parseDate(e.date)}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p>
                                                                {e.buyer.name}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p>
                                                                {e.buyer.region} -/- {e.buyer.address}
                                                            </p>
                                                        </td>
                                                        <td >
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    border: "none",
                                                                    gap: "5px",
                                                                }}>
                                                                <p
                                                                    style={{
                                                                        minWidth: "100px"
                                                                    }}>
                                                                    {e.buyer.phone1}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td >
                                                            <p
                                                                style={{
                                                                    minWidth: "80px"
                                                                }}>
                                                                {e.balance}
                                                            </p>
                                                        </td>
                                                        <td >
                                                            <p
                                                                style={{
                                                                    minWidth: "80px"
                                                                }}>{e.prepayment}</p>
                                                        </td>
                                                        <td >
                                                            <p
                                                                style={{
                                                                    minWidth: "80px"
                                                                }}>
                                                                {e.groundTotal}
                                                            </p>
                                                        </td>
                                                        <td >
                                                            <button
                                                                onClick={() => viewOrder(e._id)}
                                                                onContextMenu={() => viewOrderNewWindow(e._id)}
                                                            >
                                                                Ավելին
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div> : null
            }
        </div>
    );
}