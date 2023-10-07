const { Client, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { severeWeatherOutlookFormat } = require("../../struct/baseFormats");
const { apiURL, ApiEndpoints } = require("../../util/constants");

module.exports = {
    name: "severe-weather-outlook",
    aliases: ["swo"],
    description: "Displays the severe weather outlook product.",
    category: "Weather",
    utilisation: "severe-weather-outlook",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        let data = null;

        // Fetch data from MetService API
        try {
            const response = await fetch(apiURL + ApiEndpoints.SEVERE_WEATHER_OUTLOOK);
            data = await response.json();
        } catch (error) {
            console.error(error);
            return message.channel.send(emojis.fail + " **Error**");
        }

        // Format
        const payload = severeWeatherOutlookFormat(data);

        const row = new ActionRowBuilder()
        .addComponents(
            [
                new ButtonBuilder()
                    .setLabel("Product")
                    .setURL("https://www.metservice.com/warnings/severe-weather-outlook")
                    .setStyle(ButtonStyle.Link),
            ]
        );

        message.channel.send({ embeds: payload[0], files: [payload[1]], components: [row] });
    }
}