const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { apiBaseURL, apiOptions, guildChannels } = require("../../utils/constants");
const { baseSevereWeatherOutlook } = require("../baseFormats");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    let cache = null;

    async function run() {
        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.SEVERE_WEATHER_OUTLOOK);
            var data = await response.json();
        } catch (error) {
            console.error(error);
            return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error*(Severe Weather Outlook System)**");
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

        // Check if the cache data is still current
        if (cache === data.issuedAtISO) return;
        else {
            client.channels.cache.get(guildChannels.SEVERE_WEATHER_OUTLOOK_CHANNEL).send({ embeds: [embed], components: [row] });
            cache = data.issuedAtISO;
        }

    }

    setInterval(run, 60000);
}