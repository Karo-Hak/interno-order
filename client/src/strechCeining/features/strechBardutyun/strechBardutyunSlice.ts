import { createSlice } from "@reduxjs/toolkit";
import { addStretchBardutyun, getAllStretchBardutyun } from "./strechBardutyunApi";


export interface StretchBardutyun {
    _id: string;
    name: string;
    price: number;
    unyt: string;
}

export interface StretchBardutyunState {
    arrStretchBardutyun: Array<StretchBardutyun>;
    stretchBardutyun: StretchBardutyun
}
export const initialState: StretchBardutyunState = {
    arrStretchBardutyun: [],
    stretchBardutyun: {} as StretchBardutyun,

}
export const stretchBardutyunSlice = createSlice({
    name: "stretchBardutyun",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addStretchBardutyun.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.stretchBardutyun = action.payload
                }
            })
            .addCase(getAllStretchBardutyun.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchBardutyun = action.payload.stretchBardutyun
                }
            })
    }
})


export const selectStretchBardutyun = (state: any) => state.stretchBardutyun;

export default stretchBardutyunSlice.reducer;