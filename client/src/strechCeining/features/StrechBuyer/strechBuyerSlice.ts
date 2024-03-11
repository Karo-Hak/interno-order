import { createSlice } from "@reduxjs/toolkit";
import { newStretchBuyer, allStretchBuyer } from "./strechBuyerApi";


export interface StretchBuyer {
    id: number;
    name: string;
    phone: string;
}

export interface StretchBuyerState {
    arrStretchBuyer: Array<StretchBuyer>;
    buyStrech: StretchBuyer
}
export const initialState: StretchBuyerState = {
    arrStretchBuyer: [],
    buyStrech: {} as StretchBuyer
}
export const stretchBuyerSlice = createSlice({
    name: "stretchBuyer",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newStretchBuyer.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.buyStrech = action.payload.buyer
                }
            })
            .addCase(allStretchBuyer.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchBuyer = action.payload.buyer
                }
            })
    }
})


export const selectStretchBuyer = (state: any) => state.stretchBuyer;

export default stretchBuyerSlice.reducer;