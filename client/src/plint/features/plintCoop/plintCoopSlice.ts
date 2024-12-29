import { createSlice } from "@reduxjs/toolkit";
import { allPlintCoop, newPlintCoop } from "./plintCoopApi";


export interface PlintCoopProps {
    _id: string;
    name: string;
    phone1: string;
    phone2: string;
    region: string;
    address: string;
    coopDiscount: number;
}

export interface PlintCoopState {
    arrPlintCoop: Array<PlintCoopProps>;
    plintCoop: PlintCoopProps
}
export const initialState: PlintCoopState = {
    arrPlintCoop: [],
    plintCoop: {} as PlintCoopProps
}
export const plintCoopSlice = createSlice({
    name: "plintCoop",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newPlintCoop.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.plintCoop = action.payload.coop
                }
            })
            .addCase(allPlintCoop.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrPlintCoop = action.payload.plintCoop
                }
            })
    }
})


export const selectPlintBuyer = (state: any) => state.plintBuyer;

export default plintCoopSlice.reducer;