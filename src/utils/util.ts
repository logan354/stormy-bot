import { emojis } from "../../config.json";

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

export function getMetServiceRadarEndpoint(location: string): string {
    return `rainRadar${location}_2h_7min_300K`;
}

export function getMetServiceIconEmoji(key: string): string | undefined {
     switch (key) {
        case "fine": return emojis.fine;
        case "cloudy": return emojis.cloudy;
        case "partly_cloudy": return emojis.partly_cloudy;
        case "drizzle": return emojis.drizzle;
        case "rain": return emojis.rain;
        case "showers": return emojis.showers;
        case "few_showers": return emojis.few_showers;
        case "snow": return emojis.snow;
        case "fog": return emojis.fog;
        case "frost": return emojis.frost;
        case "hail": return emojis.hail;
        case "wind": return emojis.wind;
        case "wind_rain": return emojis.wind_rain;
        case "thunder": return emojis.thunder;
        case "watch": return emojis.watch;
        case "orange_warning": return emojis.orange_warning;
        case "red_warning": return emojis.red_warning;
        default: return undefined;
    }
}