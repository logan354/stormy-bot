const { Client, CommandInteraction, CommandInteractionOptionResolver, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseSevereWeatherOutlook } = require("../../struct/baseFormats");
const { apiBaseURL, apiOptions } = require("../../util/constants");

module.exports = {
    name: "severe-weather-outlook",
    category: "Weather",
    description: "Displays the severe weather outlook.",
    utilisation: "severe-weather-outlook",

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} args 
     */
    async execute(client, interaction, args) {
        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + interaction.channel.name + "`");
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Embed Links in** " + "`" + interaction.channel.name + "`");

        interaction.deferReply();
        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.SEVERE_WEATHER_OUTLOOK);
            var data = await response.json();
        } catch (error) {
            console.error(error);
            return interaction.editReply(client.emotes.error + " **Error**");
        }

        const embed = baseSevereWeatherOutlook(data);

        const row = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Product")
                        .setURL("https://www.metservice.com/warnings/severe-weather-outlook")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        interaction.editReply({ embeds: [embed], components: [row] });
    }
}