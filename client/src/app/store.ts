import { configureStore, ThunkAction, Action, AnyAction } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice'
import orderReducer from '../features/order/orderSlice'
import cooperateReducer from '../features/cooperate/cooperateSlice'
import buyerReducer from '../features/buyer/buyerSlice'
import textureReducer from '../features/texture/textureSlice';
import stretchBuyerReducer from '../strechCeining/StrechBuyer/strechBuyerSlice';
import stretchWorkerReducer from '../strechCeining/StrechWorker/strechWorkerSlice';
import stretchWorkReducer from '../strechCeining/StrechWork/strechWorkSlice';
import stretchTextureReducer from '../strechCeining/strechTexture/strechTextureSlice';
import coopStrechOrderReducer from '../strechCeining/coopStrechOrder/coopStretchOrderSlice'
import userSphereReducer from '../features/userSphere/userSphereSlice'
import unytReducer from '../strechCeining/unyt/unytSlice'
import coopStretchBuyerReducer from '../strechCeining/CoopStrechBuyer/coopStrechBuyerSlice'
// '../strechCeining/coopStrechBuyer/coopStrechBuyerSlice'
import strechBardutyunReducer from '../strechCeining/strechBardutyun/strechBardutyunSlice';
import stretchProfilReducer from '../strechCeining/strechProfil/strechProfilSlice'
import LightPlatformReducer from '../strechCeining/strechLightPlatform/strechLightPlatformSlice'
import LightRingReducer from '../strechCeining/strechLightRing/strechLightRingSlice'
import stretchAdditional from '../strechCeining/strechAdditional/strechAdditionalSlice'
import stretchOrderReducer from '../strechCeining/stretchCeilingOrder/stretchOrderSlice'


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
    coopStrechOrder: coopStrechOrderReducer,
    userSphere: userSphereReducer,
    unyt: unytReducer,
    coopStretchBuyer: coopStretchBuyerReducer,
    stretchBardutyun: strechBardutyunReducer,
    stretchProfil: stretchProfilReducer,
    stretchLightPlatform: LightPlatformReducer,
    stretchLightRing: LightRingReducer,
    stretchAdditional: stretchAdditional,
    stretchOrder: stretchOrderReducer,

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



