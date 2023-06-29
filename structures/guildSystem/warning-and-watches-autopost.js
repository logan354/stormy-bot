const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { guildChannels, capBaseURL } = require("../../utils/constants");
const { baseWarning } = require("../baseFormats");
const { xml2js } = require("xml-js");
const database = require("./database/guild-system.json");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    async function run() {
        // Fetch data from MetService CAP Server
        try {
            const response = await fetch(capBaseURL);
            const xml = await response.text();
            const rawData = xml2js(xml, { compact: true, spaces: 4 });



            // Check if all alerts are current
            let alertIds = [];
            for (let i = 0; rawData.rss.channel.item ? i < rawData.rss.channel.item.length : i < 0; i++) {
                alertIds.push(rawData.rss.channel.item[i].guid._text)
            }

            if (database.warningsAndWatchesIds.toString() === alertIds.toString()) {
                return;
            }
            else {
                database.warningsAndWatchesIds = alertIds;
            }



            var data = [];

            for (let i = 0; rawData.rss.channel.item ? i < rawData.rss.channel.item.length : i < 0; i++) {
                const response = await fetch(rawData.rss.channel.item[i].link._text);
                const xml = await response.text();

                // Correcting rank of Severe Thunderstorm Warnings/Watches for data array
                const json = xml2js(xml, { compact: true, spaces: 4 }).alert.info;
                if (json.headline._text.includes("Severe Thunderstorm")) {
                    data.unshift(json);
                }
                else {
                    data.push(json);
                }
            }
        } catch (error) {
            console.error(error);
            return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error(Warning And Watches System)**");
        }

        const pages = []
        const pageSize = 5;
        let currentPage = 1;

        // Algorithm for sorting data into format data and then pages
        let j = 0;
        let k = 0;
        for (let i = 0; i < data.length; i++) {
            if (j === 0) pages[k] = baseWarning(data[i]);
            else pages[k] += baseWarning(data[i]);

            if (j === pageSize - 1) {
                j = 0;
                k++
            }
            else j++;
        }

        const embed = new EmbedBuilder()
            .setColor("Grey")
            .setTitle("Warnings & Watches")
            .setDescription(pages.length > 0 ? pages[0] : "**No Warnings & Watches**")
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

        client.channels.cache.get(guildChannels.WARNINGS_AND_WATCHES_CHANNEL).send({ embeds: [embed], components: pages.length <= 1 ? [row] : [] })

        for (let i = 1; i < pages.length; i++) {
            const embed = new EmbedBuilder()
                .setColor("Grey")
                .setDescription(pages[i])
                .setTimestamp();

            client.channels.cache.get(guildChannels.WARNINGS_AND_WATCHES_CHANNEL).send({ embeds: [embed], components: i === pages.length - 1 ? [row] : [] })
        }
    }

    setInterval(run, 600);
}