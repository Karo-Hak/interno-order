import { useCookies } from "react-cookie"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectBuyer } from "../../features/buyer/buyerSlice"
import { selectCooperate } from "../../features/cooperate/cooperateSlice"
import { selectOrder } from "../../features/order/orderSlice"
import { selectTexture } from "../../features/texture/textureSlice"
import { selectUser } from "../../features/user/userSlice"
import { useNavigate } from "react-router-dom"
import { ChangeEvent, useEffect, useState } from "react"
import "./searchOrder.css"
import { searchOrder } from "../../features/order/orderApi"
import { allUser, userProfile } from "../../features/user/userApi"
import { allBuyer } from "../../features/buyer/buyerApi"
import { getAllCooperate } from "../../features/cooperate/cooperateApi"
import { getAllTexture } from "../../features/texture/textureApi"
import { searchFilter } from "../../logic/searchLogic"




export const SearchOrder: React.FC = (): JSX.Element => {
    const searchOrderRes = useAppSelector(selectOrder);
    const user = useAppSelector(selectUser);
    const buyer = useAppSelector(selectBuyer);
    const cooperate = useAppSelector(selectCooperate);
    const texture = useAppSelector(selectTexture);
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate()
    const currentDate = new Date();
    const [startDate, setStartDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 2).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2).toISOString().split('T')[0]);
    const [filteredOrder, setFilteredOrder] = useState(searchOrderRes.arr);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedBuyer, setSelectedBuyer] = useState("");
    const [selectedCooperate, setSelectedCooperate] = useState("");
    const [selectedTexture, setSelectedTexture] = useState("");
    const [selectPaymentMethod, setSelectPaymentMethod] = useState("")
    const [selectGroundTotal, setSelectGroundTotal] = useState("")

    function selUser(event: ChangeEvent<HTMLSelectElement>): void {
        setSelectedUser(event.target.value);
    }
    function selBuyer(event: ChangeEvent<HTMLSelectElement>): void {
        setSelectedBuyer(event.target.value);
    }

    function selCooperate(event: ChangeEvent<HTMLSelectElement>): void {
        setSelectedCooperate(event.target.value);
    }
    function selTexture(event: ChangeEvent<HTMLSelectElement>): void {
        setSelectedTexture(event.target.value);
    }
    function selPaymentMethod(event: ChangeEvent<HTMLSelectElement>): void {
        setSelectPaymentMethod(event.target.value)
    }
    function selGroundTotal(event: ChangeEvent<HTMLSelectElement>): void {
        setSelectGroundTotal(event.target.value)

    }

    useEffect(() => {
        dispatch(allUser(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
        dispatch(allBuyer(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
        dispatch(getAllCooperate(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
        dispatch(getAllTexture(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
    }, [])

    const searchRes = async () => {
        const dateFilter = { startDate, endDate }
        dispatch(searchOrder({ dateFilter, cookies })).unwrap().then(res => {
            setFilteredOrder(searchFilter(res, selectedUser, selectedBuyer, selectedCooperate, selectedTexture, selectPaymentMethod, selectGroundTotal))
            if ("error" in res) {
                alert(res.error)
            }
        })

    }
    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} / ${dateObj.getMonth() + 1} / ${dateObj.getFullYear()} `;
    }
    const viewOrder = (id: any) => {
        navigate("/order/" + id)

    }

    useEffect(() => {
        searchRes()
    }, [
        selectedBuyer,
        selectedUser,
        selectedCooperate,
        startDate,
        endDate,
        selectedTexture,
        selectPaymentMethod,
        selectGroundTotal
    ]);


    const searchReset = () => {
        // setSelectPaymentMethod("0");
        // setSelectedBuyer("0");
        // setSelectedUser("0");
        // setSelectedCooperate("0");
        // setSelectedTexture("0");
        // setStartDate(new Date(2000, 0, 1).toISOString());
        // setEndDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2).toISOString().split('T')[0])
        window.location.reload()
    }

    return (
        <div >
            <div className="divMenu">
                <div style={{ display: "flex", gap: "5px" }}>
                    <div>
                        <label htmlFor="startDate">Ամսատիվ սկիզբ</label>
                        <input id="startDate" type="date" className="form-control selectFilter" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="endDate">Ամսաթիվ վերջ</label>
                        <input id="endDate" type="date" className=" form-control selectFilter" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="user">Օգտատեր</label>
                        <select id="user" className="form-control selectFilter" onChange={selUser}>
                            <option value={0}>Select</option>

                            {
                                user?.arrUser && user.arrUser.length > 0 ?
                                    user.arrUser.map((e: any) => {
                                        return (
                                            <option key={e._id} value={e._id}>{e.name} {e.surname}</option>
                                        )
                                    })
                                    :
                                    null
                            }
                        </select>
                    </div>

                    <div>
                        <label htmlFor="texture">Տեսակ</label>
                        <select id="texture" className="form-control selectFilter" onChange={selTexture}>
                            <option value={0}>Select</option>

                            {
                                texture?.arrTexture && texture.arrTexture.length > 0 ?
                                    texture.arrTexture.map((e: any) => {
                                        return (
                                            <option key={e._id} value={e._id}>{e.name}</option>
                                        )
                                    })
                                    :
                                    null
                            }
                        </select>
                    </div>
                </div>
                <button className="btn" onClick={searchReset}>Չեղարկել</button>
            </div>
            <div className="divTable">
                <table className="table" style={{ color: "white" }}>
                    <thead>
                        <tr>
                            <th scope="col">Ամսաթիվ</th>
                            <th scope="col">
                                <select id="buyer" className="seltype" onChange={selBuyer}>
                                    <option value={0}>Գնորդ</option>
                                    {
                                        buyer?.arrBuyer && buyer.arrBuyer.length > 0 ?
                                            buyer.arrBuyer.map((e: any) => {
                                                return (
                                                    <option key={e._id} value={e._id}>{e.name} {e.surname}</option>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </select>
                            </th>
                            <th scope="col">
                                <select id="cooperate" className="seltype" onChange={selCooperate}>
                                    <option value={0}>Գործընկեր</option>
                                    {
                                        cooperate?.arrCooperate && cooperate.arrCooperate.length > 0 ?
                                            cooperate.arrCooperate.map((e: any) => {
                                                return (
                                                    <option key={e._id} value={e._id}>{e.name} {e.surname}</option>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </select>
                            </th>
                            <th scope="col">Եր/Լա</th>
                            <th scope="col">Ք/Մ</th>
                            <th scope="col">Գ/Ծ</th>
                            <th scope="col">Գին</th>
                            <th scope="col">Զեղչ %</th>
                            <th scope="col">Գումար</th>
                            <th scope="col">Վճարված</th>
                            <th scope="col">
                                <select className="seltype" onChange={selGroundTotal}>
                                    <option value={0}>Մնացորդ</option>
                                    <option className="selectCoop" value={"payed"} >Վճարված</option>
                                    <option className="selectCoop" value={"credited"}>Պարտք</option>
                                </select>
                            </th>
                            <th scope="col">Գործ․ %</th>
                            <th scope="col">Գործ․ Գումար</th>
                            <th scope="col">
                                <select id="paymentMethod" className="seltype" onChange={selPaymentMethod}>
                                    <option value={0}>Վճ. եղանակ</option>
                                    <option className="selectCoop" value={"cash"} >Կանխիկ</option>
                                    <option className="selectCoop" value={"transfer"}>Փոխանցում</option>
                                    <option className="selectCoop" value={"pos"}>Պոս Տերմինալ</option>
                                    <option className="selectCoop" value={"credit"}>Ապառիկ</option>
                                    <option className="selectCoop" value={"inecoPay"}>Ինեկո Փեյ</option>
                                    <option className="selectCoop" value={"idram"}>Իդրամ</option>
                                </select></th>
                            <th scope="col">ԱՎԵԼԻՆ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredOrder.map((e: any) => {


                                return (
                                    <tr key={e._id}>
                                        <td >{parseDate(e.date)}</td>
                                        <td>{e.buyer.name}</td>
                                        {
                                            e?.cooperate ?
                                                <td>{e.cooperate.name} {e.cooperate.surname}</td>
                                                :
                                                <td></td>
                                        }
                                        <td>{e.weight} x {e.height}</td>
                                        <td>{e.sqMetr}</td>
                                        <td>{e.metr}</td>
                                        <td>{e.price}</td>
                                        <td>{e.discount}</td>
                                        <td>{e.total}</td>
                                        <td>{e.prepayment}</td>
                                        <td>{e.groundTotal}</td>
                                        {
                                            e?.cooperate ?
                                                <td>{e.cooperate.cooperateRate}</td>
                                                :
                                                <td></td>
                                        }
                                        <td>{e.cooperateTotal}</td>
                                        <td>{e.paymentMethod}</td>
                                        <td><button className="btn" onClick={() => viewOrder(e._id)}>Դիտել</button></td>

                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div >
    )
}