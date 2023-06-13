import { selectUser, User } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { useForm } from "react-hook-form";
import { newUser, userProfile } from "../../features/user/userApi";
import './adminProfile.css'
import { getAllCooperate, getCoopSpher, newCooperate } from "../../features/cooperate/cooperateApi";
import { Cooperate, selectCooperate } from "../../features/cooperate/cooperateSlice";
import { newBuyer } from "../../features/buyer/buyerApi";
import { addNewOrder, viewNewOrders } from "../../features/order/orderApi";
import { getAllTexture, newTexture } from "../../features/texture/textureApi";
import { selectTexture } from "../../features/texture/textureSlice";
import { selectOrder } from "../../features/order/orderSlice";

export const AdminProfile: React.FC = (): JSX.Element => {
    const user = useAppSelector(selectUser);
    const cooperate = useAppSelector(selectCooperate);
    const texture = useAppSelector(selectTexture);
    const newOrders = useAppSelector(selectOrder);
    const dispatch = useAppDispatch();
    const [cookies, setCookie] = useCookies(['access_token']);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
    }, [])

    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()


    ////// Add User///////
    const [addUserForm, setAddUserForm] = useState(false)
    const [role, setRole] = useState("user")
    const selectedRole = (e: any) => {
        setRole(e.target.value);
    }
    const openUserForm = () => {
        if (addBuyerForm === true) {
            setAddBuyerForm(false)
        }
        if (addCooperateForm === true) {
            setAddCooperateForm(false)
        }
        if (addTextureForm === true) {
            setAddTextureForm(false)
        }
        if (addOrderForm === true) {
            setAddOrderForm(false)
        }
        if (newOrdersForm === true) {
            setNewOrdersForm(false)
        }
        // if (addCoopSpherForm === true) {
        //     setAddCoopSpherForm(false)
        // }
        setAddUserForm(true)
    }
    const saveUser = async (user: User) => {
        user = { ...user, role: role, username: user.username.toLowerCase() }
        dispatch(newUser({ user, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }
    ///////////////////////

    ///////////Add Buyer////////
    const [addBuyerForm, setAddBuyerForm] = useState(false)
    const openBuyerForm = () => {
        if (addUserForm === true) {
            setAddUserForm(false)
        }
        if (addCooperateForm === true) {
            setAddCooperateForm(false)
        }
        if (addTextureForm === true) {
            setAddTextureForm(false)
        }
        if (addOrderForm === true) {
            setAddOrderForm(false)
        }
        if (newOrdersForm === true) {
            setNewOrdersForm(false)
        }
        // if (addCoopSpherForm === true) {
        //     setAddCoopSpherForm(false)
        // }
        setAddBuyerForm(true)
    }
    const saveBuyer = (buyer: any) => {
        buyer = { ...buyer, phone: buyer.phone.replace(/\s/g, "") }
        dispatch(newBuyer({ buyer, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }
    ///////////////////////

    ///////////Add Cooperate////////
    const [addCooperateForm, setAddCooperateForm] = useState(false)
    const openCooperateForm = () => {
        dispatch(getCoopSpher(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate('/')
            }
        })

        if (addUserForm === true) {
            setAddUserForm(false)
        }
        if (addBuyerForm === true) {
            setAddBuyerForm(false)
        }
        if (addTextureForm === true) {
            setAddTextureForm(false)
        }
        if (addOrderForm === true) {
            setAddOrderForm(false)
        }
        if (newOrdersForm === true) {
            setNewOrdersForm(false)
        }
        // if (addCoopSpherForm === true) {
        //     setAddCoopSpherForm(false)
        // }
        setAddCooperateForm(true)
    }
    const saveCooperate = (cooperate: any) => {
        cooperate = { ...cooperate, phone: cooperate.phone.replace(/\s/g, "") }
        dispatch(newCooperate({ cooperate, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()

    }
    ///////////////////////

    ///////////Add textur////////
    const [addTextureForm, setAddTextureForm] = useState(false)

    const openTextureForm = () => {
        if (addUserForm === true) {
            setAddUserForm(false)
        }
        if (addBuyerForm === true) {
            setAddBuyerForm(false)
        }
        if (addCooperateForm === true) {
            setAddCooperateForm(false)
        }
        if (addOrderForm === true) {
            setAddOrderForm(false)
        }
        if (newOrdersForm === true) {
            setNewOrdersForm(false)
        }
        // if (addCoopSpherForm === true) {
        //     setAddCoopSpherForm(false)
        // }

        setAddTextureForm(true)
    }
    const saveTexture = (texture: any) => {
        dispatch(newTexture({ texture, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }

    ///////////////////////

    // ///////////Add Cooperate////////
    // const [addCoopSpherForm, setAddCoopSpherForm] = useState(false)

    // const openCoopSpher = () => {
    //     if (addUserForm === true) {
    //         setAddUserForm(false)
    //     }
    //     if (addBuyerForm === true) {
    //         setAddBuyerForm(false)
    //     }
    //     if (addCooperateForm === true) {
    //         setAddCooperateForm(false)
    //     }
    //     if (addTexturForm === true) {
    //         setAddTexturForm(false)
    //     }
    //     setAddCoopSpherForm(true)
    // }
    // const saveCoopSpher = () => {
    //     window.location.reload()
    // }

    //////////////////// Add Order ////////////////

    const [addOrderForm, setAddOrderForm] = useState(false)
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [discount, setDiscount] = useState<number>(0)
    const [prepayment, setPrepayment] = useState<number>(0)
    const [price, setPrice] = useState(9000)
    const [coopRate, setCoopRate] = useState<number>(0)
    const [coopTotal, setCoopTotal] = useState<number>(0)
    const [coop, setCoop] = useState<any>()

    const sq = (height / 100) * (weight / 100);
    const squer = +sq.toFixed(2);
    const totalOrder = parseInt(((squer * price) - ((squer * price) * discount) / 100).toString())
    const sum = totalOrder - prepayment


    const [checked, setChecked] = useState(false);

    function handleCheckboxChange(event: any) {
        setChecked(event.target.checked);

    };

    useEffect(() => {
        if (checked) {
            if (coop && coop.name === "Sard") {
                setPrice(6300);
            }
        } else {
            setPrice(9000)
        }
    }, [checked]);


    const openOrderForm = () => {
        if (addUserForm === true) {
            setAddUserForm(false)
        }
        if (addBuyerForm === true) {
            setAddBuyerForm(false)
        }
        if (addCooperateForm === true) {
            setAddCooperateForm(false)
        }
        if (addTextureForm === true) {
            setAddTextureForm(false)
        }
        if (newOrdersForm === true) {
            setNewOrdersForm(false)
        }

        dispatch(getAllCooperate(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate('/')
            }
        })

        dispatch(getAllTexture(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate('/')
            }
        })

        setAddOrderForm(true)
    }

    function cooperateDiscount(event: ChangeEvent<HTMLSelectElement>): void {
        const coopPrice = cooperate.arrCooperate.find((e: Cooperate) => e._id === event.target.value)
        if (coopPrice) {
            setCoopRate(coopPrice?.cooperateRate)
            setCoopTotal(((+coopPrice?.cooperateRate * totalOrder) / 100))
            setCoop(coopPrice)
        } else {
            setCoopRate(0)
            setCoopTotal(0)
            setCoop("")
        }
    }


    const newOrder = (order: any) => {
        const buyer = { name: order.buyerName, phone: order.buyerPhone, adress: order.buyerAdress }
        if (order.cooperateId === "0") {
        }
        const newOrder = {
            oldId: Math.floor(Math.random() * 1000000000),
            height: +order.height,
            weight: +order.weight,
            discount: +order.discount,
            price: price,
            prepayment: +order.prepayment,
            picCode: order.picCode,
            total: +totalOrder,
            sqMetr: +squer,
            cooperateTotal: coopTotal,
            groundTotal: sum,
            user: user.profile.userId,
            cooperate: order.cooperateId,
            texture: order.texture,
            comment: order.comment
        }
        dispatch(addNewOrder({ buyer, newOrder, cookies })).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate('/')
                console.log(errors);

            }
        })
        if (newOrder.oldId) {
            navigate("/newOrder/" + newOrder.oldId)
        }


    }
    //////////////////////////////

    //////////////////// new Orders hashvetvutyun ////////////////
    const [newOrdersForm, setNewOrdersForm] = useState<boolean>(false)
    const openNewOrdersForm = () => {
        if (addUserForm === true) {
            setAddUserForm(false)
        }
        if (addBuyerForm === true) {
            setAddBuyerForm(false)
        }
        if (addCooperateForm === true) {
            setAddCooperateForm(false)
        }
        if (addTextureForm === true) {
            setAddTextureForm(false)
        }
        if (addOrderForm === true) {
            setAddOrderForm(false)
        }
        setNewOrdersForm(true)
        dispatch(viewNewOrders(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate('/')
            }
        })

    }
    const parseDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        return `${dateObj.getDate()} - ${dateObj.getMonth() + 1} - ${dateObj.getFullYear()} `;
    }

    const viewOrder = (id: any) => {
        navigate("/order/" + id)

    }

    const search = () => {
        navigate("/searchOrder")
    }


    return (
        <>

            <div className="profile">
                <div className="divBtn">
                    <button className="btn" onClick={openUserForm}>Ավելացնել Օգտատեր</button>
                    <button className="btn" onClick={openBuyerForm}>Ավելացնել Գնորդ</button>
                    <button className="btn" onClick={openCooperateForm}>Ավելացնել Գործընկեր</button>
                    <button className="btn" onClick={openTextureForm}>Ավելացնել Տեսակ</button>
                    {/* <button className="btn" onClick={openCoopSpher}>Add cooperation sphere</button> */}
                    <button className="btn" onClick={openOrderForm}>Ավելացնել Պատվեր</button>
                    <button className="btn" onClick={openNewOrdersForm}>Դիտել Նոր Պատվերներ</button>
                    <button className="btn" onClick={search}>Դիտել Պատվերները</button>
                </div>
            </div>
            {/* ////////// add User /////////// */}
            {
                addUserForm ?
                    <div className="profile">
                        <form className="divBtn" onSubmit={handleSubmit(saveUser)}>
                            <div style={{ display: "flex", gap: "5px" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label htmlFor="userName">Անուն</label>
                                    <input id="userName" className="userInput" type="text" placeholder="Name" {...register("name", { required: true })} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label htmlFor="userSւrname">Ազգանուն</label>
                                    <input id="userSւrname" className="userInput" type="text" placeholder="Surname" {...register("surname", { required: true })} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label htmlFor="login">Լոգին</label>
                                    <input id="login" className="userInput" type="text" placeholder="User name" {...register("username", { required: true })} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label htmlFor="password">Գաղտնաբառ</label>
                                    <input id="password" className="userInput" type="text" placeholder="Password" {...register("password", { required: true })} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label htmlFor="role">Տեսակ</label>
                                    <select id="role" className="userInput" onChange={selectedRole}>
                                        <option value={"user"}>User</option>
                                        <option value={"admin"}>Admin</option>
                                    </select>
                                </div>
                            </div>
                            <button className="btn" >Save</button>
                        </form>
                        <button className="btn btn-lg" onClick={() => window.location.reload()} >X</button>
                    </div>
                    :
                    null
            }
            {/* ////////// add Buyer /////////// */}
            {
                addBuyerForm ?
                    <div className="profile">
                        <form className="divBtn" onSubmit={handleSubmit(saveBuyer)}>
                            <div>
                                <input className="userInput" type="text" placeholder="Name" {...register("name", { required: true })} />
                                <input className="userInput" type="text" placeholder="Phone" {...register("phone", { required: true })} />
                                <input className="userInput" type="text" placeholder="Adress" {...register("adress", { required: true })} />
                            </div>
                            <button className="btn" >Save</button>
                        </form>
                        <button className="btn btn-lg" onClick={() => window.location.reload()} >X</button>
                    </div>
                    :
                    null
            }
            {/* ////////// add Cooperate /////////// */}
            {
                addCooperateForm ?
                    <div className="profile">
                        <form className="divBtn" onSubmit={handleSubmit(saveCooperate)}>
                            <div>
                                <input className="userInput" type="text" placeholder="Name" {...register("name", { required: true })} />
                                <input className="userInput" type="text" placeholder="Surname" {...register("surname")} />
                                <input className="userInput" type="text" placeholder="Phone" {...register("phone")} />
                                <input className="userInput" type="text" placeholder="Cooperate Rate" {...register("cooperateRate", { required: true })} />
                                {
                                    cooperate?.cooperationSphere && cooperate.cooperationSphere.length > 0 ?

                                        <select className="userInput form-select mt-3" aria-label="Default select example">
                                            {
                                                cooperate.cooperationSphere.map((e: any) => {
                                                    return (
                                                        <option key={e._id}
                                                            value={e._id}
                                                            {...register("cooperationSphere", { required: true })}>
                                                            {e.name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                        :
                                        null
                                }
                            </div>
                            <button className="btn" >Save</button>
                        </form>
                        <button className="btn btn-lg" onClick={() => window.location.reload()} >X</button>
                    </div>
                    :
                    null
            }
            {/* ////////// add textur /////////// */}
            {
                addTextureForm ?
                    <div className="profile">
                        <form className="divBtn" onSubmit={handleSubmit(saveTexture)}>
                            <div>
                                <input className="userInput" type="text" placeholder="Name" {...register("name", { required: true })} />
                            </div>
                            <button className="btn" >Save</button>
                        </form>
                        <button className="btn btn-lg" onClick={() => window.location.reload()} >X</button>
                    </div>
                    :
                    null
            }
            {/* ////////// add Coop Spher /////////// */}
            {/* {
                addCoopSpherForm ?
                    <div className="profile">
                        <form className="divBtn" onSubmit={handleSubmit(saveCoopSpher)}>
                            <div>
                                <input className="userInput" type="text" placeholder="Name" {...register("name", { required: true })} />
                            </div>
                            <button className="btn" >Save</button>
                        </form>
                        <button className="btn btn-lg" onClick={() => window.location.reload()} >X</button>
                    </div>
                    :
                    null
            } */}
            {
                addOrderForm ?
                    <form className="orderDiv" onSubmit={handleSubmit(newOrder)}>
                        <div className="formdiv">
                            <div className="formSelect">

                                <div className="buyerDiv">
                                    Buyer
                                    <div>
                                        <input className="userInput" type="text" placeholder="Buyer Name" {...register("buyerName", { required: true })} />
                                    </div>
                                    <div>
                                        <input className="userInput" type="text" placeholder=" Buyer Phone" {...register("buyerPhone", { required: true })} />
                                    </div>
                                    <div>
                                        <input className="userInput" type="text" placeholder="Buyer Adress" {...register("buyerAdress", { required: true })} />
                                    </div>
                                </div>
                                <div className="buyerDiv">
                                    Wallpaper
                                    <div className="wallpaperDiv">
                                        <div>
                                            <div>
                                                <input className="userInput" type="number" placeholder="Weight" {...register("weight", { required: true })} onChange={(e) => setHeight(+e.target.value)} />
                                            </div>
                                            <div>
                                                <input className="userInput" type="number" placeholder="Height" {...register("height", { required: true })} onChange={(e) => setWeight(+e.target.value)} />
                                            </div>
                                            <div>
                                                <input className="userInput" type="number" placeholder="SQ/METR" value={squer} readOnly {...register("sqMetr", { required: true })} />
                                            </div>
                                        </div>
                                        <div >
                                            <div>
                                                <input className="userInput" type="number" placeholder="Price" value={price} {...register("price", { required: true })} onChange={(e) => setPrice(+e.target.value)} />
                                            </div>
                                            <div>
                                                <input className="userInput" type="number" placeholder="discount" {...register("discount")} onChange={(e) => setDiscount(+e.target.value)} />
                                            </div>
                                            <div>
                                                <input className="userInput" type="number" placeholder="total" value={totalOrder}  {...register("total", { required: true })} onChange={(e) => totalOrder === +e.target.value} />
                                            </div>
                                        </div>
                                        <div >
                                            <div>
                                                <input className="userInput" type="text" placeholder="Picture Code" {...register("picCode")} />
                                            </div>
                                            <div>
                                                <textarea className="userInput" placeholder="Comment" {...register("comment")}></textarea>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="buyerDiv">
                                    Cooperate
                                    <div>
                                        <select className="selectCoop" {...register("cooperateId", { required: true })} onChange={cooperateDiscount} >
                                            <option className="selectCoop" key={0} value={0}>Select Cooperat</option>
                                            {
                                                cooperate?.arrCooperate && cooperate.arrCooperate.length > 0 ?
                                                    cooperate.arrCooperate.map((e: any) => {
                                                        return <option key={e._id} value={e._id}
                                                        >{e.name} {e.surname}</option>
                                                    })
                                                    : null
                                            }
                                        </select>
                                    </div>
                                    <div>
                                        <input className="userInput" type="number" placeholder="Cooperate Rate" value={coopRate} readOnly onChange={(e) => setCoopRate(+e.target.value)} />
                                    </div>
                                    <div>
                                        <input className="userInput" type="number" placeholder="Cooperate Totla" value={coopTotal} {...register("cooperateTotal")} />
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                onChange={handleCheckboxChange}
                                            />
                                            Отметить меня
                                        </label>
                                    </div>
                                </div>
                            </div >
                            <div>
                                <button className="btn btn-lg" onClick={() => window.location.reload()} >X</button>
                            </div>

                        </div>
                        <div className="">
                            <select className="selectCoop" {...register("texture", { required: true })}  >
                                {
                                    texture?.arrTexture && texture.arrTexture.length > 0 ?
                                        texture.arrTexture.map((e: any) => {
                                            return <option key={e._id} value={e._id}
                                            >{e.name}</option>
                                        })
                                        : null
                                }
                            </select>
                            <input className="userInput" type="number" placeholder="prepayment"  {...register("prepayment")} onChange={(e) => setPrepayment(+e.target.value)} />
                            <input className="userInput" type="number" placeholder="Sum" value={sum} {...register("groundTotal")} readOnly />
                        </div>

                        <div><button className="btn">SAVE</button></div>

                    </form>
                    :
                    null
            }

            {/* /////////////// new Orders//////////////////////// */}

            {
                newOrdersForm ?
                    <div className="profile">
                        {
                            newOrders?.arr && newOrders.arr.length > 0 ?

                                <table className="table" style={{ color: "white" }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Ամսաթիվ</th>
                                            <th scope="col">Գնորդ</th>
                                            <th scope="col">Երկարություն/Լայնություն</th>
                                            <th scope="col">Ք/Մ</th>
                                            <th scope="col">Նկար</th>
                                            <th scope="col">Կարգավիճակ</th>
                                            <th scope="col">Վեջնաժամկետ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            newOrders.arr.map((e: any) => {


                                                return (
                                                    <tr key={e._id}>
                                                        <td >{parseDate(e.date)}</td>
                                                        <td>{e.buyer.name}</td>
                                                        <td>{e.weight} x {e.height}</td>
                                                        <td>{e.sqMetr}</td>
                                                        <td>{e.picCode}</td>
                                                        <td>{e.status}</td>
                                                        <td>{parseDate(e.deadline)}</td>
                                                        <td><button className="btn" onClick={() => viewOrder(e._id)}>View</button></td>

                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                :
                                <p></p>
                        }
                    </div>
                    :
                    null
            }


        </>
    );
}

