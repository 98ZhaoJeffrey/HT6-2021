const formatTime = (seconds: number) => {
    // break into hours, minutes, then seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - (3600 * hours)) / 60);
    return {hours, minutes};
}

const formatTimeString = (seconds: number) => {
    const {hours, minutes} = formatTime(seconds);
    return `${hours > 0 ? `${hours} hours and` : ""} ${minutes > 0 ? `${minutes} mins` : ""}`;

};


export { formatTime, formatTimeString };
