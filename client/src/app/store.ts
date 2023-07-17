import { configureStore, ThunkAction, Action, AnyAction } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice'
import orderReducer from '../features/order/orderSlice'
import cooperateReducer from '../features/cooperate/cooperateSlice'
import buyerReducer from '../features/buyer/buyerSlice'
import textureReducer from '../features/texture/textureSlice';
import stretchBuyerReducer from '../strechCeining/StrechBuyer/strechBuyerSlice';
import stretchTextureReducer from '../strechCeining/strechTexture/strechTextureSlice';
import strechOrderReducer from '../strechCeining/strechOrder/strechOrderSlice'
import userSphereReducer from '../features/userSphere/userSphereSlice'
import unytReducer from '../strechCeining/unyt/unytSlice'
import coopStretchBuyerReducer from '../strechCeining/CoopStrechBuyer/coopStrechBuyerSlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    order: orderReducer,
    cooperate: cooperateReducer,
    buyer: buyerReducer,
    texture: textureReducer,
    stretchBuyer: stretchBuyerReducer,
    stretchTexture: stretchTextureReducer,
    strechOrder: strechOrderReducer,
    userSphere: userSphereReducer,
    unyt: unytReducer,
    coopStretchBuyer: coopStretchBuyerReducer
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



