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
import { StretchTexture } from "../strechCeining/pages/addStretchCeilingTexture/StretchTexture"
import { StretchBuyer } from "../strechCeining/pages/addStretchBuyer/AddStretchBuyer"
import { CoopStretchBuyer } from "../strechCeining/coopStretch/pages/addCoopStretchBuyer/AddCoopStretchBuyer"
import { StretchBardutyun } from "../strechCeining/pages/addStretchCeilingBardutyun/StretchBardutyun"
import { StretchProfil } from "../strechCeining/pages/addStretchCeilingProfil/StretchProfil"
import { StretchLightPlatform } from "../strechCeining/pages/addStretchLightPlatform/StretchLightPlatform"
import { StretchLightRing } from "../strechCeining/pages/addStretchLightRing/StretchLightRing"
import { TagStretchCeiling } from "../strechCeining/pages/tagStretchCeiling/TagStretchCeiling"
import TagStretchOrder from "../strechCeining/pages/addTagStretchCeilingOrder/TagStretchOrder"
import { StretchAdditional } from "../strechCeining/pages/addStretchCeilingAdditional/StretchAdditional"
import { EditTagStretchOrder } from "../strechCeining/pages/editTagStretchCeilingOrder/EditTagStretchOrder"
import { ViewStretchOrder } from "../strechCeining/pages/viewStretchOrder/ViewStretchOrder"
import { StretchWorker } from "../strechCeining/pages/addStretchWorker/AddStretchWorker"
import { StretchWork } from "../strechCeining/pages/addStretchWork/AddStretchWork"
import { AddWallpaperOrder } from "../page/addWallpaperOrder/AddWallpaperOrder"
import { StockProfile } from "../strechCeining/stock/stockProfile/StockProfile"
import { AddCategory } from "../strechCeining/stock/addCategory/AddCategory"
import { AddProduct } from "../strechCeining/stock/addProduct/AddProduct"
import { Input_output } from "../strechCeining/stock/in_out/Input_output"
import { HomePage } from "../page/homePage/HomePage"
import { ViewStretchOrdersList } from "../strechCeining/pages/viewStretchOrdersList/ViewStretchOrdersList"
import { ViewMaterial } from "../strechCeining/pages/material/ViewMaterial"
import { ViewDebetKredit } from "../strechCeining/pages/debetKredit/ViewDebetKredit"
import { PlintHonePage } from "../plint/pages/plintHomePage/PlintHomePage"
import { AddPlint } from "../plint/pages/addPlint/AddPlint"
import { PlintBuyer } from "../plint/pages/addPlintBuyer/AddPlintBuyer"
import { PlintRetailOrder } from "../plint/pages/addPlintRetailOrder/PlintRetailOrder"
import { ViewPlintOrder } from "../plint/pages/viewPlintOrder/ViewPlintOrder"
import { EditPlintOrder } from "../plint/pages/editPlintOrder/EditPlintOrder"
import { StockPlint } from "../plint/pages/stockPlint/StockPlint"
import { InputOutputPlint } from "../plint/pages/stock_in_out/Input_outputPlint"
import { AddPlintCoop } from "../plint/pages/addPlintCoop/AddPlintCoop"
import { ViewPlintOrdersList } from "../plint/pages/viewPlintOrdersList/ViewPlintOrdersList"
import { ViewPlintDebetKredit } from "../plint/pages/plintDebetKredit/ViewPlintDebetKredit"
import { PlintProduction } from "../plint/pages/addPlintProduction/AddPlintProduction"
import { PlintCoopOrder } from "../plint/pages/addPlintCoopOrder/PlintCoopOrder"
import { ViewPlintMaterial } from "../plint/pages/plintMaterial/ViewPlintMaterial"
import { AddPlintAgent } from "../plint/pages/addPlintAgent/AddPlintAgent"
import { StretchBuyerWallet } from "../strechCeining/pages/stretchWallet/StretchBuyerWallet"
import AddCoopCeilinOrder from "../strechCeining/coopStretch/pages/addCoopCeilingOrder/AddCoopCeilinOrder"
import CoopMonthlyReport from "../strechCeining/coopStretch/pages/report/CoopMonthlyReport"
import CoopOrderDetails from "../strechCeining/coopStretch/pages/viewCoopOrder/CoopOrderDetails"
import CoopOrderList from "../strechCeining/coopStretch/pages/viewCoopOrderList/CoopOrderList"
import { CoopBuyerWallet } from "../strechCeining/coopStretch/pages/stretchWallet/CoopBuyerWallet"
import AddCoopReturn from "../strechCeining/coopStretch/pages/coopReturn/AddCoopReturn"
import ViewCoopReturnList from "../strechCeining/coopStretch/pages/coopReturn/ViewCoopReturnList"
import ViewCoopReturnDetails from "../strechCeining/coopStretch/pages/coopReturn/ViewCoopReturnDetails"



export const MyRouter: React.FC = (): JSX.Element => {
    return (
        <>
            <BrowserRouter>
                <div className='divManue'>
                    <Menu></Menu>
                </div>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/home" element={<HomePage />}></Route>
                    <Route path="/wallpaper" element={<AdminProfile />}></Route>
                    <Route path="/wallpaper/addOrder" element={<AddWallpaperOrder />}></Route>
                    <Route path="/order/:id" element={<Order />}></Route>
                    <Route path="/newOrder/:id" element={<NewOrder />}></Route>
                    <Route path="/wallpaper/searchOrder" element={<SearchOrder />}></Route>
                    <Route path="/addUser" element={<AddUser />}></Route>
                    <Route path="/wallpaper/addBuyer" element={<AddBuyer />}></Route>
                    <Route path="/wallpaper/addCooperate" element={<AddCooperate />}></Route>
                    <Route path="/wallpaper/addTexture" element={<AddTexture />}></Route>
                    <Route path="/updateOrderInfo/:id" element={<UpdateOrderInfo />}></Route>

                    <Route path="/stretchTexture" element={<StretchTexture />}></Route>
                    <Route path="/stretchceiling" element={<TagStretchCeiling />}></Route>
                    <Route path="/stretchceiling/addTagStretchOrder" element={<TagStretchOrder />}></Route>
                    <Route path="/tagstretchceiling/addTagStretchBuyer" element={<StretchBuyer />}></Route>
                    <Route path="/tagstretchceiling/addTagStretchWorker" element={<StretchWorker />}></Route>



                    <Route path="/stretchceiling/addTagStretchWork" element={<StretchWork />}></Route>
                    <Route path="/stretchceiling/addStretchBardutyun" element={<StretchBardutyun />}></Route>
                    <Route path="/stretchceiling/addStretchAdditional" element={<StretchAdditional />}></Route>
                    <Route path="/stretchceiling/addStretchProfil" element={<StretchProfil />}></Route>
                    <Route path="/stretchceiling/addStretchLightPlatform" element={<StretchLightPlatform />}></Route>
                    <Route path="/stretchceiling/addStretchLightRing" element={<StretchLightRing />}></Route>
                    <Route path="/stretchceiling/editStretchOrder/:id" element={<EditTagStretchOrder />}></Route>
                    <Route path="/stretchceiling/viewStretchOrder/:id" element={<ViewStretchOrder />}></Route>
                    <Route path="/stretchceiling/viewStretchOrdersList" element={<ViewStretchOrdersList />}></Route>
                    <Route path="/stretchceiling/viewMaterial" element={<ViewMaterial />}></Route>
                    <Route path="/stretchceiling/debet-kredit" element={<ViewDebetKredit />}></Route>
                    <Route path="/stretchceiling/stretch-wallet" element={<StretchBuyerWallet />}></Route>



                    <Route path="/coopStretchceiling/AddCoopStretchBuyer" element={<CoopStretchBuyer />}></Route>
                    <Route path="/coopStretchceiling/addCoopStretchOrder" element={<AddCoopCeilinOrder />} />
                    <Route path="/coopStretchceiling/report" element={<CoopMonthlyReport />} />
                    <Route path="/coopStretchceiling/viewCoopStretchOrder/:id" element={<CoopOrderDetails />} />
                    <Route path="/coopStretchceiling/viewCoopOrderList" element={<CoopOrderList />} />
                    <Route path="/coopstretchceiling/coopBuyerWallet" element={<CoopBuyerWallet />}></Route>
                    <Route path="/coopStretchceiling/addCoopReturn" element={<AddCoopReturn />} />
                    <Route path="/coopStretchceiling/viewCoopReturnList" element={<ViewCoopReturnList />} />
                    <Route path="/coopStretchceiling/return/:id" element={<ViewCoopReturnDetails />} />


                    <Route path="/plint/homePage" element={<PlintHonePage />}></Route>
                    <Route path="/plint/addPlint" element={<AddPlint />}></Route>
                    <Route path="/plint/plintBuyer" element={<PlintBuyer />}></Route>
                    <Route path="/plint/plintCoop" element={<AddPlintCoop />}></Route>
                    <Route path="/plint/plintAgent" element={<AddPlintAgent />}></Route>
                    <Route path="/plint/plintRetailOrder" element={<PlintRetailOrder />}></Route>
                    <Route path="/plint/plintWholesaleOrder" element={<PlintCoopOrder />}></Route>
                    <Route path="/plint/plintProduction" element={<PlintProduction />}></Route>
                    <Route path="/plint/viewPlintOrder/:id" element={<ViewPlintOrder />}></Route>
                    <Route path="/plint/editPlintOrder/:id" element={<EditPlintOrder />}></Route>
                    <Route path="/plint/stockPlint" element={<StockPlint />}></Route>
                    <Route path="/plint/inputOutputPlint" element={<InputOutputPlint />}></Route>
                    <Route path="/plint/viewPlintOrdersList" element={<ViewPlintOrdersList />}></Route>
                    <Route path="/plint/debet-kredit" element={<ViewPlintDebetKredit />}></Route>
                    <Route path="/plint/viewMaterial" element={<ViewPlintMaterial />}></Route>




                    <Route path="/stock" element={<StockProfile />}></Route>
                    <Route path="/addCategory" element={<AddCategory />}></Route>
                    <Route path="/addProduct" element={<AddProduct />}></Route>
                    <Route path="/in_out" element={<Input_output />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}