import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { StretchMenu } from "../../../component/menu/StretchMenu";
import { viewDebetKredit } from "../../features/debetKredit/debetKreditApi";
import { DebetKreditSection } from "./DebetKreditSection"; // ← именованный импорт
import { DebetKreditSearchLogic } from "./DebetKreditLogic";

export const ViewDebetKredit: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [ordersListFilter, setOrdersListFilter] = useState<any[]>([]);
  const [orderType, setOrderType] = useState<string>("");
  const [searchBuyer, setSearchBuyer] = useState<string>("");

  const currentDate = new Date();
  const [startDate, setStartDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 2).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2)
      .toISOString()
      .split("T")[0]
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const dateFilter = { startDate, endDate };
      const result = await dispatch(viewDebetKredit({ dateFilter, cookies })).unwrap();
      handleResult(result);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleResult = (result: any) => {
    if ("error" in result) {
      alert(result?.error || "Սխալ");
      setCookie("access_token", "", { path: "/" });
      navigate("/");
    } else {
      setOrdersList(result.data || []);
      setOrdersListFilter(result.data || []);
    }
  };

  const parseDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
  };

  const filterBuyer = () => {
    DebetKreditSearchLogic(ordersListFilter, orderType, ordersList, setOrdersList, searchBuyer);
  };

  const clearSearch = () => {
    setSearchBuyer("");
    DebetKreditSearchLogic(ordersListFilter, orderType, ordersList, setOrdersList, "");
  };

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
            <label htmlFor="stretchBuyer">Գնորդ</label>
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

      <DebetKreditSection ordersList={ordersList} parseDate={parseDate} cookies={cookies} />
    </div>
  );
};
