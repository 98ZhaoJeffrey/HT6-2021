import { Unit } from "../ts/types";

const formatTime = (seconds: number) => {
    // break into hours, minutes, then seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - (3600 * hours)) / 60);
    const remain_seconds = seconds % 60;
    return {hours, minutes, remain_seconds};
}

export { formatTime };
