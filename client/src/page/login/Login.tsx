import { User } from "../../features/user/userSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
// import './add.scss'
import './login.css'
import { loginUser } from "../../features/user/userApi";
import { useAppDispatch } from "../../app/hooks";
import { useCookies } from 'react-cookie'


export const Login: React.FC = (): JSX.Element => {
    let navigate = useNavigate();
    const dispatch = useAppDispatch()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<User>()

    const [cookies, setCookie] = useCookies(['access_token']);

    const save = async (us: User) => {
        dispatch(loginUser(us)).unwrap().then(res => {
            if (res) {
                setCookie("access_token", res.access_token, { path: '/' })
                navigate('/admine/profile')
            } else {
                navigate('/')
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
                <button className="buttonLogin" >Login</button>
            </form>
        </div>
    </div>)
}
