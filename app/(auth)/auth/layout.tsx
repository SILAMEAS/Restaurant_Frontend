
import React, {PropsWithChildren} from 'react';

const LayoutAuth = ({children}:PropsWithChildren) => {

    return (
        <div className='flex'>
            <div className=" flex items-center justify-center w-[50%]">
                    {children}
            </div>
            <div className="rotate-scale-down-ver bg-restaurant-slide bg-cover flex items-center justify-center w-[50%]"/>
        </div>
    
    );
};

export default LayoutAuth;
