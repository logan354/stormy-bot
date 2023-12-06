const { PermissionsBitField, Message, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Bot = require("../../../struct/Bot");
const { default: fetch } = require("node-fetch");
const { buildThunderstormOutlookMessage } = require("../../../struct/messageBuilders");
const { apiURL, APIEndpoints } = require("../../../util/constants");
const emojis = require("../../../../data/emojis.json");

module.exports = {
    name: "thunderstorm-outlook",
    aliases: ["tso"],
    description: "Displays the thunderstorm outlook product.",
    category: "Weather",
    permissions: {
        client: [
            ["Embed Links", PermissionsBitField.Flags.EmbedLinks]
        ],
        member: []
    },
    utilisation: "thunderstorm-outlook",

    /**
     * @param {Bot} bot
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(bot, message, args) {
        // Fetch MetService API JSON data
        let data = null;

        try {
            const response = await fetch(apiURL + APIEndpoints.THUNDERSTORM_OUTLOOK);

            if (response.ok) {
                data = await response.json();
            }
            else {
                if (response.status === 404) {
                    return message.channel.send(emojis.fail + " **Invalid/Unknown location**");
                }
                else {
                    return message.channel.send(emojis.fail + " **Error**")
                }
            }
        } catch (error) {
            console.error(error);
            return message.channel.send(emojis.fail + " **Error**");
        }

        const payload = buildThunderstormOutlookMessage(data, 1, data.outlooks.length);

        const row1 = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Thunderstorm Outlookss")
                        .setURL("https://www.metservice.com/warnings/thunderstorm-outlook")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Thunderstorm Outlooks")
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

        if (payload[0].length > 1) {
            let index = 0;

            // Send message and await response
            const response = await message.channel.send({ embeds: [payload[0][index]], components: [row2] });

            // Collect button responses for a certain period of time
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 900000 });

            // Collector
            collector.on("collect", (i) => {
                if (i.customId === "thunderstorm-outlook-button-previous") {
                    index--;

                    const newRow2 = new ActionRowBuilder(row2);

                    // Button validation
                    if (index <= 0) {
                        newRow2.components[1].setDisabled();
                    }

                    newRow2.components[2].setDisabled(false);

                    i.update({ embeds: [payload[0][index]], components: [row2] });
                }
                else if (i.customId === "thunderstorm-outlook-button-next") {
                    index++;

                    const newRow2 = new ActionRowBuilder(row2);

                    // Button validation
                    if (index >= payload[0].length - 1) {
                        newRow2.components[2].setDisabled();
                    }

                    newRow2.components[1].setDisabled(false);

                    i.update({ embeds: [payload[0][index]], components: [row2] });
                }
            });

            // Collector end
            collector.on("end", (collected, reason) => {
                const newRow2 = new ActionRowBuilder(row2);
                newRow2.components[1].setDisabled();
                newRow2.components[2].setDisabled();

                response.edit({ components: [newRow2] });
            });
        }
        else {
            message.channel.send({ embeds: [payload[0][0]], components: [row1] });
        }
    }
}