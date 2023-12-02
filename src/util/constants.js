const apiURL = "http://metservice.com/publicData/";

const APIEndpoints = {
    FORECAST: "localForecast",
    OBSERVATION: "localObs_",
    RAIN_RADAR: "rainRadar{location}_2h_7min_300K",
    SEVERE_WEATHER_OUTLOOK: "severeWeatherOutlook",
    THUNDERSTORM_OUTLOOK: "thunderstormOutlook"
}

const capURL = "https://alerts.metservice.com/cap/rss";

module.exports = { apiURL, APIEndpoints, capURL }