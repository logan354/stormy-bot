const APIURL = "http://metservice.com/publicData/";

const APIEndpoints = {
    FORECAST: "localForecast",
    OBSERVATION: "localObs_",
    RAIN_RADAR: "rainRadar{location}_2h_7min_300K",
    SEVERE_WEATHER_OUTLOOK: "severeWeatherOutlook",
    THUNDERSTORM_OUTLOOK: "thunderstormOutlook"
}

const CAPURL = "https://alerts.metservice.com/cap/rss";

/**
 * The types of forecast periods
 * * 7 Days - Default
 * * 48 Hours
 * * Extended
 */
const ForecastPeriodType = {
    SEVEN_DAYS: 0,
    FORTY_EIGHT_HOURS: 1,
    EXTENDED: 2
}

module.exports = { APIURL, APIEndpoints, CAPURL, ForecastPeriodType }