// MetService API
const apiBaseURL = "http://metservice.com/publicData/";

const apiOptions = {
    FORECAST: "localForecast",
    OBSERVATION: "localObs_",
    RAIN_RADAR: "rainRadar{0}_2h_7min_300K",
    SEVERE_WEATHER_OUTLOOK: "severeWeatherOutlook",
    THUNDERSTORM_OUTLOOK: "thunderstormOutlook"
}

// MetService CAP Alert
const capBaseURL = "https://alerts.metservice.com/cap/rss";

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

module.exports = { apiBaseURL, apiOptions, capBaseURL, days, shortDays }