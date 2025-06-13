// counterSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IProfile, OrderResponse, RestaurantResponse} from "@/lib/redux/services/type";
import {mockRestaurant} from "@/constant/mock/mockRestaruant";

export enum Role {
    USER = "USER",
    OWNER = "OWNER",
    ADMIN = "ADMIN"
}

export interface UserInfo {
    accessToken: string;
    refreshToken: string;
    userId: number;
    role: Role;
    message: string;
}

interface IChat {
    selectedOrder?: OrderResponse | null,
    isChatOpen?: boolean,
    roomId?: string | null;

}

interface ISelectedChat {
    roomId: string,
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
    login?: UserInfo;
    profile?: IProfile;
    chat?: IChat;
    chatSelected?: ISelectedChat,
    restaurant: RestaurantResponse
}

const initialState: CounterState = {
    value: 0,
    restaurant:mockRestaurant
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
        setRestaurant: (state, action: PayloadAction<RestaurantResponse>) => {
            state.restaurant = action.payload;
        },
        reset: () => initialState,
        setChat: (state, action: PayloadAction<IChat>) => {
            state.chat = action.payload;
        },
        resetChatClosePopOver: (state) => {
            state.chat = {isChatOpen: false, roomId: undefined, selectedOrder: undefined};
            state.chatSelected = undefined;
        },
        setChatSelected: (state, action: PayloadAction<ISelectedChat>) => {
            state.chatSelected = action.payload;
        }
    },
});

export const {setChat, setLogin, reset, resetChatClosePopOver, setChatSelected,setRestaurant} = counterSlice.actions;
export default counterSlice.reducer;