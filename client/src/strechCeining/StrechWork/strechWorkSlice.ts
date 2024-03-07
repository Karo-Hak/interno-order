import { createSlice } from "@reduxjs/toolkit";
import { newStretchWork, allStretchWork } from "./strechWorkApi";


export interface StretchWork {
    id: number;
    name: string;
    phone: string;
}

export interface StretchWorkState {
    arrStretchWork: Array<StretchWork>;
    workStrech: StretchWork
}
export const initialState: StretchWorkState = {
    arrStretchWork: [],
    workStrech: {} as StretchWork
}
export const stretchWorkSlice = createSlice({
    name: "stretchWork",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newStretchWork.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.workStrech = action.payload.work
                }
            })
            .addCase(allStretchWork.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchWork = action.payload.work
                }
            })
    }
})


export const selectStretchWork = (state: any) => state.stretchWork;

export default stretchWorkSlice.reducer;