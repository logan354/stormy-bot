import { SlashCommandBuilder } from "discord.js";

import Command from "../../../structures/Command";
import emojis from "../../../../emojis.json";

export default {
    name: "severe-weather-outlook",
    category: "Weather",
    data: new SlashCommandBuilder()
        .setName("severe-weather-outlook")
        .setDescription("MetService Severe Weather Outlook.")
        .addIntegerOption(option =>
            option
                .setName("day")
                .setDescription("The outlook day.")
                .setMinValue(1)
                .setMaxValue(4)
                .setRequired(false)
        ),
    async execute(bot, interaction) {
        await interaction.reply({ content: emojis.error + "Command unavailable", flags: ["Ephemeral"] });
    }
} as Command;