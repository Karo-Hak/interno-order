import { createSlice } from "@reduxjs/toolkit";
import { addStretchTexture, getAllStretchTexture } from "./strechTextureApi";


export interface StretchTextureProps {
    _id: string;
    name: string;
    width: number;
    price: number;
    coopPrice: number;
    // priceCoopOtrez: number;
}

export interface StretchTextureState {
    arrStretchTexture: Array<StretchTextureProps>;
    stretchTexture: StretchTextureProps
}
export const initialState: StretchTextureState = {
    arrStretchTexture: [],
    stretchTexture: {} as StretchTextureProps,

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