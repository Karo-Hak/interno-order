import { useCookies } from "react-cookie"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectOrder } from "../../features/order/orderSlice"
import { selectUser } from "../../features/user/userSlice"
import { useNavigate } from "react-router-dom"
import { ChangeEvent, useEffect, useState } from "react"
import "./searchOrder.css"
import { searchOrder } from "../../features/order/orderApi"
import { allUser, userProfile } from "../../features/user/userApi"
import { searchFilter } from "../../logic/searchLogic"
import { WallpaperMenu } from "../../component/menu/WallpaperMenu"




export const SearchOrder: React.FC = (): JSX.Element => {
    const searchOrderRes = useAppSelector(selectOrder);
    const user = useAppSelector(selectUser);
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


    const [paymentMetod, setPaymentMetod] = useState<Array<string>>([""]);



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
        window.open('/order/' + id, '_blank');
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

    useEffect(() => {
        let initialState: string[] = [];
        if (searchOrderRes.arr.length > 0) {
            searchOrderRes.arr.forEach((order: { paymentMethod?: string }) => {
                if (order.paymentMethod) {
                    initialState.push(order.paymentMethod);
                }
            });
        }
        const uniqueArray = Array.from(new Set(initialState));
        setPaymentMetod(uniqueArray);
    }, [searchOrderRes]);




    const searchReset = () => {
        window.location.reload()
    }

    let totalSqMetr = 0;
    for (let i = 0; i < filteredOrder.length; i++) {
        totalSqMetr += filteredOrder[i].sqMetr;
    }
    totalSqMetr = +totalSqMetr.toFixed(3)
    let totalMetr = 0;
    for (let i = 0; i < filteredOrder.length; i++) {
        totalMetr += filteredOrder[i].metr;
    }
    totalMetr = +totalMetr.toFixed(3)
    let totalTotal = 0;
    for (let i = 0; i < filteredOrder.length; i++) {
        totalTotal += filteredOrder[i].total;
    }
    totalTotal = +totalTotal.toFixed(3)
    let totalPrepayment = 0;
    for (let i = 0; i < filteredOrder.length; i++) {
        totalPrepayment += filteredOrder[i].prepayment;
    }
    totalPrepayment = +totalPrepayment.toFixed(3)
    let totalGroundTotal = 0;
    for (let i = 0; i < filteredOrder.length; i++) {
        totalGroundTotal += filteredOrder[i].groundTotal;
    }
    totalGroundTotal = +totalGroundTotal.toFixed(3)
    let totalCooperateTotal = 0;
    for (let i = 0; i < filteredOrder.length; i++) {
        totalCooperateTotal += filteredOrder[i].cooperateTotal;
    }
    totalCooperateTotal = +totalCooperateTotal.toFixed(3)



    const filteredBuyer = searchOrderRes.arr.filter((obj: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (t.buyer._id === obj.buyer._id))
    );

    const filteredCoop = searchOrderRes.arr.filter((obj: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (t.cooperate._id === obj.cooperate._id))
    );
    const filteredTexture = searchOrderRes.arr.filter((obj: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (t.texture._id === obj.texture._id))
    );






    return (
        <div >
            <WallpaperMenu />
            <div className="profile ">
                <div className="profile_info">

                    <div className="profile_date">
                        <div className="buyer_label">
                            <label htmlFor="startDate">Ամսատիվ սկիզբ</label>
                            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="buyer_label">
                            <label htmlFor="endDate">Ամսաթիվ վերջ</label>
                            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>

                    </div>
                    <div className="profile_buyer_name">

                        <div className="buyer_label">
                            <label htmlFor="user">Օգտատեր</label>
                            <select id="user" onChange={selUser}>
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
                        <button className="btn btn1" onClick={searchReset}>Չեղարկել</button>
                    </div>
                </div>

                <div className="profile_info_1">

                    <div className="profile_info_1_1">
                        <div>
                            <h6>Ք/Մ - {totalSqMetr}</h6>
                            <h6>Գ/Ծ - {totalMetr}</h6>

                        </div>
                        <div>
                            <h6>Գումար - {totalTotal}</h6>
                            <h6>Վճարված - {totalPrepayment}</h6>
                        </div>
                        <div>

                            <h6>Մնացորդ - {totalGroundTotal}</h6>
                            <h6>Գործ․ Գումար - {totalCooperateTotal}</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div className="admin_profile_list">
                <table className="admin_profile_table" >
                    <thead >
                        <tr>
                            <th scope="col">Ամսաթիվ</th>
                            <th scope="col">
                                <select id="buyer" className="admin_tbl_select1" onChange={selBuyer}>
                                    <option value={0}>Գնորդ</option>
                                    {
                                        filteredBuyer && filteredBuyer.length > 0 ?
                                            filteredBuyer.map((e: any) => {
                                                return (
                                                    <option key={e._id} value={e.buyer._id}>{e.buyer.name} {e.buyer.surname}</option>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </select>
                            </th>
                            <th scope="col">
                                <select id="cooperate" className="admin_tbl_select2" onChange={selCooperate}>
                                    <option value={0}>Գործընկեր</option>
                                    {
                                        filteredCoop && filteredCoop.length > 0 ?
                                            filteredCoop.map((e: any) => {
                                                return (
                                                    <option key={e._id} value={e.cooperate._id}>{e.cooperate.name} {e.cooperate.surname}</option>
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
                                <select className="admin_tbl_select4" onChange={selGroundTotal}>
                                    <option value={0}>Մնացորդ</option>
                                    <option className="selectCoop" value={"payed"} >Վճարված</option>
                                    <option className="selectCoop" value={"credited"}>Պարտք</option>
                                </select>
                            </th>
                            <th scope="col">Գործ․ %</th>
                            <th scope="col">Գործ․ Գումար</th>
                            <th scope="col">
                                <select id="paymentMethod" className="admin_tbl_select4" onChange={selPaymentMethod}>
                                    <option value={0}>Վճ. եղանակ</option>
                                    {
                                        paymentMetod && paymentMetod.length > 0 ?
                                            paymentMetod.map((el: string) => {
                                                return <option key={el} className="selectCoop" value={el} >{el}</option>

                                            }) : null
                                    }

                                </select>
                            </th>
                            <th>
                                <select id="texture" className="admin_tbl_select3" onChange={selTexture}>
                                    <option value={0}>Տեսակ</option>

                                    {
                                        filteredTexture && filteredTexture.length > 0 ?
                                            filteredTexture.map((e: any) => {
                                                return (
                                                    <option key={e.texture._id} value={e.texture._id}>{e.texture.name}</option>
                                                )
                                            })
                                            :
                                            null
                                    }
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
                                        {
                                            e.texture ?
                                                <td>{e.texture.name}</td>
                                                :
                                                null

                                        }
                                        <td><button className="btn btn1" onClick={() => viewOrder(e._id)}>{e.comment.substring(0, 10)}</button></td>
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