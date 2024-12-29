import { createSlice } from "@reduxjs/toolkit";
import { allPlintProduction, newPlintProduction } from "./plintProductionApi";


export interface PlintProductionProps {
    _id: string;
    productId: string;
    name: string;
    quantity: number;
    date: Date;
}

export interface PlintProductionState {
    arrPlintProduction: Array<PlintProductionProps>;
    plintProduction: PlintProductionProps
}
export const initialState: PlintProductionState = {
    arrPlintProduction: [],
    plintProduction: {} as PlintProductionProps
}
export const plintProductionSlice = createSlice({
    name: "plintProduction",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newPlintProduction.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.plintProduction = action.payload.production
                }
            })
            .addCase(allPlintProduction.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrPlintProduction = action.payload.production
                }
            })
    }
})


export const selectPlintProduction = (state: any) => state.plintProduction;

export default plintProductionSlice.reducer;