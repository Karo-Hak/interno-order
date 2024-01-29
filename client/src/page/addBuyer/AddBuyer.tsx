import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { allBuyer, newBuyer } from "../../features/buyer/buyerApi";
import { selectBuyer } from "../../features/buyer/buyerSlice";
import './addBuyer.css'
import { selectUser } from "../../features/user/userSlice";
import { userProfile } from "../../features/user/userApi";



export const AddBuyer: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const buyer = useAppSelector(selectBuyer);
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['access_token']);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()

    useEffect(() => {

        dispatch(allBuyer(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })

        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
                alert(res)
            }
        })
    }, [])

    const saveBuyer = (buyer: any) => {
        buyer = { ...buyer, phone: buyer.phone.replace(/\s/g, "") }
        dispatch(newBuyer({ buyer, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }
    const addBuyer = () => {
        navigate('/wallpaper/addBuyer');
    }
    const addCooperate = () => {
        if (user.profile.role === "admin") {
            navigate("/wallpaper/addCooperate")
        }
    }
    const addTexture = () => {
        if (user.profile.role === "admin") {
            navigate("/wallpaper/addTexture")
        }
    }
    const search = () => {
       navigate("/wallpaper/searchOrder")
    }
    const openOrderForm = ()=>{
        navigate("/wallpaper")
    }

    return (
        <div className="addBuyer">
            
            <div className="admin_profile">
                <div >
                    {/* <button className="btn" onClick={openCoopSpher}>Add cooperation sphere</button> */}
                    <button className="btn" onClick={openOrderForm}>Ավելացնել Պատվեր</button>
                    <button className="btn" onClick={addBuyer} >Ավելացնել Գնորդ</button>
                    {
                        user.profile && user.profile.role === "admin" ?
                            <>
                                <button className="btn" onClick={addCooperate} >Ավելացնել Գործընկեր</button>
                                <button className="btn" onClick={addTexture} >Ավելացնել Տեսակ</button>
                            </>
                            :
                            null
                    }
                    <button className="btn" onClick={search} >Դիտել Պատվերները</button>
                </div>
            </div>
            <div className="addBuyer_profile">
                <form  onSubmit={handleSubmit(saveBuyer)}>
                    <div className="addBuyer_profile_info">
                        <div className="addBuyer_profile_info_user">
                            <label htmlFor="buyerName">Անուն</label>
                            <input id="buyerName" className="userInput" type="text" placeholder="Name" {...register("name", { required: true })} />
                        </div>
                        <div className="addBuyer_profile_info_user">
                            <label htmlFor="buyerPhone">Հեռախես</label>
                            <input id="buyerPhone" className="userInput" type="text" placeholder="Phone" {...register("phone", { required: true })} />
                        </div>
                        <div className="addBuyer_profile_info_user" >
                            <label htmlFor="buyerAdress">Հասցե</label>
                            <input id="buyerAdress" className="userInput" type="text" placeholder="Adress" {...register("adress", { required: true })} />
                        </div>
                    </div>
                    <div className="addBuyerButton"> 

                    <button className="btn btn1" >Գրանցել</button>
                    </div>
                </form>
            </div >
            {
                buyer?.arrBuyer && buyer.arrBuyer.length > 0 ?
                    <div className="admin_profile_list">
                        <table className="admin_profile_table" >
                            <thead>
                                <tr>
                                    <th scope="col">Անուն</th>
                                    <th scope="col">Հեռախես</th>
                                    <th scope="col">Հասցե</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    buyer.arrBuyer.map((e: any) => {
                                        return (
                                            <tr key={e._id}>
                                                <td>{e.name}</td>
                                                <td>{e.phone}</td>
                                                <td>{e.adress}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    :
                    null
            }
        </div >
    )
}