const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { apiBaseURL, apiOptions, guildChannels } = require("../../utils/constants");
const { baseThunderstormOutlook } = require("../baseFormats");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    let cache = null;

    async function run() {
        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.THUNDERSTORM_OUTLOOK);
            var data = await response.json();
        } catch (error) {
            console.error(error);
            return client.channels.cache.get(guildChannels.THUNDERSTORM_OUTLOOK_CHANNEL).send(client.emotes.error + " **Error(Thunderstorm Outlook System)**");
        }

        const embed = new EmbedBuilder(baseThunderstormOutlook(data.outlooks[0], true));

        const row = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Product")
                        .setURL("https://www.metservice.com/warnings/thunderstorm-outlook")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        // Check if the cache data is still current
        if (cache === data.issuedAtISO) return;
        else {
            client.channels.cache.get(guildChannels.THUNDERSTORM_OUTLOOK_CHANNEL).send({ embeds: [embed], components: [row] });
            cache = data.issuedAtISO;
        }

    }

    setInterval(run, 60000);
}