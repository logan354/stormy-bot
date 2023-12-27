const { GuildEmoji } = require("discord.js");
const emojis = require("../data/emojis.json");

/**
 * Gets a MetService icon emoji
 * @param {string} icon 
 * @returns {GuildEmoji.id|string}
 */
function getMetServiceIconEmoji(icon) {
    icon = icon.toLowerCase().replace(" ", "_");
    let emojiId;

    for (let i = 0; i < emojis.metservice_icons.length; i++) {
        if (emojis.metservice_icons[i][0] === icon) {
            emojiId = emojis.metservice_icons[i][1];
            break; 
        }
    }

    if (!emojiId) {
        return "X";
    }
    else {
        return emojiId;
    }
}

module.exports = { getMetServiceIconEmoji }