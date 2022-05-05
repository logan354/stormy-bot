const { Client } = require("discord.js");
const { guildId, guildChannels } = require("./utils/constants");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    client.on("messageCreate", (message) => {
        if (message.guild.id === guildId) {
            if (Object.values(guildChannels).includes(message.channel.id) && message.channel.type === "GUILD_NEWS") {
                message.crosspost();
            }
        }
    });
}