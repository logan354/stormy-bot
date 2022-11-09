// API
const apiBaseURL = "http://metservice.com/publicData/";

const apiOptions = {
    LOCAL_OBS: "localObs_",
    LOCAL_FORECAST: "localForecast",
    SEVERE_WEATHER_WARNINGS: "severeWeatherWarning",
    REGIONAL_WARNINGS: "warningsForRegion3_urban.",
    SEVERE_WEATHER_OUTLOOK: "severeWeatherOutlook",
    THUNDERSTORM_OUTLOOK: "thunderstormOutlook"
}

// Guild Systems
const guildLocation = "Hamilton";

const guildId = "795129011168477205";

const guildChannels = {
    METSERVICE_CHANNEL: "795144248449040446",
    METSERVICEWARN_CHANNEL: "801396269360480256",
    WARNING_CHANNEL: "878486900686606366",
    DAILY_FORECAST_CHANNEL: "818392239042461719",
    THREE_DAY_FORECAST_CHANNEL: "878486808088940564",
    FIVE_DAY_FORECAST_CHANNEL: "876030637834895420",
    THREE_HOUR_OBSERVATION_CHANNEL: "795144435851067392",
    SERVER_LOGS_CHANNEL: "795173942293692447"
}

module.exports = { apiBaseURL, apiOptions, guildLocation, guildId, guildChannels }