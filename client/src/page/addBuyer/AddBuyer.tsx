import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { allBuyer, newBuyer } from "../../features/buyer/buyerApi";
import { selectBuyer } from "../../features/buyer/buyerSlice";



export const AddBuyer: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const buyer = useAppSelector(selectBuyer);
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
console.log(buyer.arrBuyer);

    return (
        <div>
            <div className="profile">
                <form className="divBtn" onSubmit={handleSubmit(saveBuyer)}>
                    <div style={{ display: "flex", gap: "5px" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="buyerName">Անուն</label>
                            <input id="buyerName" className="userInput" type="text" placeholder="Name" {...register("name", { required: true })} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="buyerPhone">Հեռախես</label>
                            <input id="buyerPhone" className="userInput" type="text" placeholder="Phone" {...register("phone", { required: true })} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="buyerAdress">Հասցե</label>
                            <input id="buyerAdress" className="userInput" type="text" placeholder="Adress" {...register("adress", { required: true })} />
                        </div>
                    </div>
                    <button className="btn" >Գրանցել</button>
                </form>
            </div >
            {
                buyer?.arrBuyer && buyer.arrBuyer.length > 0 ?
                    <div className="profile">
                        <table className="table" style={{ color: "white" }}>
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