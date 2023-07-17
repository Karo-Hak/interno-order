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
import { UpdateOrderInfo } from "../page/order/UpdateOrder"
import { CoopStretchCeiling } from "../strechCeining/pages/coopStretchCeiling/CoopStretchCeiling"
import { StretchTexture } from "../strechCeining/pages/addStretchCeilingTexture/StretchTexture"
import { StretchBuyer } from "../strechCeining/pages/addStretchBuyer/AddStretchBuyer"
import { CoopStretchBuyer } from "../strechCeining/pages/addCoopStretchBuyer/AddCoopStretchBuyer"

// import { AllUser } from "../page/AllUser"






export const MyRouter: React.FC = (): JSX.Element => {
    return (
        <>
            <BrowserRouter>
                <div className='divManue'>
                    <Menu></Menu>
                </div>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/wallpaper" element={<AdminProfile />}></Route>
                    <Route path="/order/:id" element={<Order />}></Route>
                    <Route path="/newOrder/:id" element={<NewOrder />}></Route>
                    <Route path="/searchOrder" element={<SearchOrder />}></Route>
                    <Route path="/addUser" element={<AddUser />}></Route>
                    <Route path="/addBuyer" element={<AddBuyer />}></Route>
                    <Route path="/addCooperate" element={<AddCooperate />}></Route>
                    <Route path="/addTexture" element={<AddTexture />}></Route>
                    <Route path="/updateOrderInfo/:id" element={<UpdateOrderInfo />}></Route>
                    <Route path="/stretchceilingcoop" element={<CoopStretchCeiling />}></Route>
                    <Route path="/stretchTexture" element={<StretchTexture />}></Route>
                    <Route path="/stretchceiling/addStretchBuyer" element={<StretchBuyer />}></Route>
                    <Route path="/coopstretchceiling/addCoopStretchBuyer" element={<CoopStretchBuyer />}></Route>

                </Routes>
            </BrowserRouter>
        </>
    )
}