const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const Bot = require("../../../structures/Bot");

module.exports = {
    name: "ping",
    category: "Core",
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Displays the bot's response time to Discord."),

    /**
     * @param {Bot} bot
     * @param {CommandInteraction} interaction
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