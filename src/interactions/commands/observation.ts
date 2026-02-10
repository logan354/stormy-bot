import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import Command from "../../structures/Command";
import { METSERVICE_EMOJI_URL, METSERVICE_PUBLIC_API_ENDPOINTS, METSERVICE_PUBLIC_API_URL } from "../../utils/constants";
import { emojis } from "../../../config.json";

export default {
    name: "observation",
    data: new SlashCommandBuilder()
        .setName("observation")
        .setDescription("The current MetService weather observation for a location.")
        .addStringOption(option =>
            option
                .setName("location")
                .setDescription("Location e.g. Auckland.")
                .setRequired(true)
        ),
    async execute(bot, interaction) {
        const locationOption = interaction.options.getString("location", true);

        await interaction.deferReply();

        let data: any;

        try {
            const response = await fetch(METSERVICE_PUBLIC_API_URL + METSERVICE_PUBLIC_API_ENDPOINTS.LOCAL_OBS + locationOption.replace(" ", "-"));

            if (response.ok) data = await response.json();
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

        const embed = new EmbedBuilder()
            .setAuthor({
                iconURL: METSERVICE_EMOJI_URL,
                name: "MetService"
            })
            .setTitle("Current Conditions at " + data.location)
            .addFields(
                {
                    name: "Temperature",
                    value: data.threeHour.temp + "°\nFeels like " + data.threeHour.windChill + "°",
                    inline: true
                },
                {
                    name: "Clothing",
                    value: data.threeHour.clothingLayers + " layers\n" + data.threeHour.windProofLayers + " windproof",
                    inline: true
                },
                {
                    name: "Wind",
                    value: data.threeHour.windSpeed + "km/h " + data.threeHour.windDirection,
                    inline: true
                },
                {
                    name: "Rainfall",
                    value: data.threeHour.rainfall + "mm",
                    inline: true
                },
                {
                    name: "Humidity",
                    value: data.threeHour.humidity + "%",
                    inline: true
                },
                {
                    name: "Pressure",
                    value: data.threeHour.pressure + "hPa\n" + data.threeHour.pressureTrend,
                    inline: true
                }
            )
            .setFooter({
                text: "Observed at: " + data.threeHour.dateTime
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
} as Command;