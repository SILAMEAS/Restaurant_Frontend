import React from 'react';
import {WifiIcon, WifiOff} from "lucide-react";

const SignalConnect = ({isConnected}: { isConnected: boolean }) => {
    return <>
        {isConnected ? (
            <span
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 text-[10px] font-medium text-white flex items-center justify-center animate-in zoom-in duration-200">
              <WifiIcon className="w-3 h-3"/>
            </span>
        ) : (
            <span
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center animate-in zoom-in duration-200">
              <WifiOff className="w-3 h-3"/>
            </span>
        )}
    </>
};

export default SignalConnect;