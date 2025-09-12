import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { PlintMaterialSearchLogic } from "./PlintMaterialSearchLogic";
import PlintMaterialListSection from "./PlintMaterialListSection";
import AllPlintMaterialListSection from "./AllPlintMaterialListSection";
import { PlintMenu } from "../../../component/menu/PlintMenu";

export const ViewPlintMaterial: React.FC = (): JSX.Element => {

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
    const [orderSum, setOrderSum] = useState<number>(0)
    const [orderSalary, setOrderSalary] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const dateFilter = { startDate, endDate }
                // const stretchOrderResult = await dispatch(viewMaterialList({ dateFilter, cookies })).unwrap();
                // handleResult(stretchOrderResult);
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

    useEffect(() => {
        let sum = 0
        let salary = 0
        ordersList.map((e: any) => {
            sum += e.balance
            salary += e.salary
        })
        setOrderSum(sum)
        setOrderSalary(salary)

    }, [ordersList])

    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }

    const filterBuyer = () => {
        setSearchBuyer("")
        PlintMaterialSearchLogic(ordersListFilter, status, ordersList, setOrdersList, searchBuyer);
    }

    const clearSearch = () => {
        const clearBuyer = ""
        PlintMaterialSearchLogic(ordersListFilter, status, ordersList, setOrdersList, clearBuyer);
    }

    const [handleChecked, setHandleChecked] = useState<boolean>(false);

    function handleCheckbox(event: any) {
        setHandleChecked(event.target.checked);
    }



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
                        <label htmlFor="endDate">Խմբավորել</label>
                        <input id='checkboxAll' type="checkbox" onChange={handleCheckbox} />
                    </div>
                </div>
                <div style={{ marginTop: 40 }}>
                    <p> Գումար - {orderSum} - </p>
                </div>
                <div style={{ marginTop: 40, paddingLeft: 20 }}>
                    <p> Աշխատավարձ - {orderSalary} - </p>
                </div>
            </div>
            {
                !handleChecked ?
                    <PlintMaterialListSection ordersList={ordersList} parseDate={parseDate} />
                    :
                    <AllPlintMaterialListSection ordersList={ordersList} />

            }

        </div>
    )
}
