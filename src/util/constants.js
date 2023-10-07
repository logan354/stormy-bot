const apiURL = "http://metservice.com/publicData/";

const capURL = "https://alerts.metservice.com/cap/rss";

const ApiEndpoints = {
    FORECAST: "localForecast",
    OBSERVATION: "localObs_",
    RAIN_RADAR: "rainRadar{location}_2h_7min_300K",
    SEVERE_WEATHER_OUTLOOK: "severeWeatherOutlook",
    THUNDERSTORM_OUTLOOK: "thunderstormOutlook"
}

const guildId = "795129011168477205";

const GuildChannels = {
    METSERVICE: "795144248449040446",
    NIWA: "1144883359030448138",

    FORECAST: "1125981673427849237",
    OBSERVATION: "1125981692872642662",
    WARNINGS_AND_WATCHES: "1108884700849782804",
    SEVERE_WEATHER_OUTLOOK: "1108884615063687229",
    THUNDERSTORM_OUTLOOK: "1108884549917749300",
}

const forecastLocations = [
    "Auckland",
    "Hamilton",
    "Wellington",
    "Christchurch",
    "Dunedin"
]

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

module.exports = { apiURL, capURL, ApiEndpoints, guildId, GuildChannels, forecastLocations, days, shortDays }