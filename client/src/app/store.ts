// src/app/store.ts
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import orderReducer from '../features/order/orderSlice';
import cooperateReducer from '../features/cooperate/cooperateSlice';
import buyerReducer from '../features/buyer/buyerSlice';
import textureReducer from '../features/texture/textureSlice';
import stretchBuyerReducer from '../strechCeining/features/StrechBuyer/strechBuyerSlice';
import stretchWorkerReducer from '../strechCeining/features/StrechWorker/strechWorkerSlice';
import stretchWorkReducer from '../strechCeining/features/StrechWork/strechWorkSlice';
import stretchTextureReducer from '../strechCeining/features/strechTexture/strechTextureSlice';
import coopCeilingOrdersReducer from '../strechCeining/coopStretch/features/coopCeilingOrder/cooppCeilingOrderSlice';
import userSphereReducer from '../features/userSphere/userSphereSlice';
import unytReducer from '../strechCeining/unyt/unytSlice';
import coopStretchBuyerReducer from '../strechCeining/coopStretch/features/coopStrechBuyer/coopStrechBuyerSlice';
import strechBardutyunReducer from '../strechCeining/features/strechBardutyun/strechBardutyunSlice';
import stretchProfilReducer from '../strechCeining/features/strechProfil/strechProfilSlice';
import LightPlatformReducer from '../strechCeining/features/strechLightPlatform/strechLightPlatformSlice';
import LightRingReducer from '../strechCeining/features/strechLightRing/strechLightRingSlice';
import stretchAdditional from '../strechCeining/features/strechAdditional/strechAdditionalSlice';
import stretchOrderReducer from '../strechCeining/features/stretchCeilingOrder/stretchOrderSlice';
import categoryReducer from '../strechCeining/features/category/categorySlice';
import productReducer from '../strechCeining/features/product/productSlice';
import plintReducer from '../plint/features/plint/plintSlice';
import plintBuyerReducer from '../plint/features/plintBuyer/plintBuyerSlice';
import plintAgentReducer from '../plint/features/plintAgent/plintAgentSlice';
import plintDebetKreditReducer from '../plint/features/plintDebetKredit/plintDebetKreditSlice';
import stretchWalletReducer from '../strechCeining/features/wallet/stretchWalletSlice';
import plintProductionReducer from '../plint/features/plintProduction/plintProductionSlice';
import plintRetailOrderReducer from '../plint/features/plintRetailOrder/plintRetailOrderSlice';
import plintWholesaleOrderReducer from '../plint/features/plintWholesaleOrder/plintWholesaleOrderSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,
    order: orderReducer,
    cooperate: cooperateReducer,
    buyer: buyerReducer,
    texture: textureReducer,
    stretchBuyer: stretchBuyerReducer,
    stretchWorker: stretchWorkerReducer,
    stretchWork: stretchWorkReducer,
    stretchTexture: stretchTextureReducer,
    userSphere: userSphereReducer,
    unyt: unytReducer,
    coopStretchBuyer: coopStretchBuyerReducer,
    stretchBardutyun: strechBardutyunReducer,
    stretchProfil: stretchProfilReducer,
    stretchLightPlatform: LightPlatformReducer,
    stretchLightRing: LightRingReducer,
    stretchAdditional,
    stretchOrder: stretchOrderReducer,
    category: categoryReducer,
    product: productReducer,
    plint: plintReducer,
    plintBuyer: plintBuyerReducer,
    plintAgent: plintAgentReducer,
    plintDebetKredit: plintDebetKreditReducer,
    stretchWallet: stretchWalletReducer,
    coopCeilingOrders: coopCeilingOrdersReducer,
    plintProduction: plintProductionReducer,
    plintRetailOrder: plintRetailOrderReducer,
    plintWholesaleOrder: plintWholesaleOrderReducer,

  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
