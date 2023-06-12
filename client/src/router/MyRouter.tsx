import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "../page/login/Login"
import { Menu } from "../component/menu/Menu"
import { AdminProfile } from "../page/profile/AdminProfile"
import { UserProfile } from "../page/profile/UserProfile"
import { Order } from "../page/order/Order"
import { SearchOrder } from "../page/search/SearchOrder"
import { NewOrder } from "../page/newOrder/NewOrder"

// import { AllUser } from "../page/AllUser"






export const MyRouter: React.FC = (): JSX.Element => {
    return (
        <BrowserRouter>
            <div className='divManue'>
                <Menu></Menu>
            </div>
            <Routes>
                <Route path="/" element={<Login />}></Route>
                <Route path="/admine/profile" element={<AdminProfile />}></Route>
                <Route path="/user/profile" element={<UserProfile />}></Route>
                <Route path="/order/:id" element={<Order />}></Route>
                <Route path="/newOrder/:id" element={<NewOrder />}></Route>
                <Route path="/searchOrder" element={<SearchOrder />}></Route>
                {/*    <Route path="/login" element={<LoginUser />}></Route>
                <Route path="/order/:id" element={<Product />}></Route> */}
            </Routes>
        </BrowserRouter>
    )
}