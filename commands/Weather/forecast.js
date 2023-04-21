const { Client, Message, PermissionsBitField } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseForecastTitle, baseForecast } = require("../../structures/baseFormats");
const { apiBaseURL, apiOptions, days, shortDays } = require("../../utils/constants");

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
        const botPermissionsFor = message.channel.permissionsFor(message.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + message.channel.name + "`");

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

        const location = args.join(" ");
        if (!location) return message.channel.send(client.emotes.error + " **A location is required**");

        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.LOCAL_FORECAST + location.replace(" ", "-"));
            var data = await response.json();
        } catch (error) {
            if (error.name === "FetchError" && error.type === "invalid-json") {
                return message.channel.send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(error);
                return message.channel.send(client.emotes.error + " **Error**");
            }
        }

        const finalData = [];
        const charLimit = 2000;
        let k = 0;
        let isToday = false;

        if (!outlook || outlook === 1) outlook = data.days[0].dow;

        if (!Number(outlook)) {
            // Format outlook
            outlook = outlook.charAt(0).toUpperCase() + outlook.slice(1).toLowerCase();

            if (!days.includes(outlook) && !shortDays.includes(outlook)) {
                return message.channel.send(client.emotes.error + " **Invalid outlook day**");
            }

            for (let i = 0; i < 7; i++) {
                if (i === 0) {
                    isToday = true;
                } else {
                    isToday = false;
                }

                if (data.days[i].dow.toLowerCase() === outlook.toLowerCase() || data.days[i].dowTLA.toLowerCase() === outlook.toLowerCase()) {
                    finalData.push(baseForecastTitle(data.locationIPS, data.days[i].dow, null) + baseForecast(data.days[i], isToday));
                    break;
                }
            }
        } else {
            if (outlook < 1 || outlook > data.days.length) {
                return message.channel.send(client.emotes.error + " **Invalid outlook number. Must be between 1 and " + data.days.length + "**");
            }

            for (let i = 0; i < outlook; i++) {
                if (i === 0) {
                    isToday = true;
                    finalData[k] = baseForecastTitle(data.locationIPS, null, outlook);
                } else {
                    isToday = false;
                }

                if (finalData[k].length + baseForecast(data.days[i], isToday).length > charLimit) {
                    k++
                    finalData[k] = baseForecast(data.days[i], isToday);
                } else {
                    finalData[k] += baseForecast(data.days[i], isToday);
                }
            }
        }

        // Iterate through formatted data array
        for (let i of finalData) {
            message.channel.send(i);
        }
    }
}