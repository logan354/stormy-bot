const { GuildEmoji } = require("discord.js");
const emojis = require("../data/metservice-icons.json");

/**
 * Gets a MetService icon emoji
 * @param {string} icon 
 * @returns {GuildEmoji.id|string}
 */
function getMetServiceIconEmoji(icon) {
    emojis
    return emojis.icon.toLowerCase().replace(" ", "_") ?? "X";
}

module.exports = { getMetServiceIconEmoji }