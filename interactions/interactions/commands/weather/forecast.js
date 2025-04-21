const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } = require("discord.js");
const Bot = require("../../structures/Bot");
const emojis = require("../../data/emojis.json");
const { MetServiceAPIURL, MetServiceAPIEndpoints, ForecastPeriodType } = require("../../util/constants");
const { buildForecastMessage } = require("../../structures/messageBuilders");

const ForecastPeriodType = {
    SEVEN_DAYS: 0,
    FORTY_EIGHT_HOURS: 1,
    EXTENDED: 2
}

module.exports = {
    name: "forecast",
    category: "Weather",
    data: new SlashCommandBuilder()
        .setName("forecast")
        .setDescription("Displays the MetService forecast for a location.")
        .addStringOption(option =>
            option
                .setName("location")
                .setDescription("Location (e.g. Auckland).")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("period")
                .setDescription("The forecast period.")
                .addChoices(
                    { name: "7 Days", value: ForecastPeriodType.SEVEN_DAYS.toString() },
                    { name: "48 Hours", value: ForecastPeriodType.FORTY_EIGHT_HOURS.toString() },
                    { name: "Extended", value: ForecastPeriodType.EXTENDED.toString() }
                )
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
        const periodOpt = interaction.options.getString("period");

        let forecastPeriod;

        if (Number(periodOpt) === null) {
            forecastPeriod = ForecastPeriodType.SEVEN_DAYS;
        }

        let data = null;

        try {
            // Fetch MetService API
            const response = await fetch(MetServiceAPIURL + MetServiceAPIEndpoints.FORECAST + locationOpt.replace(" ", "-"));

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

        const payload = buildForecastMessage(data, forecastPeriod);

        await interaction.editReply({ embeds: [payload] });
    }
}