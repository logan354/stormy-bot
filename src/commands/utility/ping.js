const { PermissionsBitField, Message, EmbedBuilder } = require("discord.js");
const Bot = require("../../struct/Bot");

module.exports = {
    name: "ping",
    aliases: [],
    description: "Displays the bot's response time to Discord.",
    category: "Utility",
    permissions: {
        client: [
            ["Embed Links", PermissionsBitField.Flags.EmbedLinks]
        ],
        member: []
    },
    utilisation: "ping",

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