const { Client, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { xml2js } = require("xml-js");
const { warningFormat } = require("../../struct/messageBuilders");
const { capURL } = require("../../util/constants");

module.exports = {
    name: "warnings",
    aliases: ["warn", "w"],
    category: "Weather",
    description: "Displays the current MetService warnings.",
    utilisation: "warnings",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        let data = [];

        // Fetch data from MetService CAP Server
        try {
            const response = await fetch(capURL);
            const xml = await response.text();
            const titleData = xml2js(xml, { compact: true, spaces: 4 });

            console.log(titleData.rss.channel)

            for (let i = 0; titleData.rss.channel.item ? typeof titleData.rss.channel.item === "object" ? i < titleData.rss.channel.item.length : false : i < 0; i++) {
                const response = await fetch(titleData.rss.channel.item[i].link._text);
                const xml = await response.text();
                const json = xml2js(xml, { compact: true, spaces: 4 }).alert.info;
                data.push(json);
                console.log("hi")
            }
        } catch (error) {
            console.error(error);
            return message.channel.send(emojis.fail + " **Error**");
        }

        // Default embed if no data
        // if (!data.length) {
        //     const defaultEmbed = new EmbedBuilder()
        //         .setColor("Grey")
        //         .setTitle("Warnings & Watches")
        //         .setDescription("No Warnings and Watches in force")
        //         .setTimestamp();

        //     return message.channel.send({ embeds: [defaultEmbed] });
        // }

        // Format
        const payload = warningFormat(data);

        const row = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Warnings")
                        .setURL("https://www.metservice.com/warnings/home")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Warnings")
                        .setURL("https://www.metservice.com/warnings/home")
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setCustomId("warnings-button-previous")
                        .setEmoji("⬅️")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(),
                    new ButtonBuilder()
                        .setCustomId("warnings-button-next")
                        .setEmoji("➡️")
                        .setStyle(ButtonStyle.Secondary)
                ]
            );

        if (payload[0].length < 2) {
            message.channel.send({ embeds: payload[0], components: [row] });
        }
        else {
            let index = 0;

            // Edit the first embed
            const embed = new EmbedBuilder(payload[0][0])
                .setTitle(embed.data.title + " (" + (index + 1) + "/" + payload[0].length + ")");

            const response = await message.channel.send({ embeds: [embed], components: [row2] });

            // Collect button responses for a certain period of time
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 900000 });

            // Collector
            collector.on("collect", (i) => {
                if (i.customId === "warnings-button-previous") {
                    index--;

                    // Edit the indexable embed
                    const embed = new EmbedBuilder(payload[0][index])
                        .setTitle(embed.data.title + " (" + (index + 1) + "/" + payload[0].length + ")");

                    const newRow2 = new ActionRowBuilder(row2);

                    // Button validation
                    if (index <= 0) {
                        newRow2.components[1].setDisabled();
                    }

                    newRow2.components[2].setDisabled(false);

                    i.update({ embeds: [embed], components: [row2] });
                }
                else if (i.customId === "warnings-button-next") {
                    index++;

                    // Edit the indexable embed
                    const embed = new EmbedBuilder(payload[0][index])
                        .setTitle(embed.data.title + " (" + (index + 1) + "/" + payload[0].length + ")");

                    const newRow2 = new ActionRowBuilder(row2);

                    // Button validation
                    if (index >= data.outlooks.length - 1) {
                        newRow2.components[2].setDisabled();
                    }

                    newRow2.components[1].setDisabled(false);

                    i.update({ embeds: [embed], components: [row2] });
                }
            });

            collector.on("end", (collected, reason) => {
                const newRow2 = new ActionRowBuilder(row2);
                newRow2.components[1].setDisabled();
                newRow2.components[2].setDisabled();

                response.edit({ components: [newRow2] });
            });
        }
    }
}