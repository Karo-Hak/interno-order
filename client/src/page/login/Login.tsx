import { User } from "../../features/user/userSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
// import './add.scss'
import './login.css'
import { loginUser } from "../../features/user/userApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCookies } from 'react-cookie'
import { ChangeEvent, useEffect, useState } from "react";
import { getAllUserSphere } from "../../features/userSphere/userSphereApi";
import { selectUserSphere } from "../../features/userSphere/userSphereSlice";



export const Login: React.FC = (): JSX.Element => {
    let navigate = useNavigate();
    const dispatch = useAppDispatch()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<User>()
    const [cookies, setCookie] = useCookies(['access_token']);
    const [sphere, setSphere] = useState("")
    const userSphere = useAppSelector(selectUserSphere)



    useEffect(() => {
        dispatch(getAllUserSphere()).unwrap().then(res => {
            if ("error" in res) {
                // setCookie("access_token", '', { path: '/' })
                // navigate("/")
            }
            if (res) {
                setSphere(res[0].name)

            }
        })
    }, [])

    function selectedSphere(event: ChangeEvent<HTMLSelectElement>): void {
        setSphere(event.target.value);
    }

    const save = async (us: User) => {
        dispatch(loginUser(us)).unwrap().then(res => {
            if (res.role === "admin") {
                setCookie("access_token", res.access_token, { path: '/' })
                navigate('/' + sphere.replaceAll(" ", '').toLowerCase())
            } else if (res.sphere.includes(sphere)) {
                setCookie("access_token", res.access_token, { path: '/' })
                navigate('/' + sphere.replaceAll(" ", '').toLowerCase())
            } else {
                alert("you don't have permission to access on " + sphere)
            }

        })
    }
    return (<div className="log">

        <div className="loginDiv">

            <form onSubmit={handleSubmit(save)}>
                <div>
                    <label>User Name</label>
                    <input className="loginInput" {...register("username", { required: true })} placeholder="User Name" />
                    {errors.username && <p>User Name</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input className="loginInput" {...register("password", { required: true })} placeholder="Password" />
                    {errors.password && <p>Password</p>}
                </div>
                <div>
                    <label>Sphere</label>
                    {
                        userSphere?.arrUserSphere && userSphere.arrUserSphere?.length > 0 ?
                            <select className="loginInput" onChange={selectedSphere}>
                                {
                                    userSphere.arrUserSphere.map((e: any, i: any) => {
                                        return (
                                            <option key={e._id}>{e.name}</option>
                                        )
                                    })
                                }
                            </select>
                            : null
                    }
                </div>
                <button className="buttonLogin" >Login</button>
            </form>
        </div>
    </div>)
}
