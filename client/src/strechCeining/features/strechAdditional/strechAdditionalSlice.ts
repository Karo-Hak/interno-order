import { createSlice } from "@reduxjs/toolkit";
import { addStretchAdditional, getAllStretchAdditional } from "./strechAdditionalApi";


export interface StretchAdditional {
    _id: string;
    name: string;
    price: number;
    unyt: string;
}

export interface StretchAdditionalState {
    arrStretchAdditional: Array<StretchAdditional>;
    stretchAdditional: StretchAdditional
}
export const initialState: StretchAdditionalState = {
    arrStretchAdditional: [],
    stretchAdditional: {} as StretchAdditional,

}
export const stretchAdditionalSlice = createSlice({
    name: "stretchAdditional",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addStretchAdditional.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.stretchAdditional = action.payload
                }
            })
            .addCase(getAllStretchAdditional.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchAdditional = action.payload.stretchAdditional
                }
            })
    }
})


export const selectStretchAdditional = (state: any) => state.stretchAdditional;

export default stretchAdditionalSlice.reducer;