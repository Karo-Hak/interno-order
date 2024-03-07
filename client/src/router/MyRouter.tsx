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
import { StretchBardutyun } from "../strechCeining/pages/addStretchCeilingBardutyun/StretchBardutyun"
import { StretchProfil } from "../strechCeining/pages/addStretchCeilingProfil/StretchProfil"
import { StretchLightPlatform } from "../strechCeining/pages/addStretchLightPlatform/StretchLightPlatform"
import { StretchLightRing } from "../strechCeining/pages/addStretchLightRing/StretchLightRing"
import { CoopStretchOrder } from "../strechCeining/pages/addCoopStretchCeilingOrder/coopStretchCeilingOrder"
import { TagStretchCeiling } from "../strechCeining/pages/tagStretchCeiling/TagStretchCeiling"
import { TagStretchOrderx } from "../strechCeining/pages/addTagStretchCeilingOrder/TagStretchOrder"
import { StretchAdditional } from "../strechCeining/pages/addStretchCeilingAdditional/StretchAdditional"
import { EditTagStretchOrder } from "../strechCeining/pages/editTagStretchCeilingOrder/EditTagStretchOrder"
import { ViewStretchOrder } from "../strechCeining/pages/viewStretchOrder/ViewStretchOrder"
import { StretchWorker } from "../strechCeining/pages/addStretchWorker/AddStretchWorker"
import { StretchWork } from "../strechCeining/pages/addStretchWork/AddStretchWork"

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
                    {/* <Route path="/home" element={<Login />}></Route> */}
                    <Route path="/wallpaper" element={<AdminProfile />}></Route>
                    <Route path="/order/:id" element={<Order />}></Route>
                    <Route path="/newOrder/:id" element={<NewOrder />}></Route>
                    <Route path="/wallpaper/searchOrder" element={<SearchOrder />}></Route>
                    <Route path="/addUser" element={<AddUser />}></Route>
                    <Route path="/wallpaper/addBuyer" element={<AddBuyer />}></Route>
                    <Route path="/wallpaper/addCooperate" element={<AddCooperate />}></Route>
                    <Route path="/wallpaper/addTexture" element={<AddTexture />}></Route>
                    <Route path="/updateOrderInfo/:id" element={<UpdateOrderInfo />}></Route>
                    <Route path="/stretchceilingcoop" element={<CoopStretchCeiling />}></Route>
                    <Route path="/stretchTexture" element={<StretchTexture />}></Route>
                    <Route path="/stretchceiling" element={<TagStretchCeiling />}></Route>
                    <Route path="/stretchceiling/addTagStretchOrder" element={<TagStretchOrderx />}></Route>
                    <Route path="/tagstretchceiling/addTagStretchBuyer" element={<StretchBuyer />}></Route>
                    <Route path="/tagstretchceiling/addTagStretchWorker" element={<StretchWorker />}></Route>
                    <Route path="/stretchceiling/addTagStretchWorker" element={<StretchWork />}></Route>
                    <Route path="/coopstretchceiling/addCoopStretchBuyer" element={<CoopStretchBuyer />}></Route>
                    <Route path="/stretchceiling/addStretchBardutyun" element={<StretchBardutyun />}></Route>
                    <Route path="/stretchceiling/addStretchAdditional" element={<StretchAdditional />}></Route>
                    <Route path="/stretchceiling/addStretchProfil" element={<StretchProfil />}></Route>
                    <Route path="/stretchceiling/addStretchLightPlatform" element={<StretchLightPlatform />}></Route>
                    <Route path="/stretchceiling/addStretchLightRing" element={<StretchLightRing />}></Route>
                    <Route path="/stretchceiling/editStretchOrder/:id" element={<EditTagStretchOrder />}></Route>
                    <Route path="/stretchceiling/viewStretchOrder/:id" element={<ViewStretchOrder />}></Route>
                    <Route path="/coopStretchceiling/addCoopStretchOrder" element={<CoopStretchOrder />}></Route>

                </Routes>
            </BrowserRouter>
        </>
    )
}