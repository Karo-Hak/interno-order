import { createSlice } from "@reduxjs/toolkit";
import { getAllCooperate, getCoopSpher } from "./cooperateApi";


export interface Cooperate {
    _id: string;
    name: string;
    surname: string;
    cooperationSphere: string;
    cooperateRate: number;
}

export interface CooperateState {
    arrCooperate: Array<Cooperate>;
    cooperationSphere: Array<any>;
    cooperate: Cooperate
}
export const initialState: CooperateState = {
    arrCooperate: [],
    cooperate: {} as Cooperate,
    cooperationSphere: []
}
export const cooperateSlice = createSlice({
    name: "cooperate",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getCoopSpher.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.cooperationSphere = action.payload
                }
            })
            .addCase(getAllCooperate.fulfilled, (state, acttion) => {
                if ('error' in acttion.payload) {
                } else {
                    state.arrCooperate = acttion.payload
                }
            })
    }
})


export const selectCooperate = (state: any) => state.cooperate;

export default cooperateSlice.reducer;