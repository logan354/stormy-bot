const { Client, CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseLocalObservation } = require("../../src/baseFormats");
const { apiBaseURL, apiOptions } = require("../../src/utils/constants");

module.exports = {
    name: "observation",
    category: "Weather",
    description: "Displays the current weather observation for a specified location in New Zealand.",
    utilisation: "observation <location>",
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
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Embed Links in** " + "`" + interaction.channel.name + "`");

        const location = args.getString("location");

        // Fetch data from MetService API
        interaction.deferReply();
        try {
            const response = await fetch(apiBaseURL + apiOptions.LOCAL_OBS + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return interaction.editReply(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return interaction.editReply(client.emotes.error + " **Error** `" + e.message + "`");
            }
        }

        const embed = baseLocalObservation(data);
        interaction.editReply({ embeds: [embed] });
    }
}