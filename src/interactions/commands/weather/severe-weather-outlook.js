const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");
const Bot = require("../../../structures/Bot");
const emojis = require("../../../data/emojis.json");

module.exports = {
    name: "severe-weather-outlook",
    category: "Warnings",
    data: new SlashCommandBuilder()
        .setName("severe-weather-outlook")
        .setDescription("Displays the MetService Severe Weather Outlook."),

    /**
     * @param {Bot} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(bot, interaction) {
        await interaction.reply(emojis.neutral + " Command is unavailable");
    }
}