import { SlashCommandBuilder } from "discord.js";

import Command from "../../structures/Command";
import { emojis } from "../../../config.json";

export default {
    name: "severe-weather-outlook",
    data: new SlashCommandBuilder()
        .setName("severe-weather-outlook")
        .setDescription("MetService Severe Weather Outlook.")
        .addIntegerOption(option =>
            option
                .setName("days")
                .setDescription("The outlook day.")
                .setMinValue(1)
                .setMaxValue(4)
                .setRequired(false)
        ),
    async execute(bot, interaction) {
        await interaction.reply({ content: emojis.error + "Not Currently Supported" });
    }
} as Command;