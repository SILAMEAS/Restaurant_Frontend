import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { COOKIES } from '@/constant/COOKIES';
import { useAppDispatch } from '@/lib/redux/hooks';
import { reset } from '@/lib/redux/counterSlice';

export const useLogout = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        // Clear all authentication cookies
        Cookies.remove(COOKIES.TOKEN);
        Cookies.remove(COOKIES.ROLE);
        
        // Reset Redux state
        dispatch(reset());
        
        // Force a clean redirect to login page
        router.replace('/auth/login');
    };

    return handleLogout;
}; 