

export const formatDateTimeToPP = (timestamp: number) => {

// Create a Date object
    const date = new Date(timestamp);

// Convert to Cambodia time (UTC+7) using options
    const formattedTime = date.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Phnom_Penh',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    return formattedTime;
}