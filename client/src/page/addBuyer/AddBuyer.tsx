import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { allBuyer, newBuyer } from "../../features/buyer/buyerApi";
import { selectBuyer } from "../../features/buyer/buyerSlice";
import './addBuyer.css';
import { selectUser } from "../../features/user/userSlice";
import { userProfile } from "../../features/user/userApi";
import { WallpaperMenu } from "../../component/menu/WallpaperMenu";

export const AddBuyer: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const buyer = useAppSelector(selectBuyer);
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['access_token']);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

    useEffect(() => {
        dispatch(allBuyer(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' });
                navigate("/");
            }
        });

        dispatch(userProfile(cookies)).unwrap().then(res => {
            if ("error" in res) {
                alert(res);
            }
        });
    }, [dispatch, cookies, setCookie, navigate]);

    const saveBuyer = (buyer: any) => {
        buyer = { ...buyer, phone: buyer.phone.replace(/\s/g, "") };
        dispatch(newBuyer({ buyer, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error);
            }
        });
        window.location.reload();
    };

    return (
        <div>
            <WallpaperMenu />
            <div style={{ margin: "20px" }}>
                <form onSubmit={handleSubmit(saveBuyer)}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div className="divLabel">
                            <label htmlFor="buyerName">Անուն</label>
                            <input id="buyerName" type="text" placeholder="Name" {...register("name", { required: true })} />
                            {errors.name && <span>Պարտադիր լրացման դաշտ</span>}
                        </div>
                        <div className="divLabel">
                            <label htmlFor="buyerPhone">Հեռախես</label>
                            <input id="buyerPhone" type="text" placeholder="Phone" {...register("phone", { required: true })} />
                            {errors.phone && <span>Պարտադիր լրացման դաշտ</span>}
                        </div>
                        <div className="divLabel">
                            <label htmlFor="buyerAdress">Հասցե</label>
                            <input id="buyerAdress" type="text" placeholder="Adress" {...register("adress", { required: true })} />
                            {errors.adress && <span>Պարտադիր լրացման դաշտ</span>}
                        </div>
                        <button type="submit">Գրանցել</button>
                    </div>
                </form>
            </div>
            {
                buyer?.arrBuyer && buyer.arrBuyer.length > 0 &&
                <div style={{ margin: "20px" }}>
                    <table className="tableName">
                        <thead>
                            <tr>
                                <th scope="col">Անուն</th>
                                <th scope="col">Հեռախես</th>
                                <th scope="col">Հասցե</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buyer.arrBuyer.map((e: any) => (
                                <tr key={e._id}>
                                    <td>{e.name}</td>
                                    <td>{e.phone}</td>
                                    <td>{e.adress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
};
