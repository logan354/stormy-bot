const { Client, CommandInteraction, CommandInteractionOptionResolver, Permissions } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { base_local_observation } = require("../../src/baseFormats");
const { METSERVICE_BASE, API_OPTIONS } = require("../../utils/constants");

module.exports = {
    name: "observation",
    category: "Weather",
    description: "Displays the current weather observation for a specified location in New Zealand.",
    options: [
        {
            type: "STRING",
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
        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.me);
        if (!botPermissionsFor.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + interaction.channel.name + "`");
        if (!botPermissionsFor.has(Permissions.FLAGS.EMBED_LINKS)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Embed Links in** " + "`" + interaction.channel.name + "`");

        const location = args.getString("location");

        // Fetch data from MetService API
        interaction.deferReply();
        try {
            const response = await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_OBS + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return interaction.editReply(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return interaction.editReply(client.emotes.error + " **Error** `" + e.message + "`");
            }
        }

        const embed = base_local_observation(data);
        interaction.editReply({ embeds: [embed] });
    }
}