import { createSlice } from "@reduxjs/toolkit";
import { getAllUnyt,  } from "./unytApi";


export interface Unyt {
    _id: string;
    name: string;

}

export interface UnytState {
    arrUnyt: Array<Unyt>;
    unyt: Unyt
}
export const initialState: UnytState = {
    arrUnyt: [],
    unyt: {} as Unyt,

}
export const unytSlice = createSlice({
    name: "unyt",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUnyt.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrUnyt = action.payload
                }
            })
    }
})


export const selectUnyt = (state: any) => state.unyt;

export default unytSlice.reducer;