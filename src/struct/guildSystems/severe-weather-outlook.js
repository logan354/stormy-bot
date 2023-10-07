const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { apiURL, ApiEndpoints } = require("../../../util/constants");
const { baseSevereWeatherOutlook } = require("../../baseFormats");
const { guildChannels } = require("../constants");

/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    let issuedAtDateCache = null;
    let validFromDateCache = null; // Don't cache valid to date
    let lastMessage = null;

    const run = async () => {
        // Fetch data from MetService API
        try {
            const response = await fetch(apiURL + ApiEndpoints.SEVERE_WEATHER_OUTLOOK);
            var data = await response.json();
        } catch (error) {
            console.error(error);
        }

        if (!issuedAtDateCache || !validFromDateCache) { // Empty Caches
            issuedAtDateCache = data.issuedAtISO;
            validFromDateCache = data.validFromISO;
            lastMessage = null;
        }
        else if (issuedAtDateCache !== data.issuedAtISO) {
            if (validFromDateCache !== data.validFromISO) {
                validFromDateCache = data.validFromISO;
                lastMessage = null
            }

            issuedAtDateCache = data.issuedAtISO;
        }
        else {
            return;
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

        if (lastMessage) {
            lastMessage.edit({ embeds: [embed], components: [row] });
        }
        else {
            lastMessage = await client.channels.cache.get(guildChannels.SEVERE_WEATHER_OUTLOOK_CHANNEL).send({ embeds: [embed], components: [row] });
        }
    }

    const date = new Date();
    setInterval(run, 3_600_000 - (date.getMinutes() * 60 + date.getSeconds()) * 1000 + date.getMilliseconds()); // Runtime set every hour exactly
}