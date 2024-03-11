import { createSlice } from "@reduxjs/toolkit";
import { addStretchLightRing, getAllStretchLightRing } from "./strechLightRingApi";


export interface StretchLightRing {
    _id: string;
    name: string;
    price: number;
    unyt: string;
}

export interface StretchLightRingState {
    arrStretchLightRing: Array<StretchLightRing>;
    stretchLightRing: StretchLightRing
}
export const initialState: StretchLightRingState = {
    arrStretchLightRing: [],
    stretchLightRing: {} as StretchLightRing,

}
export const stretchLightRingSlice = createSlice({
    name: "stretchLightRing",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addStretchLightRing.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.stretchLightRing = action.payload
                }
            })
            .addCase(getAllStretchLightRing.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchLightRing = action.payload.lightRing
                }
            })
    }
})


export const selectStretchLightRing = (state: any) => state.stretchLightRing;

export default stretchLightRingSlice.reducer;