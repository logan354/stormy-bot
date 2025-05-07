import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";

import Command from "../../../structures/Command";
import { METSERVICE_ICON, METSERVICE_PUBLIC_API_ENDPOINTS, METSERVICE_PUBLIC_API_URL } from "../../../utils/constants";
import emojis from "../../../../emojis.json";

export default {
    name: "observation",
    category: "Weather",
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
        if (!interaction.channel || !interaction.guild.members.me) return new ReferenceError();

        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(emojis.permission_error + " **I do not have permission to Use Embed Links in** <#" + interaction.channel.id + ">");

        const location = interaction.options.getString("location")!;

        const url = METSERVICE_PUBLIC_API_URL + METSERVICE_PUBLIC_API_ENDPOINTS.LOCAL_OBS + location!.replace(" ", "-");
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

        const embed = new EmbedBuilder()
            .setAuthor({
                iconURL: METSERVICE_ICON,
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
            });

        await interaction.editReply({ embeds: [embed] });
    }
} as Command;