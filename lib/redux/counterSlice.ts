// counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProfile } from './api';

export interface UserInfo {
    accessToken:  string;
    refreshToken: string;
    userId:       number;
    role:         string;
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
        reset: () => initialState
    },
});

export const { increment, decrement,setLogin,reset ,setProfile} = counterSlice.actions;
export default counterSlice.reducer;