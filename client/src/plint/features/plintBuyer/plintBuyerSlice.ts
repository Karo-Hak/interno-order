import { createSlice } from "@reduxjs/toolkit";
import { allPlintBuyer, newPlintBuyer } from "./plintBuyerApi";


export interface PlintBuyerProps {
    _id: string;
    name: string;
    phone1: string;
    phone2: string;
    region: string;
    address: string;
    discount: number;
}

export interface PlintBuyerState {
    arrPlintBuyer: Array<PlintBuyerProps>;
    plintBuyer: PlintBuyerProps
}
export const initialState: PlintBuyerState = {
    arrPlintBuyer: [],
    plintBuyer: {} as PlintBuyerProps
}
export const plintBuyerSlice = createSlice({
    name: "plintBuyer",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newPlintBuyer.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.plintBuyer = action.payload.buyer
                }
            })
            .addCase(allPlintBuyer.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrPlintBuyer = action.payload.coopBuyer
                }
            })
    }
})


export const selectPlintBuyer = (state: any) => state.plintBuyer;

export default plintBuyerSlice.reducer;