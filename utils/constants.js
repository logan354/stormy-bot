const METSERVICE_BASE = "http://metservice.com/publicData/";

const API_OPTIONS = {
    LOCAL_FORECAST: "localForecast",
    SUN_PROTECTION_URL: "sunProtectionAlert",
    ONE_MIN_OBS: "oneMinObs_",
    HOURLY_OBS_AND_FORCAST: "hourlyObsAndForecast_",
    LOCAL_OBS: "localObs_",
    TIDES: "tides_",
    WARNINGS: "warningsForRegion3_urban.",
    RISE_TIMES: "riseSet_",
    POLLEN_LEVELS: "pollen_town_",
    DAILY_FORECAST: "climateDataDailyTown_{0}_32",
    RAIN_RADAR: "rainRadar{0}_2h_7min_300K"
}

const validLocations = [
    "Kaitaia",
    "Whangarei",
    "Auckland",
    "Hamilton",
    "Tauranga",
    "Rotorua",
    "Gisborne",
    "New-Plymouth",
    "Taupo",
    "Palmerston-North",
    "Napier",
    "Masterton",
    "Wellington",
    "Nelson",
    "Blenheim",
    "Westport",
    "Christchurch",
    "Franz-Josef",
    "Timaru",
    "Queenstown",
    "Dunedin",
    "Invercargill"
];

module.exports = { METSERVICE_BASE, API_OPTIONS, validLocations }