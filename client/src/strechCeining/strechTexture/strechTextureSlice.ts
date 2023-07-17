import { createSlice } from "@reduxjs/toolkit";
import { addStretchTexture, getAllStretchTexture } from "./strechTextureApi";


export interface StretchTexture {
    _id: string;
    name: string;
    weight: number;
    priceGarpun: number;
    priceOtrez: number;
    priceCoopGarpun: number;
    priceCoopOtrez: number;
    unyt: string;
}

export interface StretchTextureState {
    arrStretchTexture: Array<StretchTexture>;
    stretchTexture: StretchTexture
}
export const initialState: StretchTextureState = {
    arrStretchTexture: [],
    stretchTexture: {} as StretchTexture,

}
export const stretchTextureSlice = createSlice({
    name: "stretchTexture",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addStretchTexture.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.stretchTexture = action.payload
                }
            })
            .addCase(getAllStretchTexture.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchTexture = action.payload.stretchTexture
                }
            })
    }
})


export const selectStretchTexture = (state: any) => state.stretchTexture;

export default stretchTextureSlice.reducer;