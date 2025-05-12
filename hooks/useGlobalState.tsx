import { useAppSelector } from "@/lib/redux/hooks"

export const useGlobalState=()=>{
    const counter=useAppSelector(s=>s.counter)
    return {...counter}
}