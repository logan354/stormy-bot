const { PermissionsBitField, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require("discord.js");
const Bot = require("../../../structures/Bot");
const emojis = require("../../../data/emojis.json");
const { APIURL, APIEndpoints, ForecastPeriodType } = require("../../../util/constants");
const { buildForecastMessage } = require("../../../structures/messageBuilders");

module.exports = {
    name: "forecast",
    description: "Displays the MetService forecast for a specified location.",
    category: "Weather",
    utilisation: "forecast <location> [period]",
    aliases: ["f"],
    permissions: {
        client: [
            ["Embed Links", PermissionsBitField.Flags.EmbedLinks]
        ],
        member: []
    },

    /**
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(bot, message, args) {
        let period = ForecastPeriodType.SEVEN_DAYS;

        if (args.length > 1) {
            if (args[args.length - 1].toLowerCase() === "7_days") {
                period = ForecastPeriodType.SEVEN_DAYS;
            }
            else if (args[args.length - 1].toLowerCase() === "48_hours") {
                period = ForecastPeriodType.FORTY_EIGHT_HOURS;
            }
            else if (args[args.length - 1].toLowerCase() === "extended") {
                period = ForecastPeriodType.EXTENDED;
            }
            else {
                return message.channel.send(emojis.fail + " **Invalid period**");
            }

            args.splice(args.length - 1, 1);
        }

        const location = args.join(" ");
        if (!location) return message.channel.send(emojis.fail + " **A location is required**");


        // Fetch MetService API
        let data = null;
        try {
            const response = await fetch(APIURL + APIEndpoints.FORECAST + location.replace(" ", "-"));

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


        // Format and Send data
        const payload = buildForecastMessage(data, period);

        message.channel.send({ embeds: [payload] });
    }
}