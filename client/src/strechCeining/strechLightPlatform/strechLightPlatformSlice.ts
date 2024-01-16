import { createSlice } from "@reduxjs/toolkit";
import { addStretchLightPlatform, getAllStretchLightPlatform } from "./strechLightPlatformApi";


export interface StretchLightPlatform {
    _id: string;
    name: string;
    price: number;
    unyt: string;
}

export interface StretchLightPlatformState {
    arrStretchLightPlatform: Array<StretchLightPlatform>;
    stretchLightPlatform: StretchLightPlatform
}
export const initialState: StretchLightPlatformState = {
    arrStretchLightPlatform: [],
    stretchLightPlatform: {} as StretchLightPlatform,

}
export const stretchLightPlatformSlice = createSlice({
    name: "stretchLightPlatform",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addStretchLightPlatform.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.stretchLightPlatform = action.payload
                }
            })
            .addCase(getAllStretchLightPlatform.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchLightPlatform = action.payload.lightPlatform
                }
            })
    }
})


export const selectStretchLightPlatform = (state: any) => state.stretchLightPlatform;

export default stretchLightPlatformSlice.reducer;