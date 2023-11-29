const { ApplicationCommandOptionType, Client, CommandInteraction, CommandInteractionOptionResolver, PermissionsBitField } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseObservation } = require("../../struct/messageBuilders");
const { apiURL, APIEndpoints } = require("../../util/constants");

module.exports = {
    name: "observation",
    category: "Weather",
    description: "Displays the current weather observation for a specified location.",
    utilisation: "observation <location>",
    options: [
        {
            name: "location",
            description: "Enter a location.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
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

        interaction.deferReply();
        // Fetch data from MetService API
        try {
            const response = await fetch(apiURL + APIEndpoints.OBSERVATION + location.replace(" ", "-"));
            var data = await response.json();
        } catch (error) {
            if (error.name === "FetchError" && error.type === "invalid-json") {
                return interaction.editReply(client.emotes.error + " **Invalid location**");
            } else {
                console.error(error);
                return interaction.editReply(client.emotes.error + " **Error**");
            }
        }

        const embed = baseObservation(data);

        interaction.editReply({ embeds: [embed] });
    }
}