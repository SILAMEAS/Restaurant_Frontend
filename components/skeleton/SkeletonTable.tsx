import React from 'react';
import {Skeleton} from "@/components/ui/skeleton"
import {TableCell, TableRow} from "@/components/ui/table";

const SkeletonTable = ({column=6}:{column?:number}) => {
    return (
        <TableRow>
            {
                Array.from({ length: column }).map((_, i) => (
                    <TableCell key={i} className="font-medium">
                        <Skeleton className="w-[auto] h-[20px] rounded-full" />
                    </TableCell>
                ))
            }
        </TableRow>
    );
};

export default SkeletonTable;
