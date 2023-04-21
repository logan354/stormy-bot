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
    // Twitter Channels
    METSERVICE_CHANNEL: "795144248449040446",
    METSERVICEWARN_CHANNEL: "801396269360480256",

    // Webhook Channels
    WARNING_CHANNEL: "878486900686606366",
    FORECAST_CHANNEL: "878486808088940564",
    HOURLY_OBSERVATION_CHANNEL: "795144435851067392",

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