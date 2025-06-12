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
interface ISelectedChat {
    roomId:string,
    id: string
    name: string
    lastMessage: string
    timestamp: string
    unreadCount: number
    status: "online" | "offline" | "away"
    avatar?: string
    type: "customer" | "internal" | "support"
}
interface CounterState {
    value: number;
    login?:UserInfo;
    profile?:IProfile;
    chat?:IChat;
    chatSelected?:ISelectedChat
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
        reset: () => initialState,
        setChat: (state, action: PayloadAction<IChat>) => {
            state.chat = action.payload;
        },
        resetChatClosePopOver: (state) => {
            state.chat ={isChatOpen:false, roomId:undefined, selectedOrder:undefined};
            state.chatSelected= undefined;
        },
        setChatSelected: (state, action: PayloadAction<ISelectedChat>) => {
            state.chatSelected = action.payload;
        }
    },
});

export const { setChat,setLogin,reset,resetChatClosePopOver,setChatSelected} = counterSlice.actions;
export default counterSlice.reducer;