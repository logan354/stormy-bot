const { Client, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { forecastFormat } = require("../../struct/baseFormats");
const { apiBaseURL, apiOptions, days, shortDays } = require("../../util/constants");

module.exports = {
    name: "forecast",
    aliases: ["f"],
    category: "Weather",
    description: "Displays the forecast for a specified location.",
    utilisation: "forecast <location> [outlook]",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        // Handle outlook parameter
        let lastElement;
        let lastElementFmt;
        let outlook;

        if (args) {
            lastElement = args[args.length - 1]

            if (Number(lastElement)) {
                outlook = lastElement;
                args.splice(args.length - 1, 1);
            }
            else {
                lastElementFmt = lastElement.charAt(0).toUpperCase() + lastElement.slice(1).toLowerCase();

                if (days.includes(lastElementFmt) || shortDays.includes(lastElementFmt)) {
                    outlook = lastElementFmt;
                    args.splice(args.length - 1, 1);
                }
                else {
                    outlook = null;
                }
            }
        }

        if (!outlook) outlook = 1;

        // Handle location parameter
        const location = args.join(" ");
        if (!location) return message.channel.send(client.emotes.error + " **A location is required**");


        let data = null;

        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.FORECAST + location.replace(" ", "-"));
            data = await response.json();
        } catch (error) {
            if (error.name === "FetchError" && error.type === "invalid-json") {
                return message.channel.send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(error);
                return message.channel.send(client.emotes.error + " **Error**");
            }
        }

        let payload = null;
        const truelocation = data.locationIPS.charAt(0).toUpperCase() + data.locationIPS.slice(1).toLowerCase();

        if (!Number(outlook)) {
            outlook = outlook.charAt(0).toUpperCase() + outlook.slice(1).toLowerCase();

            if (!days.includes(outlook) && !shortDays.includes(outlook)) {
                return message.channel.send(client.emotes.error + " **Invalid outlook day**");
            }

            for (let i = 0; i < 7; i++) {
                if (data.days[i].dow.toLowerCase() === outlook.toLowerCase() || data.days[i].dowTLA.toLowerCase() === outlook.toLowerCase()) {
                    payload = forecastFormat(data.days[i], truelocation, i === 0 ? true : false);
                    break;
                }
            }
        } else {
            if (outlook < 1 || outlook > data.days.length) {
                return message.channel.send(client.emotes.error + " **Invalid outlook number. Must be between 1 and " + data.days.length + "**");
            }

            const data2 = [];
            for (let i = 0; i < outlook; i++) {
                data2.push(data.days[i]);
            }

            payload = forecastFormat(data2, truelocation, true);
        }



        const row = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Forecasts")
                        .setURL("https://www.metservice.com/national")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Forecasts")
                        .setURL("https://www.metservice.com/national")
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setCustomId("forecast-button-previous")
                        .setEmoji("⬅️")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(),
                    new ButtonBuilder()
                        .setCustomId("forecast-button-next")
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
                if (i.customId === "forecast-button-previous") {
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
                else if (i.customId === "forecast-button-next") {
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