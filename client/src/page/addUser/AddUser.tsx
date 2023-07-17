import { ChangeEvent, useEffect, useState } from "react";
import { allUser, newUser } from "../../features/user/userApi";
import { User, selectUser } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { getUserSphere } from "../../features/userSphere/userSphereApi";
import { useSelector } from "react-redux";
import { UserSphere, selectUserSphere } from "../../features/userSphere/userSphereSlice";



export const AddUser: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const userSphere = useSelector(selectUserSphere)
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['access_token']);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()
    const [role, setRole] = useState("user")
    const [sphere, setSphere] = useState<Array<string>>([])

    useEffect(() => {

        dispatch(allUser(cookies)).unwrap().then(res => {
            if ("error" in res) {
                setCookie("access_token", '', { path: '/' })
                navigate("/")
            }
        })
        dispatch(getUserSphere(cookies)).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
            }
        })
    }, [])

    function selectedRole(event: ChangeEvent<HTMLSelectElement>): void {
        setRole(event.target.value);
    }
    function chooseSphere(event: any): void {

        if (sphere.includes(event.target.value)) {
            const idx = sphere.indexOf(event.target.value);
            if (idx > -1) {
                sphere.splice(idx, 1);
            }
        } else {
            sphere.push(event.target.value);
        }

    }



    const saveUser = async (user: User) => {
        user = { ...user, role: role, username: user.username.toLowerCase(), sphere: sphere }
        dispatch(newUser({ user, cookies })).unwrap().then(res => {
            if ("error" in res) {
                alert(res.error)
            }
        });
        window.location.reload()
    }

    return (
        <div >
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
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="role">Ոլորտ</label>

                            {
                                userSphere?.arrUserSphere && userSphere?.arrUserSphere.length > 0 ?
                                    userSphere?.arrUserSphere.map((e: any, i: any) => {
                                        return (
                                            <label htmlFor="role" key={e._id} > <input type="checkbox" value={e.name} key={i} onChange={chooseSphere} />{e.name}</label>
                                        )
                                    })
                                    : null
                            }

                        </div>
                    </div>
                    <button className="btn" >Գրանցել</button>
                </form>
            </div>
            {
                user?.arrUser && user.arrUser.length > 0 ?
                    <div className="profile">
                        <table className="table" style={{ color: "white" }}>
                            <thead>
                                <tr>
                                    <th scope="col">Անուն</th>
                                    <th scope="col">Ազգանուն</th>
                                    <th scope="col">Տեսակ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    user.arrUser.map((e: any) => {
                                        return (
                                            <tr key={e._id}>
                                                <td>{e.name}</td>
                                                <td>{e.surname}</td>
                                                <td>{e.role}</td>
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
        </div>
    )
}