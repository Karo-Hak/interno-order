import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice'
import orderReducer from '../features/order/orderSlice'
import cooperateReducer from '../features/cooperate/cooperateSlice'
import buyerReducer from '../features/buyer/buyerSlice'
import textureSlice from '../features/texture/textureSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    order: orderReducer,
    cooperate: cooperateReducer,
    buyer: buyerReducer,
    texture: textureSlice
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
