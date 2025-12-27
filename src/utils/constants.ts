import { emojis } from "../../config.json";

export const METSERVICE_PUBLIC_API_URL = "https://metservice.com/publicData/";

export const METSERVICE_PUBLIC_API_ENDPOINTS = {
    LOCAL_FORECAST: "localForecast",
    LOCAL_OBS: "localObs_",
    SEVERE_WEATHER_OUTLOOK: "severeWeatherOutlook",
    THUNDERSTORM_OUTLOOK: "thunderstormOutlook"
} as const;

export const METSERVICE_RADAR_LOCATIONS = {
    NEW_ZEALAND: "NZ",
    AUCKLAND: "Auckland",
    BAY_OF_PLENTY: "BOP",
    HAWKES_BAY: "Mahia",
    NEW_PLYMOUTH: "New-Plymouth",
    WELLINGTON: "Wellington",
    CANTERBURY: "Christchurch",
    WESTLAND: "Westland",
    SOUTHLAND: "Invercargill"
}

export const METSERVICE_CAP_RSS_URL = "https://alerts.metservice.com/cap/rss";

export const METSERVICE_EMOJI_URL = "https://cdn.discordapp.com/emojis/" + emojis.metservice.split(":")[2].replace(">", "");