// counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFavorite, IProfile } from './api';

export enum Role{
    USER="USER",
    OWNER="OWNER",
    ADMIN="ADMIN"
}

export interface UserInfo {
    accessToken:  string;
    refreshToken: string;
    userId:       number;
    role:         Role;
    message:      string;
}

interface CounterState {
    value: number;
    login?:UserInfo;
    profile?:IProfile
}

const initialState: CounterState = {
    value: 0
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        setLogin: (state, action: PayloadAction<UserInfo>) => {
            state.login = action.payload;
        },
        setProfile: (state, action: PayloadAction<IProfile>) => {
            state.profile = action.payload;
        },
        setFavorite: (state, action: PayloadAction<IFavorite>) => {
            console.log(action.payload)
        if (state.profile&&action.payload) {
            state.profile.favourites = [
            ...(state.profile.favourites || []),
            action.payload,
            ];
        }
        },
        reset: () => initialState
    },
});

export const { increment, decrement,setLogin,reset ,setProfile,setFavorite} = counterSlice.actions;
export default counterSlice.reducer;