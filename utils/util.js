const { Client, ApplicationCommand, GuildEmoji } = require("discord.js");
const metserviceIcons = require("../data/metservice-icons.json");
const metserviceWeatherIcons = require("../data/metservice-weather-icons.json");

/**
 * Gets a slash commands mention
 * @param {Client} client
 * @param {string} name 
 * @returns {ApplicationCommand.id}
 */
async function getApplicationCommandID(client, name) {
    const commands = await client.application.commands.fetch();
    for (let command of commands) {
        if (command[1].name === name) {
            return command[1].id;
        }
    }
}

const IconType = {
    URL: "URL",
    EMOJI: "EMOJI"
}

/**
 * Fetch a MetService icon
 * @param {string} icon 
 * @param {IconType} type
 * @returns {string|GuildEmoji.id}
 */
function fetchMetServiceIcon(icon, type) {
    console.log(icon)
    for (let i = 0; i < metserviceIcons.length; i++) {
        if (metserviceIcons[i].name.toLowerCase() === icon.toLowerCase()) {
            if (type === IconType.URL) {
                return metserviceIcons[i].url;
            }
            else if (type === IconType.EMOJI) {
                return metserviceIcons[i].emoji_id;
            }
        }
    }

    if (type === IconType.URL) {
        return "https://www.metservice.com"
    }
    else if (type === IconType.EMOJI) {
        return "X";
    }
}

/**
 * Fetch a MetService weather icon
 * @param {string} icon 
 * @param {IconType} type
 * @param {boolean} isNight
 * @returns {string|GuildEmoji.id}
 */
function fetchMetServiceWeatherIcon(icon, type, isNight) {
    for (let i = 0; i < metserviceWeatherIcons.length; i++) {
        if (metserviceWeatherIcons[i].name.toLowerCase() === icon.toLowerCase()) {
            if (type === IconType.URL) {
                if (isNight && metserviceWeatherIcons[i].night) {
                    return metserviceWeatherIcons[i].night.url;
                }
                else {
                    return metserviceWeatherIcons[i].url;
                }
            }
            else if (type === IconType.EMOJI) {
                if (isNight && metserviceWeatherIcons[i].night) {
                    return metserviceWeatherIcons[i].night.emoji_id;
                }
                else {
                    return metserviceWeatherIcons[i].emoji_id;
                }
            }
        }
    }

    if (type === IconType.URL) {
        return "https://www.metservice.com"
    }
    else if (type === IconType.EMOJI) {
        return "X";
    }
}

module.exports = { getApplicationCommandID, IconType, fetchMetServiceIcon, fetchMetServiceWeatherIcon }