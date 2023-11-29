const apiURL = "http://metservice.com/publicData/";

const capURL = "https://alerts.metservice.com/cap/rss";

const APIEndpoints = {
    FORECAST: "localForecast",
    OBSERVATION: "localObs_",
    RAIN_RADAR: "rainRadar{location}_2h_7min_300K",
    SEVERE_WEATHER_OUTLOOK: "severeWeatherOutlook",
    THUNDERSTORM_OUTLOOK: "thunderstormOutlook"
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

module.exports = { apiURL, capURL, APIEndpoints, days, shortDays }