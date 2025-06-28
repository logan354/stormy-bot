import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";

import Command from "../../../structures/Command";
import { METSERVICE_ICON, METSERVICE_PUBLIC_API_ENDPOINTS, METSERVICE_PUBLIC_API_URL } from "../../../utils/constants";
import { formatSnakeCase, formatTitleCase, getMetServiceIconEmoji } from "../../../utils/util";
import { emojis } from "../../../../config.json";

const FORECAST_PERIOD_TYPE = {
    FORTY_EIGHT_HOURS: 0,
    SEVEN_DAYS: 1,
    EXTENDED: 2
} as const;

const periodChoices = [
    {
        name: "48 Hours",
        value: FORECAST_PERIOD_TYPE.FORTY_EIGHT_HOURS
    },
    {
        name: "7 Days",
        value: FORECAST_PERIOD_TYPE.SEVEN_DAYS
    },
    {
        name: "Extended",
        value: FORECAST_PERIOD_TYPE.EXTENDED
    }
];

export default {
    name: "forecast",
    category: "Weather",
    data: new SlashCommandBuilder()
        .setName("forecast")
        .setDescription("The MetService forecast for a location.")
        .addStringOption(option =>
            option
                .setName("location")
                .setDescription("Location e.g. Auckland.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("period")
                .setDescription("The time period of the forecast.")
                .setRequired(false)
                .addChoices(periodChoices)
        ),
    async execute(bot, interaction) {
        if (!interaction.channel || !interaction.guild.members.me) return new ReferenceError();

        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return interaction.reply(emojis.permission_error + " **I do not have permission to Use External Emojis in** <#" + interaction.channel.id + ">");
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(emojis.permission_error + " **I do not have permission to Use Embed Links in** <#" + interaction.channel.id + ">");

        const location = interaction.options.getString("location")!;
        const period = interaction.options.getInteger("period") ?? FORECAST_PERIOD_TYPE.FORTY_EIGHT_HOURS;

        const url = METSERVICE_PUBLIC_API_URL + METSERVICE_PUBLIC_API_ENDPOINTS.LOCAL_FORECAST + location!.replace(" ", "-");
        let data: any;

        await interaction.deferReply();

        try {
            const response = await fetch(url);

            if (response.status === 200) {
                data = await response.json();
            }
            else if (response.status === 404) {
                return await interaction.editReply(emojis.error + " **Invalid/Unknown location**");
            }
            else {
                return await interaction.editReply(emojis.error + " **Error**");
            }
        }
        catch (error) {
            console.error(error);
            return await interaction.editReply(emojis.error + " **Error**");
        }

        let locationStr = formatTitleCase(data.locationIPS);
        let periodStr;
        let days = 0;

        if (period === FORECAST_PERIOD_TYPE.FORTY_EIGHT_HOURS) {
            periodStr = "48 Hours";
            days = 2;
        }
        else if (period === FORECAST_PERIOD_TYPE.SEVEN_DAYS) {
            periodStr = "7 Days";
            days = 7;
        }
        else if (period === FORECAST_PERIOD_TYPE.EXTENDED) {
            periodStr = "Extended";
            days = data.days.length;
        }

        const embed = new EmbedBuilder()
                .setAuthor({
                    name: "MetService",
                    iconURL: METSERVICE_ICON
                })
                .setTitle(locationStr + " - " + periodStr)
                .setTimestamp();

        let description = "";

        for (let day = 0; day < days; day++) {
            const dayData = data.days[day];

            const line1 = `${getMetServiceIconEmoji(formatSnakeCase(dayData.forecastWord))} **${day === 0 ? "Today" : dayData.dowTLA}** ${dayData.date} | ${emojis.temperature_high} ${dayData.max}° ${emojis.temperature_low} ${dayData.min}°\n`;
            const line2 = dayData.forecast;

            description += line1 + line2 + "\n\n";
        }

        embed.setDescription(description);

        await interaction.editReply({ embeds: [embed] });
    }
} as Command;