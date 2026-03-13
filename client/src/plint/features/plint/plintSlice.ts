import { createSlice } from '@reduxjs/toolkit';
import { addNewPlint, adjustPlintStock, getAllPlint, updatePlintPrice } from './plintApi';

export interface PlintProps {
  _id: string;
  name: string;
  retailPriceAMD: number;
  wholesalePriceAMD: number;
  stockBalance: number; // остаток
}

export interface PlintState {
  arrPlint: PlintProps[];
  plint: PlintProps | null;
}

const initialState: PlintState = {
  arrPlint: [],
  plint: null,
};

export const plintSlice = createSlice({
  name: 'plint',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewPlint.fulfilled, (state, action: any) => {
        const payload = action.payload;
        if (!payload || payload.error) return;
        state.plint = payload;
        if (payload._id) state.arrPlint.unshift(payload);
      })
      .addCase(getAllPlint.fulfilled, (state, action: any) => {
        const payload = action.payload;
        if (!payload || payload.error) return;
        if (Array.isArray(payload.plint)) {
          state.arrPlint = payload.plint;
        } else if (Array.isArray(payload)) {
          state.arrPlint = payload;
        }
      })
      .addCase(updatePlintPrice.fulfilled, (state, action: any) => {
        const payload = action.payload;
        if (!payload || payload.error) return;
        const i = state.arrPlint.findIndex((x) => x._id === payload._id);
        if (i !== -1) {
          state.arrPlint[i] = {
            ...state.arrPlint[i],
            retailPriceAMD: payload.retailPriceAMD,
            wholesalePriceAMD: payload.wholesalePriceAMD,
          };
        }
      })
      .addCase(adjustPlintStock.fulfilled, (state, action: any) => {
        const updated = action.payload;
        if (!updated?._id) return;
        const i = state.arrPlint.findIndex(x => x._id === updated._id);
        if (i !== -1) {
          state.arrPlint[i].stockBalance = updated.stockBalance;
        }
      });

  },
});

export const selectPlint = (state: any) => state.plint;
export default plintSlice.reducer;
