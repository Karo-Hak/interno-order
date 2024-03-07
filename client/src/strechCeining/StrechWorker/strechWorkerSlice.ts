import { createSlice } from "@reduxjs/toolkit";
import { newStretchWorker, allStretchWorker } from "./strechWorkerApi";


export interface StretchWorker {
    id: number;
    name: string;
    phone: string;
}

export interface StretchWorkerState {
    arrStretchWorker: Array<StretchWorker>;
    workerStrech: StretchWorker
}
export const initialState: StretchWorkerState = {
    arrStretchWorker: [],
    workerStrech: {} as StretchWorker
}
export const stretchWorkerSlice = createSlice({
    name: "stretchWorker",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newStretchWorker.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.workerStrech = action.payload.worker
                }
            })
            .addCase(allStretchWorker.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchWorker = action.payload.worker
                }
            })
    }
})


export const selectStretchWorker = (state: any) => state.stretchWorker;

export default stretchWorkerSlice.reducer;