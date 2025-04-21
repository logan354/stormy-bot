const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } = require("discord.js");
const Bot = require("../../structures/Bot");
const emojis = require("../../data/emojis.json");
const { MetServiceAPIURL, MetServiceAPIEndpoints } = require("../../util/constants");
const { buildObservationMessage } = require("../../structures/messageBuilders");

module.exports = {
    name: "observation",
    category: "Weather",
    data: new SlashCommandBuilder()
        .setName("observation")
        .setDescription("Displays the latest MetService weather observation for a location.")
        .addStringOption(option =>
            option
                .setName("location")
                .setDescription("Location (e.g. Auckland).")
                .setRequired(true)
        ),
    
    /**
     * @param {Bot} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(bot, interaction) {
        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);

        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return await interaction.reply(emojis.permission_fail + " **I do not have permission** to Embed Links in <#" + message.channel.id + ">");

        await interaction.deferReply();

        const locationOpt = interaction.options.getString("location");

        let data = null;

        try {
            // Fetch MetService API
            const response = await fetch(MetServiceAPIURL + MetServiceAPIEndpoints.OBSERVATION + locationOpt.replace(" ", "-"));

            if (response.ok) {
                data = await response.json();
            }
            else {
                if (response.status === 404) {
                    return await interaction.editReply(emojis.fail + " **Invalid/Unknown location**");
                }
                else {
                    return await interaction.editReply(emojis.fail + " **Error**");
                }
            }
        } catch (error) {
            console.error(error);
            return await interaction.editReply(emojis.fail + " **Error**");
        }

        const payload = buildObservationMessage(data);

        await interaction.editReply(payload);
    }
}