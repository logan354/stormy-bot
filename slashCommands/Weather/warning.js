const { Client, CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseWarningTitle, baseWarning } = require("../../src/baseFormats");
const { apiBaseURL, apiOptions } = require("../../src/utils/constants");

module.exports = {
    name: "warning",
    category: "Weather",
    description: "Displays the current MetService issued warnings for a specified location in New Zealand.",
    utilisation: "warning <location>",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "location",
            description: "Location in New Zealand.",
            required: true,
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

        // Fetch data from MetService API
        interaction.deferReply();
        try {
            const response = await fetch(apiBaseURL + apiOptions.REGIONAL_WARNINGS + location.replace(" ", "-"));
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

        for (let i = 0; i < data.warnings.length; i++) {
            if (i === 0) finalData[k] = baseWarningTitle(data.locationName);

            if (finalData[k].length + baseWarning(data.warnings[i]).length > charLimit) {
                k++
                finalData[k] = baseWarning(data.warnings[i]);
            } else {
                finalData[k] += baseWarning(data.warnings[i]);
            }
        }

        if (!finalData.length) finalData[k] = baseWarningTitle(data.locationName) + "\n\nNo warnings for this region";

        // Iterate through formatted data array
        for (let i of finalData) {
            interaction.editReply(i);
        }
    }
}