import React, {PropsWithChildren} from 'react';

const LayoutAuth = ({children}:PropsWithChildren) => {
    return (
        <div className="bg-restaurant-slide bg-cover flex items-center justify-center">
            {children}
        </div>
    );
};

export default LayoutAuth;
