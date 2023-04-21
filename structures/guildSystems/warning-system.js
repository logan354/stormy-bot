const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseWarning } = require("../baseFormats");
const { apiBaseURL, apiOptions, capBaseURL, guildLocation, guildChannels } = require("../../utils/constants");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    let cache = null;

    async function run() {
        // Fetch data from MetService CAP Server
        try {
            const response = await fetch(capBaseURL);
            const xml = await response.text();
            const rawData = xml2js(xml, { compact: true, spaces: 4 });

            var data = [];

            for (let i = 0; rawData.rss.channel.item ? i < rawData.rss.channel.item.length : i < 0; i++) {
                const response = await fetch(rawData.rss.channel.item[i].link._text);
                const xml = await response.text();

                // Filter only warnings & watches for the Hamilton area
                const formatData = xml2js(xml, { compact: true, spaces: 4 }).alert.info;
                if (formatData.area.areaDesc._text.toLowercase().includes("hamilton") || formatData.area.areaDesc._text.toLowercase().includes("waikato")) data.push(formatData);
            }
        } catch (error) {
            console.error(error);
            return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error(Guild System: Warning System)** `" + error.message + "`");
        }

        const page = []
        const pageSize = 5;
        let currentPage = 1;

        // Algorithm for sorting data into format data and then pages
        let j = 0;
        for (let i = 0; i < data.length; i++) {
            if (j === 0) page[0] = baseWarning(data[i]);
            else page[0] += baseWarning(data[i]);

            if (j === pageSize - 1) {
                page[0] += "..."
                break;
            }
            else j++;
        }

        const embed = new EmbedBuilder()
            .setColor("Grey")
            .setTitle("Warnings & Watches for Hamilton")
            .setDescription(page.length > 0 ? page[currentPage - 1] : "**No Warnings & Watches**")
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Warnings")
                        .setURL("https://www.metservice.com/warnings/home")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        if (!page.length || page.join() === cache) {
            return;
        } else {
            cache = page.join();
            client.channels.cache.get(guildChannels.WARNING_CHANNEL).send({ embeds: [embed], components: [row] });

        }
    }

    setInterval(run, 60000);
}