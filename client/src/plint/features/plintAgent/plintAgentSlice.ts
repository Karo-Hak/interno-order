import { createSlice } from "@reduxjs/toolkit";
import { allPlintAgent, newPlintAgent } from "./plintAgentApi";

export interface PlintAgentProps {
    _id: string;
    name: string;
    phone1: string;
    phone2: string;
    region: string;
    address: string;
    agentDiscount: number;
}

export interface PlintAgentState {
    arrPlintAgent: Array<PlintAgentProps>;
    plintAgent: PlintAgentProps
}
export const initialState: PlintAgentState = {
    arrPlintAgent: [],
    plintAgent: {} as PlintAgentProps
}
export const plintAgentSlice = createSlice({
    name: "plintAgent",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newPlintAgent.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.plintAgent = action.payload.agent
                }
            })
            .addCase(allPlintAgent.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrPlintAgent = action.payload.plintAgent
                }
            })
    }
})


export const selectPlintAgent = (state: any) => state.plintAgent;

export default plintAgentSlice.reducer;