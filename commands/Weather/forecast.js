const { Client, Message, Permissions } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseForecastTitle, baseForecast } = require("../../src/baseFormats");
const { METSERVICE_BASE, API_OPTIONS, days, shortDays } = require("../../utils/constants");

module.exports = {
    name: "forecast",
    aliases: ["f"],
    category: "Weather",
    description: "Displays the forecast for a specified location in New Zealand.",
    utilisation: "{prefix}forecast [outlook] <location>",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.me);
        if (!botPermissionsFor.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + message.channel.name + "`");

        let outlook = args[0];
        if (!outlook) outlook = 1;

        args.shift();

        const location = args.join(" ");
        if (!location) return message.channel.send(client.emotes.error + " **A location is required**");

        // Fetch data from MetService API
        try {
            const response = await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_FORECAST + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return message.channel.send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return message.channel.send(client.emotes.error + " **Error** `" + e.message + "`");
            }
        }

        const finalData = [];
        const charLimit = 2000;
        let k = 0;

        if (!Number(outlook)) {
            outlook = outlook.charAt(0).toUpperCase() + outlook.slice(1).toLowerCase();

            if (!days.includes(outlook) && !shortDays.includes(outlook)) {
                return message.channel.send(client.emotes.error + " **Invalid outlook day**");
            }

            for (let i = 0; i < 7; i++) {
                if (data.days[i].dow.toLowerCase() === outlook.toLowerCase() || data.days[i].dowTLA.toLowerCase() === outlook.toLowerCase()) {
                    finalData.push(baseForecastTitle(i, data, outlook) + baseForecast(i, data));
                    break;
                }
            }
        } else {
            if (outlook < 1 || outlook > data.days.length) {
                return message.channel.send(client.emotes.error + " **Invalid outlook number. Must be between 1 and " + data.days.length + "**");
            }

            for (let i = 0; i < outlook; i++) {
                if (i === 0) finalData[k] = baseForecastTitle(i, data, outlook);

                if (finalData[k].length + baseForecast(i, data).length > charLimit) {
                    k++
                    finalData[k] = baseForecast(i, data);
                } else {
                    finalData[k] += baseForecast(i, data);
                }
            }
        }

        // Iterate through formatted data array
        for (let i of finalData) {
            message.channel.send(i);
        }
    }
}