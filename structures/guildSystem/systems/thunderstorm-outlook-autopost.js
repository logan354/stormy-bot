const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { apiBaseURL, apiOptions } = require("../../../utils/constants");
const { baseThunderstormOutlook } = require("../../baseFormats");
const { guildChannels } = require("../constants");

/**
 * @param {Client} client 
 */
module.exports = async (client) => {
    issuedAtDateCache = null;
    validToDateCache = null;
    lastMessage = null;

    async function run() {
        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.THUNDERSTORM_OUTLOOK);
            var data = await response.json();
        } catch (error) {
            console.error(error);
        }

        if (!issuedAtDateCache || !validToDateCache) { // Empty Caches
            issuedAtDateCache = data.outlooks[0].issuedAtISO;
            validToDateCache = data.outlooks[0].validToISO;
            lastMessage = null;
        }
        else if (issuedAtDateCache !== data.outlooks[0].issuedAtISO) {
            if (validToDateCache !== data.outlooks[0].validToISO) {
                validToDateCache = data.outlooks[0].validToISO;
                lastMessage = null
            }

            issuedAtDateCache = data.outlooks[0].issuedAtISO;
        }
        else {
            return;
        }

        const embed = new EmbedBuilder(baseThunderstormOutlook(data.outlooks[0], null));

        const row = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Product")
                        .setURL("https://www.metservice.com/warnings/thunderstorm-outlook")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        if (lastMessage) {
            lastMessage.edit({ embeds: [embed], components: [row] });
        }
        else {
            lastMessage = await client.channels.cache.get(guildChannels.THUNDERSTORM_OUTLOOK_CHANNEL).send({ embeds: [embed], components: [row] });
        }
    }

    const date = new Date();
    setInterval(run, 3_600_000 - (date.getMinutes() * 60 + date.getSeconds()) * 1000 + date.getMilliseconds()); // Runtime set every hour exactly
}