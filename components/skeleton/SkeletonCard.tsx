import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";

const Cart =()=>{
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

const SkeletonCard = ({column}:{column:number}) => {

    return <div className={'flex flex-col gap-2 md:flex-row items-center'}>
        {
            Array.from({ length: column }).map((_, i) => (
                <Cart key={i}/>
            ))
        }
    </div>
};

export default SkeletonCard;
