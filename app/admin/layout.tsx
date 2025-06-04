import React, {PropsWithChildren} from 'react';
import { AdminNav } from '@/components/admin-nav';

const LayoutAdmin = ({children}:PropsWithChildren) => {
    return (
        <>
            <AdminNav />
            <div className={'flex justify-center mt-16'}>
                {children}
            </div>
        </>
    );
};

export default LayoutAdmin;
