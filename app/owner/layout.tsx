import React, {PropsWithChildren} from 'react';
import { AdminNav } from '@/components/admin-nav';

const LayoutOwner = ({children}:PropsWithChildren) => {
    return (
        <>
            <AdminNav />
            <div className={'flex justify-center mt-16'}>
                {children}
            </div>
        </>
    );
};

export default LayoutOwner;
