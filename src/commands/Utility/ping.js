const { Message, PermissionsBitField, EmbedBuilder, Colors } = require("discord.js");
const Bot = require("../../struct/Bot");
const emojis = require("../../data/emojis.json");

module.exports = {
    name: "ping",
    aliases: [],
    description: "Displays the bot's response time to Discord.",
    category: "Utility",
    utilisation: "ping",

    /**
     * @param {Bot} bot
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(bot, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return message.channel.send(emojis.permission_fail + " **I do not have permission to Embed Links in** <#" + message.channel.id + ">");
        
        const embed = new EmbedBuilder()
            .setColor(Colors.DarkGreen)
            .setDescription("Pong: `" + bot.client.ws.ping + "ms`")
            .setTimestamp(new Date());

        message.channel.send({ embeds: [embed] });
    }
}