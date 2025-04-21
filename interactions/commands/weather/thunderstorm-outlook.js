const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Bot = require("../../structures/Bot");
const emojis = require("../../data/emojis.json");
const { MetServiceAPIURL, MetServiceAPIEndpoints } = require("../../util/constants");
const { buildThunderstormOutlookMessage } = require("../../structures/messageBuilders");

module.exports = {
    name: "thunderstorm-outlook",
    category: "Warnings",
    data: new SlashCommandBuilder()
        .setName("thunderstorm-outlook")
        .setDescription("Displays the MetService Thunderstorm Outlook.")
        .addNumberOption(option =>
            option
                .setName("day")
                .setDescription("The outlook day.")
        ),

    /**
     * @param {Bot} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(bot, interaction) {
        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);

        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return await interaction.reply(emojis.permission_fail + " **I do not have permission** to Embed Links in <#" + message.channel.id + ">");

        await interaction.deferReply();

        const dayOpt = interaction.options.getNumber("day");

        let data = null;

        try {
            // Fetch MetService API
            const response = await fetch(MetServiceAPIURL + MetServiceAPIEndpoints.THUNDERSTORM_OUTLOOK);

            if (response.ok) {
                data = await response.json();
            }
            else {
                return await interaction.editReply(emojis.fail + " **Error**");
            }
        } catch (error) {
            console.error(error);
            return await interaction.editReply(emojis.fail + " **Error**");
        }

        if (dayOpt !== null) {
            if (day < 1 || day > data.outlooks.length) {
                return await interaction.editReply(emojis.fail + " The `day` option must be between `1` and `" + data.outlooks.length + "`");
            }
            else {
                const payload = buildThunderstormOutlookMessage(data, dayOpt);

                await interaction.editReply(payload[0]);
            }
        }
        else {
            const payload = buildThunderstormOutlookMessage(data);

            if (payload.length < 2) {
                await interaction.editReply(payload[0]);
            }
            else {
                const row = new ActionRowBuilder()
                    .addComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("thunderstorm-outlook-button-previous")
                                .setEmoji("⬅️")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(),
                            new ButtonBuilder()
                                .setCustomId("thunderstorm-outlook-button-next")
                                .setEmoji("➡️")
                                .setStyle(ButtonStyle.Secondary)
                        ]
                    );

                let index = 0;

                const response = await interaction.editReply({ embeds: payload[index].embeds, files: payload[index].files, components: [row] });

                const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 }); // Button collector for 5 minutes

                collector.on("collect", (i) => {
                    if (i.customId === "thunderstorm-outlook-button-previous") {
                        index--;

                        if (index === 0) {
                            row.components[0].setDisabled(true);
                        }

                        row.components[1].setDisabled(false);

                        i.update({ embeds: payload[index].embeds, files: payload[index].files, components: [row] });
                    }
                    else if (i.customId === "thunderstorm-outlook-button-next") {
                        index++;

                        if (index === data.outlooks.length - 1) {
                            row.components[1].setDisabled(true);
                        }

                        row.components[0].setDisabled(false);

                        i.update({ embeds: payload[index].embeds, files: payload[index].files, components: [row] });
                    }
                });

                collector.on("end", (collected, reason) => {
                    row.components[0].setDisabled(true);
                    row.components[1].setDisabled(true);

                    response.edit({ components: [row] });
                });
            }
        }
    }
}