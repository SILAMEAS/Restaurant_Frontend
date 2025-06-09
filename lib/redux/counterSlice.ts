// counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IFavorite, IProfile, OrderResponse} from "@/lib/redux/type";

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
interface IChat {
    selectedOrder?:OrderResponse | null,
    isChatOpen?:boolean,
    roomId?:string|null;
    
}
interface CounterState {
    value: number;
    login?:UserInfo;
    profile?:IProfile;
    chat?:IChat
}

const initialState: CounterState = {
    value: 0,
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
        reset: () => initialState,
        setChat: (state, action: PayloadAction<IChat>) => {
            state.chat = action.payload;
        },
        resetChat: (state) => {
            state.chat = initialState.chat;
        }
    },
});

export const { setChat,setLogin,reset,resetChat} = counterSlice.actions;
export default counterSlice.reducer;