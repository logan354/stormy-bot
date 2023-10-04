const { ApplicationCommandOptionType, Client, CommandInteraction, CommandInteractionOptionResolver, PermissionsBitField } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseForecastTitle, baseForecast } = require("../../struct/baseFormats");
const { apiBaseURL, apiOptions, days, shortDays } = require("../../util/constants");

module.exports = {
    name: "forecast",
    category: "Weather",
    description: "Displays the forecast for a specified location.",
    utilisation: "forecast <location> [outlook]",
    options: [
        {
            name: "location",
            description: "Enter a location.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "outlook",
            description: "Outlook number or day.",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {CommandInteractionOptionResolver} args 
     */
    async execute(client, interaction, args) {
        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + interaction.channel.name + "`");

        const location = args.getString("location");

        let outlook = args.getString("outlook");

        interaction.deferReply();
        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.FORECAST + location.replace(" ", "-"));
            var data = await response.json();
        } catch (error) {
            if (error.name === "FetchError" && error.type === "invalid-json") {
                return interaction.editReply(client.emotes.error + " **Invalid location**");
            } else {
                console.error(error);
                return interaction.editReply(client.emotes.error + " **Error**");
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
                return interaction.editReply(client.emotes.error + " **Invalid outlook day**");
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
                return interaction.editReply(client.emotes.error + " **Invalid outlook number. Must be between 1 and " + data.days.length + "**");
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
        for (let i = 0; i < finalData.length; i++) {
            if (i === 0) {
                interaction.editReply(finalData[i]);
            }
            else {
                interaction.channel.send(finalData[i]);
            }
        }
    }
}