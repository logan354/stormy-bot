const METSERVICE_BASE = "http://metservice.com/publicData/";

const API_OPTIONS = {
    LOCAL_FORECAST: "localForecast",
    SUN_PROTECTION_ALERT: "sunProtectionAlert",
    ONE_MIN_OBS: "oneMinObs_",
    HOURLY_OBS_AND_FORECAST: "hourlyObsAndForecast_",
    LOCAL_OBS: "localObs_",
    TIDES: "tides_",
    WARNINGS: "warningsForRegion3_urban.",
    RISE_TIMES: "riseSet_",
    POLLEN_LEVELS: "pollen_town_",
    DAILY_FORECAST: "climateDataDailyTown_{0}_32",
    RAIN_RADAR: "rainRadar{0}_2h_7min_300K"
}

const LoadType = {
    LOADED_DATA: "LOADED_DATA",
    NO_DATA: "NO_DATA",
    LOAD_FAILED: "LOAD_FAILED"
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

module.exports = { METSERVICE_BASE, API_OPTIONS, LoadType, days, shortDays }