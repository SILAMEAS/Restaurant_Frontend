import React, {PropsWithChildren} from 'react';

const LayoutAdmin = ({children}:PropsWithChildren) => {
    return (
        <div className={'flex justify-center'}>
            {
                children
            }
        </div>
    );
};

export default LayoutAdmin;
