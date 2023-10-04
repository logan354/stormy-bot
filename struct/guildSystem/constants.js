const { Snowflake } = require("discord.js");

const guildId = "795129011168477205";

/**
 * @typedef {Object} GuildChannels
 * @property 
 */
const GuildChannels = {
    METSERVICE: "795144248449040446",

    FORECAST: "1125981673427849237",
    OBSERVATION: "1125981692872642662",
    WARNINGS_AND_WATCHES: "1108884700849782804",
    SEVERE_WEATHER_OUTLOOK: "1108884615063687229",
    THUNDERSTORM_OUTLOOK: "1108884549917749300",

    SERVER_LOGS: "1111254128543404083"
}

const forecastLocations = [
    "Auckland",
    "Hamilton",
    "Wellington",
    "Christchurch",
    "Dunedin"
]

/**
 * @typedef {Object} DatabaseChannels
 * @property {Snowflake} RADAR
 * @property {Snowflake} SEVERE_WEATHER_OUTLOOK
 * @property {Snowflake} THUNDERSTORM_OUTLOOK
  */
const DatabaseChannels = {
    RADAR: "1151704487191400528",
    SEVERE_WEATHER_OUTLOOK: "1151704326977355776",
    THUNDERSTORM_OUTLOOK: "1151704274078793749"
}

module.exports = { guildId, guildChannels, locations, DatabaseChannels }