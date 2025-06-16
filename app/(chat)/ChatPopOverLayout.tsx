"use client"
import React from 'react';
import {store} from "@/lib/redux/store";
import {ChatPopover} from "@/app/(chat)/ChatPopover";
import {CheckRole} from "@/app/admin/components/(hooks)/useUsersByRole";
import {ChatPopoverOwner} from "@/app/(chat)/ChatPopoverOwner";

const ChatPopOverLayout = () => {
    const {isOwner}=CheckRole();
    let content=<></>;
    if(store.getState().counter.login?.accessToken){
        if(isOwner){
            content = <ChatPopoverOwner/>
        }else {
            content=  <ChatPopover/>
        }
    }
    return  <div className="fixed bottom-0 lg:bottom-4 right-0 lg:right-4 z-50 ">
        {content}
    </div>
};

export default ChatPopOverLayout;