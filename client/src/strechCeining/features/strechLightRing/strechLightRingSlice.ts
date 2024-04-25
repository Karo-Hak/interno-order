import { createSlice } from "@reduxjs/toolkit";
import { addStretchLightRing, getAllStretchLightRing } from "./strechLightRingApi";


export interface StretchLightRingProps {
    _id: string;
    name: string;
    price: number;
    coopPrice: number;
}

export interface StretchLightRingState {
    arrStretchLightRing: Array<StretchLightRingProps>;
    stretchLightRing: StretchLightRingProps
}
export const initialState: StretchLightRingState = {
    arrStretchLightRing: [],
    stretchLightRing: {} as StretchLightRingProps,

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