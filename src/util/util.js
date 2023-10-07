const { Client, ApplicationCommand, GuildEmoji } = require("discord.js");
const metserviceIcons = require("../../data/metservice-icons.json");

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
 * Formats milliseconds to formal time 
 * e.g 3 hours 2 minutes 30 seconds
 * @param {number} milliseconds 
 * @returns {string}
 */
function formatFormalTime(milliseconds) {
    if (!milliseconds || !parseInt(milliseconds)) return undefined;
    const seconds = Math.floor(milliseconds % 60000 / 1000);
    const minutes = Math.floor(milliseconds % 3600000 / 60000);
    const hours = Math.floor(milliseconds / 3600000);
    const days = Math.floor(milliseconds / 86400000);
    if (days > 0) {
        return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    }
    if (hours > 0) {
        return `${hours} hours ${minutes} minutes ${seconds} seconds`;
    }
    if (minutes > 0) {
        return `${minutes} minutes ${seconds} seconds`
    }
    return `${seconds} seconds`;
}

module.exports = { getApplicationCommandID, IconType, fetchMetServiceIcon, formatFormalTime }