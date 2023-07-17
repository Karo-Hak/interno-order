import { createSlice } from "@reduxjs/toolkit";
import { getAllUserSphere, getUserSphere, newUserSphere } from "./userSphereApi";


export interface UserSphere {
    _id: string;
    name: string;
}

export interface UserSphereState {
    arrUserSphere: Array<UserSphere>;
    userSphere: UserSphere;
}
export const initialState: UserSphereState = {
    arrUserSphere: [],
    userSphere: {} as UserSphere,

}
export const userSphereSlice = createSlice({
    name: "userSphere",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newUserSphere.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.userSphere = action.payload
                }
            })
            
            .addCase(getAllUserSphere.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrUserSphere = action.payload
                }
            })
            .addCase(getUserSphere.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrUserSphere = action.payload
                }
            })
    }
})


export const selectUserSphere = (state: any) => state.userSphere;

export default userSphereSlice.reducer;