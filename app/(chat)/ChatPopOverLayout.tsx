"use client"
import React from 'react';
import {store} from "@/lib/redux/store";
import {ChatPopover} from "@/app/(chat)/ChatPopover";

const ChatPopOverLayout = () => {
    return  <div className="fixed bottom-4 right-4 z-50">
        {
            store.getState().counter.login?.accessToken&&
            <ChatPopover/>
        }
    </div>
};

export default ChatPopOverLayout;