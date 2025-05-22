import {Slide, toast} from "react-toastify";

type ApiHandlerOptions<T> = {
    apiFn: () => Promise<T>; // expects a function that returns a promise (already wrapped with data)
    onSuccess?: (res: T) => void;
    onError?: (error: any) => void;
    finallyMessage?: string;
};

export async function handleApiCall<T>({
                                           apiFn,
                                           onSuccess,
                                           onError,
                                           finallyMessage="Checking your server...",
                                       }: ApiHandlerOptions<T>) {
    try {
        const res = await apiFn(); // e.g. () => login(data).unwrap()
        return onSuccess?.(res);
    } catch (e: any) {
       return onError?.(e);
    }
}
