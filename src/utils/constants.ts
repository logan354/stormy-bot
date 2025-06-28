export const METSERVICE_PUBLIC_API_URL = "https://metservice.com/publicData/";

export const METSERVICE_PUBLIC_API_ENDPOINTS = {
    LOCAL_FORECAST: "localForecast",
    LOCAL_OBS: "localObs_",
    SEVERE_WEATHER_OUTLOOK: "severeWeatherOutlook",
    THUNDERSTORM_OUTLOOK: "thunderstormOutlook"
} as const;

export function getMetServiceRadarEndpoint(radarLocation: string): string {
    return `rainRadar${radarLocation}_2h_7min_300K`;
}

export const RADAR_LOCATIONS = {
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

export const METSERVICE_ICON = "https://www.metservice.com/assets/favicon-32x32-BHIif5Kl.png";