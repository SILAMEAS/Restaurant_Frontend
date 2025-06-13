import React, {PropsWithChildren} from 'react';

const LayoutAuth = ({children}: PropsWithChildren) => {
    return (
        <div className='flex min-h-screen w-full'>
            <div className="flex items-center justify-center w-full">
                {children}
            </div>
        </div>
    );
};

export default LayoutAuth;
