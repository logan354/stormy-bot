const { Client, Message, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseSevereWeatherOutlook } = require("../../structures/baseFormats");
const { apiBaseURL, apiOptions } = require("../../utils/constants");

module.exports = {
    name: "severe-weather-outlook",
    aliases: ["swo"],
    category: "Weather",
    description: "Displays the severe weather outlook.",
    utilisation: "severe-weather-outlook",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + message.channel.name + "`");
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Embed Links in** " + "`" + message.channel.name + "`");

        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.SEVERE_WEATHER_OUTLOOK);
            var data = await response.json();
        } catch (error) {
            console.error(error);
            return message.channel.send(client.emotes.error + " **Error**");
        }

        const embed = baseSevereWeatherOutlook(data);

        const row = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Product")
                        .setURL("https://www.metservice.com/warnings/severe-weather-outlook")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        message.channel.send({ embeds: [embed], components: [row] });
    }
}