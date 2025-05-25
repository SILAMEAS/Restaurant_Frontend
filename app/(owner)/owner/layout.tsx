import React, {PropsWithChildren} from 'react';

const LayoutOwner = ({children}:PropsWithChildren) => {
    return (
        <div className={'flex justify-center'}>
            {
                children
            }
        </div>
    );
};

export default LayoutOwner;
