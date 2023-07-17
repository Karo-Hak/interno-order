import { createSlice } from "@reduxjs/toolkit";
import { allUser, userProfile } from "./userApi";

export interface Role {
    name: string;
}

export interface User {
    id: number;
    name: string;
    surname: string;
    username: string;
    password: string;
    role: string;
    sphere: Array<string>
}

export interface UserState {
    arrUser: Array<User>;
    profile: User
}
export const initialState: UserState = {
    arrUser: [],
    profile: {} as User
}
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(userProfile.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.profile = action.payload.user
                }
            })
            .addCase(allUser.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrUser = action.payload
                }
            })
    }
})


export const selectUser = (state: any) => state.user;

export default userSlice.reducer;