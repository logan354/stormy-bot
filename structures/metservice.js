
const metServicemetserviceIcons = require("../data/metservice-weather-metserviceIcons.json");
const { GuildEmoji } = require("discord.js");

const IconType = {
    URL: "URL",
    EMOJI: "EMOJI"
}

/**
 * Fetch a MetService icon
 * @param {string} icon 
 * @param {IconType} type
 * @returns {string|GuildEmoji#id}
 */
function fetchMetServiceIcon(icon, type) {
    for (let i = 0; i < metserviceIcons.length; i++) {
        if (metserviceIcons[i].name.toLowerCase() === icon.toLowerCase()) {
            if (type === IconType.URL) {
                return metserviceIcons[i].url;
            }
            else if (type === IconType.EMOJI) {
                return metserviceIcons[i].emojiId;
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

module.exports = { IconType, fetchMetServiceIcon }