// API
const apiBaseURL = "http://metservice.com/publicData/";

const apiOptions = {
    LOCAL_FORECAST: "localForecast",
    LOCAL_OBSERVATION: "localObs_",
    RAIN_RADAR: "rainRadar{0}_2h_7min_300K",
    SEVERE_WEATHER_OUTLOOK: "severeWeatherOutlook",
    THUNDERSTORM_OUTLOOK: "thunderstormOutlook"
}

// CAP
const capBaseURL = "https://alerts.metservice.com/cap/rss";

// Guild
const guildLocation = "Hamilton";

const guildId = "795129011168477205";

const guildChannels = {
    // Webhook Channels
    METSERVICE_CHANNEL: "795144248449040446",
    METSERVICEWARN_CHANNEL: "801396269360480256",

    // MetService Channels
    FORECAST_CHANNEL: "1111643793553358868",
    OBSERVATION_CHANNEL: "1111643918535249940",
    WARNINGS_AND_WATCHES_CHANNEL: "1108884700849782804",
    SEVERE_WEATHER_OUTLOOK_CHANNEL: "1108884615063687229",
    THUNDERSTORM_OUTLOOK_CHANNEL: "1108884549917749300", 

    // Logging Channel
    SERVER_LOGS_CHANNEL: "795173942293692447"
}

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]

const shortDays = days.map((x) => x.substring(0, 3));

module.exports = { apiBaseURL, apiOptions, capBaseURL, guildLocation, guildId, guildChannels, days, shortDays }