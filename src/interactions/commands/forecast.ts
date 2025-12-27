import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import Command from "../../structures/Command";
import { METSERVICE_EMOJI_URL, METSERVICE_PUBLIC_API_ENDPOINTS, METSERVICE_PUBLIC_API_URL } from "../../utils/constants";
import { getMetServiceIconEmoji } from "../../utils/util";
import { emojis } from "../../../config.json";

const FORECAST_PERIOD_TYPE = {
    FORTY_EIGHT_HOURS: "FORTY_EIGHT_HOURS",
    SEVEN_DAYS: "SEVEN_DAYS",
    EXTENDED: "EXTENDED"
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
    data: new SlashCommandBuilder()
        .setName("forecast")
        .setDescription("The MetService forecast for a location.")
        .addStringOption(option =>
            option
                .setName("location")
                .setDescription("Location e.g. Auckland.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("period")
                .setDescription("The time period of the forecast.")
                .setRequired(false)
                .addChoices(periodChoices)
        ),
    async execute(bot, interaction) {
        const locationOption = interaction.options.getString("location", true);
        const periodOption = interaction.options.getString("period") ?? FORECAST_PERIOD_TYPE.FORTY_EIGHT_HOURS;

        await interaction.deferReply();

        let data;

        try {
            const response = await fetch(METSERVICE_PUBLIC_API_URL + METSERVICE_PUBLIC_API_ENDPOINTS.LOCAL_FORECAST + locationOption.replace(" ", "-"));

            if (response.status === 200) data = await response.json();
            else if (response.status === 404) {
                await interaction.editReply(emojis.error + " **Invalid/Unknown location**");
                return;
            }
            else {
                await interaction.editReply(emojis.error + " **Error**");
                return;
            }
        }
        catch (e) {
            console.error(e);
            await interaction.editReply(emojis.error + " **Error**");
            return;
        }

        let locationStr = data.locationIPS.toLowerCase().split(" ").map((x: any) => x.charAt(0).toUpperCase() + x.slice(1)).join(" ");
        let periodStr;
        let days = 0;

        if (periodOption === FORECAST_PERIOD_TYPE.FORTY_EIGHT_HOURS) {
            periodStr = "48 Hours";
            days = 2;
        }
        else if (periodOption === FORECAST_PERIOD_TYPE.SEVEN_DAYS) {
            periodStr = "7 Days";
            days = 7;
        }
        else if (periodOption === FORECAST_PERIOD_TYPE.EXTENDED) {
            periodStr = "Extended";
            days = data.days.length;
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "MetService",
                iconURL: METSERVICE_EMOJI_URL
            })
            .setTitle(locationStr + " - " + periodStr)
            .setTimestamp();

        let description = "";

        for (let day = 0; day < days; day++) {
            const dayData = data.days[day];

            const line1 = `${getMetServiceIconEmoji(dayData.forecastWord.toLowerCase().replace(" ", "_"))} **${day === 0 ? "Today" : dayData.dowTLA}** ${dayData.date} | ${emojis.temperature_high} ${dayData.max}° ${emojis.temperature_low} ${dayData.min}°\n`;
            const line2 = dayData.forecast;

            description += line1 + line2 + "\n\n";
        }

        embed.setDescription(description);

        await interaction.editReply({ embeds: [embed] });
    }
} as Command;