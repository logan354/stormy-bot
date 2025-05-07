import emojis from "../../emojis.json";

export function getMetServiceIconEmoji(icon: string): string | undefined {
    let emoji;

    for (let i = 0; i < emojis.metservice_icons.length; i++) {
        if (emojis.metservice_icons[i].name === icon) {
            emoji = emojis.metservice_icons[i].value;
            break;
        }
        else continue;
    }

    return emoji;
}

export function formatTitleCase(str: string): string {
    return str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function formatSnakeCase(str: string): string {
    return str.toLowerCase().replace(" ", "_");
}

/**
 * Formats date into MetService date standard
 * @param date 
 * @param useTime 
 * @param options 
 * @returns 
 */
export function formatMetServiceDate(date: Date, useTime: boolean, options?: { useWeekday?: boolean, useNoon?: boolean, useMinutes?: boolean }) {
    let useWeekday = true;
    let useNoon = false;
    let useMinutes = true;

    if (options) {
        if (options.useWeekday) useWeekday = options.useWeekday;
        if (options.useNoon) useNoon = options.useNoon;
        if (options.useMinutes) useMinutes = options.useMinutes;
    }

    let dateFormat = date.toLocaleString("en-GB", { day: "numeric" }) + " " + date.toLocaleString("en-GB", { month: "long" }).slice(0, 3);

    if (useWeekday) date.toLocaleString("en-GB", { weekday: "short" }) + ", " + dateFormat;

    if (useTime) {
        let timeFormat = null;

        if (useNoon) {
            if (date.getHours() === 12) timeFormat = "noon";
            else if (date.getHours() === 0) timeFormat = "midnight";
        }

        if (!timeFormat) {
            if (useMinutes) timeFormat = (date.toLocaleString("en-GB", { hour: "numeric", minute: "numeric", hourCycle: "h12" })).replace(" ", "");
            else timeFormat = (date.toLocaleString("en-GB", { hour: "numeric", hourCycle: "h12" })).replace(" ", "");
        }

        return timeFormat + " " + dateFormat;
    }
    else return dateFormat;
}
