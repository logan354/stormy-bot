const { PermissionsBitField, Message, EmbedBuilder } = require("discord.js");
const Bot = require("../../../structures/Bot");

module.exports = {
    name: "ping",
    description: "Displays the bot's response time to Discord.",
    category: "Utility",
    usage: "ping",
    aliases: [],
    permissions: {
        client: [
            ["Embed Links", PermissionsBitField.Flags.EmbedLinks]
        ],
        member: []
    },

    /**
     * @param {Bot} bot
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(bot, message, args) {
        const embed = new EmbedBuilder()
            .setColor("Grey")
            .setDescription("Pong: `" + bot.client.ws.ping + "ms`")
            .setTimestamp(new Date());

        message.channel.send({ embeds: [embed] });
    }
}