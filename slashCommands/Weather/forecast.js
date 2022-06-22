const { Client, CommandInteraction, CommandInteractionOptionResolver, Permissions } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseForecastTitle, baseForecast } = require("../../src/baseFormats");
const { METSERVICE_BASE, API_OPTIONS, days, shortDays } = require("../../utils/constants");

const choices = [];
for (let i of days) {
    choices.push({ name: i, value: i });
}

module.exports = {
    name: "forecast",
    category: "Weather",
    description: "Displays the forecast for a specified location in New Zealand.",
    options: [
        {
            type: "STRING",
            name: "location",
            description: "Location in New Zealand.",
            required: true,
        },
        {
            type: "STRING",
            name: "outlook",
            description: "Outlook in day or number format.",
            required: false,
            choices: choices
        }
    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} args 
     */
    async execute(client, interaction, args) {
        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.me);
        if (!botPermissionsFor.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + interaction.channel.name + "`");

        const location = args.getString("location");

        let outlook = args.getString("outlook");
        if (!outlook) outlook = 1;

        // Fetch data from MetService API
        interaction.deferReply();
        try {
            const response = await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_FORECAST + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return interaction.editReply(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return interaction.editReply(client.emotes.error + " **Error** `" + e.message + "`");
            }
        }

        const finalData = [];
        const charLimit = 2000;
        let k = 0;

        if (!Number(outlook)) {
            outlook = outlook.charAt(0).toUpperCase() + outlook.slice(1).toLowerCase();

            if (!days.includes(outlook) && !shortDays.includes(outlook)) {
                return interaction.editReply(client.emotes.error + " **Invalid outlook day**");
            }

            for (let i = 0; i < 7; i++) {
                if (data.days[i].dow.toLowerCase() === outlook.toLowerCase() || data.days[i].dowTLA.toLowerCase() === outlook.toLowerCase()) {
                    finalData.push(baseForecastTitle(i, data, outlook) + baseForecast(i, data));
                    break;
                }
            }
        } else {
            if (outlook < 1 || outlook > data.days.length) {
                return interaction.editReply(client.emotes.error + " **Invalid outlook number. Must be between 1 and " + data.days.length + "**");
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
            interaction.editReply(i);
        }
    }
}