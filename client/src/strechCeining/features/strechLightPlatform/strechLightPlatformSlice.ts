import { createSlice } from "@reduxjs/toolkit";
import { addStretchLightPlatform, getAllStretchLightPlatform } from "./strechLightPlatformApi";


export interface StretchLightPlatformProps {
    _id: string;
    name: string;
    price: number;
    coopPrice: number;
}

export interface StretchLightPlatformState {
    arrStretchLightPlatform: Array<StretchLightPlatformProps>;
    stretchLightPlatform: StretchLightPlatformProps
}
export const initialState: StretchLightPlatformState = {
    arrStretchLightPlatform: [],
    stretchLightPlatform: {} as StretchLightPlatformProps,

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