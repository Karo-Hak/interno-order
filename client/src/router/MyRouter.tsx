import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "../page/login/Login"
import { Menu } from "../component/menu/Menu"
import { AdminProfile } from "../page/profile/AdminProfile"
import { Order } from "../page/order/Order"
import { SearchOrder } from "../page/search/SearchOrder"
import { NewOrder } from "../page/newOrder/NewOrder"
import { AddUser } from "../page/addUser/AddUser"
import { AddBuyer } from "../page/addBuyer/AddBuyer"
import { AddCooperate } from "../page/addCooperate/AddCooperate"
import { AddTexture } from "../page/addTexture/AddTexture"

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
                <Route path="/order/:id" element={<Order />}></Route>
                <Route path="/newOrder/:id" element={<NewOrder />}></Route>
                <Route path="/searchOrder" element={<SearchOrder />}></Route>
                <Route path="/addUser" element={<AddUser />}></Route>
                <Route path="/addBuyer" element={<AddBuyer />}></Route>
                <Route path="/addCooperate" element={<AddCooperate />}></Route>
                <Route path="/addTexture" element={<AddTexture />}></Route>


                {/*    <Route path="/order/:id" element={<Product />}></Route> */}
            </Routes>
        </BrowserRouter>
    )
}