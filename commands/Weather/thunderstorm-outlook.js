const { Client, Message, ComponentType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { thunderstormOutlookFormat } = require("../../struct/baseFormats");
const { apiBaseURL, apiOptions } = require("../../util/constants");

module.exports = {
    name: "thunderstorm-outlook",
    aliases: ["tso"],
    description: "Displays the thunderstorm outlook product.",
    category: "Weather",
    utilisation: "thunderstorm-outlook",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        let data = null;

        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.THUNDERSTORM_OUTLOOK);
            data = await response.json();
        } catch (error) {
            console.error(error);
            return message.channel.send(emojis.fail + " **Error**");
        }

        // Format the first indexable outlook data
        const payload = thunderstormOutlookFormat(0, null);

        const row1 = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Product")
                        .setURL("https://www.metservice.com/warnings/thunderstorm-outlook")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Product")
                        .setURL("https://www.metservice.com/warnings/thunderstorm-outlook")
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setCustomId("thunderstorm-outlook-button-previous")
                        .setEmoji("⬅️")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(),
                    new ButtonBuilder()
                        .setCustomId("thunderstorm-outlook-button-next")
                        .setEmoji("➡️")
                        .setStyle(ButtonStyle.Secondary)
                ]
            );

        if (data.outlooks.length < 2) {
            message.channel.send({ embeds: payload[0], files: [payload[1]], components: [row1] });
        }
        else {
            let index = 0;
            let previousValidToDateFormat = null;

            // Edit the first embed
            const embed1 = new EmbedBuilder(payload[0][0])
                .setTitle("Thunderstorm Outlook (" + (index + 1) + "/" + data.outlooks.length + ")");

            const response = await message.channel.send({ embeds: [embed1, payload[0][1]], files: [payload[1]], components: [row2] });

            // Collect button responses for a certain period of time
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 900000 });

            // Collector
            collector.on("collect", (i) => {
                if (i.customId === "thunderstorm-outlook-button-previous") {
                    index--;

                    // Format the next indexable outlook data
                    if (index > 0) {
                        previousValidToDateFormat = data.outlooks[index - 1].validTo;
                    }
                    else {
                        previousValidToDateFormat = null;
                    }
                    const payload = thunderstormOutlookFormat(data.outlooks[index], previousValidToDateFormat);

                    // Edit the first embed
                    const embed1 = new EmbedBuilder(payload[0][0])
                        .setTitle("Thunderstorm Outlook (" + (index + 1) + "/" + data.outlooks.length + ")");

                    const newRow2 = new ActionRowBuilder(row2);

                    // Button validation
                    if (index <= 0) {
                        newRow2.components[1].setDisabled();
                    }

                    newRow2.components[2].setDisabled(false);

                    i.update({ embeds: [embed1, payload[0][1]], files: [payload[1]], components: [newRow2] });
                }
                else if (i.customId === "thunderstorm-outlook-button-next") {
                    index++;

                    // Format the next indexable outlook data
                    if (index > 0) {
                        previousValidToDateFormat = data.outlooks[index - 1].validTo;
                    }
                    else {
                        previousValidToDateFormat = null;
                    }
                    const payload = thunderstormOutlookFormat(data.outlooks[index], previousValidToDateFormat);

                    // Edit the first embed
                    const embed1 = new EmbedBuilder(payload[0][0])
                        .setTitle("Thunderstorm Outlook (" + (index + 1) + "/" + data.outlooks.length + ")");

                    const newRow2 = new ActionRowBuilder(row2);

                    // Button validation
                    if (index >= data.outlooks.length - 1) {
                        newRow2.components[2].setDisabled();
                    }

                    newRow2.components[1].setDisabled(false);

                    i.update({ embeds: [embed1, payload[0][1]], files: [payload[1]], components: [newRow2] });
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