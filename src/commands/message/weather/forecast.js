const { PermissionsBitField, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require("discord.js");
const Bot = require("../../../struct/Bot");
const emojis = require("../../../../data/emojis.json");
const { default: fetch } = require("node-fetch");
const { apiURL, APIEndpoints } = require("../../../util/constants");
const { buildForecastMessage } = require("../../../struct/messageBuilders");

module.exports = {
    name: "forecast",
    aliases: ["f"],
    description: "Displays the forecast for a specified location.",
    category: "Weather",
    permissions: {
        client: [
            ["Embed Links", PermissionsBitField.Flags.EmbedLinks]
        ],
        member: []
    },
    utilisation: "forecast <location> [outlook]",

    /**
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(bot, message, args) {
        // Get and Define outlook parameter
        let outlook;

        if (args.length > 2) {
            outlook = args[args.length - 1];
            args.splice(args.length - 1, 1);
        }

        // Define location parameter
        const location = args.join(" ");
        if (!location) return message.channel.send(emojis.fail + " **A location is required**");

        // Fetch MetService API JSON data
        let data = null;

        try {
            const response = await fetch(apiURL + APIEndpoints.FORECAST + location.replace(" ", "-"));

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

        let payload = null;

        if (!outlook) {
            payload = buildForecastMessage(data, 1, data.days.length);
        }
        else if (!Number(outlook)) {
            let found = false;
            let dayNumber = 1;

            for (let i = 0; i < 7; i++) {
                if (data.days[i].dow.toLowerCase() === outlook.toLowerCase()) {
                    found = true;
                    dayNumber = i + 1;
                    break;
                }
            }

            if (!found) {
                return message.channel.send(emojis.fail + " **Invalid outlook date. Must be Monday, Tuesday, etc**");
            }
            else {
                payload = buildForecastMessage(data, dayNumber, dayNumber);
            }
        }
        else {
            if (outlook < 1 || outlook > data.days.length) {
                return message.channel.send(emojis.fail + " **Invalid outlook number. Must be between 1 and " + data.days.length + "**");
            }
            else {
                payload = buildForecastMessage(data, 1, outlook);
            }
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

        message.channel.send({ embeds: [payload], components: [row] });
    }
}