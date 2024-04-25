import { createSlice } from "@reduxjs/toolkit";
import { newCoopStretchBuyer, allCoopStretchBuyer } from "./coopStrechBuyerApi";


export interface CoopStretchBuyerProps {
    _id: string;
    name: string;
    phone1: string;
    phone2: string;
    region: string;
    address: string;
}

export interface CoopStretchBuyerState {
    arrCoopStretchBuyer: Array<CoopStretchBuyerProps>;
    coopBuyerStrech: CoopStretchBuyerProps
}
export const initialState: CoopStretchBuyerState = {
    arrCoopStretchBuyer: [],
    coopBuyerStrech: {} as CoopStretchBuyerProps
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