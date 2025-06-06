export const getWebSocketUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
    
    // Remove any trailing slashes
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    
    // For SockJS, we use the http/https URL directly
    const finalUrl = `${cleanBaseUrl}/ws-chat`;
    
    // Debug logging
    console.log('WebSocket Configuration:', {
        baseUrl,
        cleanBaseUrl,
        finalUrl,
        nodeEnv: process.env.NODE_ENV,
    });
    
    return finalUrl;
};

export const STOMP_CONFIG = {
    // Reconnect every 5 seconds
    reconnectDelay: 5000,
    // Heartbeat every 4 seconds
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    // Debug mode
    debug: (str: string) => {
        console.log('STOMP Debug:', str);
    },
    // Connection timeout
    connectionTimeout: 10000,
}; 