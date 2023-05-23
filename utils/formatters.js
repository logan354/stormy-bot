/**
 * Formats milliseconds to formal time 
 * e.g 3 hours 2 minutes 30 seconds
 * @param {number} milliseconds 
 * @returns {string}
 */
function formatFormalTime(milliseconds) {
    if (!milliseconds || !parseInt(milliseconds)) return undefined;
    const seconds = Math.floor(milliseconds % 60000 / 1000);
    const minutes = Math.floor(milliseconds % 3600000 / 60000);
    const hours = Math.floor(milliseconds / 3600000);
    const days = Math.floor(milliseconds / 86400000);
    if (days > 0) {
        return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    }
    if (hours > 0) {
        return `${hours} hours ${minutes} minutes ${seconds} seconds`;
    }
    if (minutes > 0) {
        return `${minutes} minutes ${seconds} seconds`
    }
    return `${seconds} seconds`;
}

/**
 * Formats date object to MetService timecodes
 * @param {Date} date 
 * @param {Style} style 
 */
function metserviceTimeFormat(date, style) {
    if (style === Style.SHORT) {

    } 
    else if (style === Style.MEDIUM) {
        return date.toLocaleDateString("en-GB", { hour: "numeric", hour12: true }).split(" ")[1] + date.toLocaleDateString("en-GB", { hour: "numeric", hour12: true }).split(" ")[2] + " " + date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" });
    } 
    else if (style === Style.LONG) {
        
    }
}

/**
 * The style options
 */
const Style = {
    SHORT: "short",
    MEDIUM: "medium",
    LONG: "long"
}

module.exports = { formatFormalTime, metserviceTimeFormat }