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
    return (<div className="loginPage">

        <div className="login">

            <form onSubmit={handleSubmit(save)} className="login_form">
                <div className="loginLine">
                    <label>User Name</label>
                    <input  {...register("username", { required: true })} placeholder="User Name" />
                    {errors.username && <p>User Name</p>}
                </div>
                <div className="loginLine">
                    <label>Password</label>
                    <input  {...register("password", { required: true })} placeholder="Password" />
                    {errors.password && <p>Password</p>}
                </div>
                <div className="loginLine">
                    <label>Sphere</label>
                    {
                        userSphere?.arrUserSphere && userSphere.arrUserSphere?.length > 0 ?
                            <select className="" onChange={selectedSphere}>
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
                <button className="btn" >Login</button>
            </form>
        </div>
    </div>)
}
