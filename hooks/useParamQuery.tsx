import {useState} from 'react';
import {PaginationRequest, PaginationRequestDefault} from "@/lib/redux/type";

const useParamQuery = () => {
    const [paramQuery,setParamQuery] = useState<PaginationRequest>(PaginationRequestDefault);

    return {paramQuery,setParamQuery}
};

export default useParamQuery;
