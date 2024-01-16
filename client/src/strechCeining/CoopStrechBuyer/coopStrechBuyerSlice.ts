import { createSlice } from "@reduxjs/toolkit";
import { newCoopStretchBuyer, allCoopStretchBuyer } from "./coopStrechBuyerApi";


export interface CoopStretchBuyer {
    id: number;
    name: string;
    phone: number;
    adress: string;
}

export interface CoopStretchBuyerState {
    arrCoopStretchBuyer: Array<CoopStretchBuyer>;
    coopBuyerStrech: CoopStretchBuyer
}
export const initialState: CoopStretchBuyerState = {
    arrCoopStretchBuyer: [],
    coopBuyerStrech: {} as CoopStretchBuyer
}
export const coopStretchBuyerSlice = createSlice({
    name: "coopStretchBuyer",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newCoopStretchBuyer.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.coopBuyerStrech = action.payload.buyer
                }
            })
            .addCase(allCoopStretchBuyer.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrCoopStretchBuyer = action.payload.coopBuyer
                }
            })
    }
})


export const selectCoopStretchBuyer = (state: any) => state.coopStretchBuyer;

export default coopStretchBuyerSlice.reducer;