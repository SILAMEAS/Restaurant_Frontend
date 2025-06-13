import React, {PropsWithChildren} from 'react';
import { AdminNav } from '@/components/nav/admin-nav';
import ChatPopOverLayout from "@/app/(chat)/ChatPopOverLayout";

const LayoutOwner = ({children}:PropsWithChildren) => {
    return (
        <React.Fragment>
            <AdminNav />
            <div className={'flex justify-center mt-16'}>
                {children}
            </div>
            <ChatPopOverLayout/>
        </React.Fragment>
    );
};

export default LayoutOwner;
