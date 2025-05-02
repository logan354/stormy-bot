import { SlashCommandBuilder } from "discord.js";

import Command from "../../../structures/Command";

export default {
    name: "severe-weather-outlook",
    category: "Weather",
    data: new SlashCommandBuilder()
        .setName("severe-weather-outlook")
        .setDescription("Displays the MetService Severe Weather Outlook.")
        .addIntegerOption(option =>
            option
                .setName("day")
                .setDescription("Number")
                .setMinValue(1)
                .setMaxValue(4)
                .setRequired(false)
        ),
    async execute(bot, interaction) {
        if (interaction) throw ReferenceError();
    }
} as Command;