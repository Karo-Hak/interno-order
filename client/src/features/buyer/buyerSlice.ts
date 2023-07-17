import { createSlice } from "@reduxjs/toolkit";
import { allBuyer, newBuyer } from "./buyerApi";


export interface Buyer {
    id: number;
    name: string;
    phone: string;
    adress: string;
}

export interface BuyerState {
    arrBuyer: Array<Buyer>;
    buyer: Buyer
}
export const initialState: BuyerState = {
    arrBuyer: [],
    buyer: {} as Buyer
}
export const buyerSlice = createSlice({
    name: "buyer",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newBuyer.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.buyer = action.payload.buyer
                }
            })
            .addCase(allBuyer.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrBuyer = action.payload
                }
            })
    }
})


export const selectBuyer = (state: any) => state.buyer;

export default buyerSlice.reducer;