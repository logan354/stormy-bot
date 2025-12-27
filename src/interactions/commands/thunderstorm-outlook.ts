import { AttachmentBuilder, ButtonStyle, ComponentType, PermissionsBitField, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { htmlToText } from "html-to-text";

import Command from "../../structures/Command";
import { METSERVICE_EMOJI_URL, METSERVICE_PUBLIC_API_ENDPOINTS, METSERVICE_PUBLIC_API_URL } from "../../utils/constants";
import { emojis } from "../../../config.json";

export default {
    name: "thunderstorm-outlook",
    data: new SlashCommandBuilder()
        .setName("thunderstorm-outlook")
        .setDescription("MetService Thunderstorm Outlook.")
        .addIntegerOption(option =>
            option
                .setName("days")
                .setDescription("The outlook day.")
                .setMinValue(1)
                .setMaxValue(4)
                .setRequired(false)
        ),
    async execute(bot, interaction) {
        const daysOption = interaction.options.getInteger("days") ?? 1;

        await interaction.deferReply();

        let data: any;

        try {
            const response = await fetch(METSERVICE_PUBLIC_API_URL + METSERVICE_PUBLIC_API_ENDPOINTS.THUNDERSTORM_OUTLOOK);

            if (response.status === 200) data = await response.json();
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

        if (daysOption > data.outlooks.length) {
            await interaction.editReply(emojis.error + " The `day` value must be between `1` and `" + data.outlooks.length + "`");
            return;
        }

        const embeds: EmbedBuilder[][] = [];
        const attachments: AttachmentBuilder[] = [];

        for (let i = 0; i < data.outlooks.length; i++) {
            const issuedDate = data.outlooks[i].issuedAt;
            const previousValidToDate = data.outlooks[i - 1] ? data.outlooks[i - 1].validTo : null;
            const validToDate = data.outlooks[i].validTo;

            const attachment = new AttachmentBuilder("https://www.metservice.com" + data.outlooks[i].url)
                .setName(data.outlooks[i].url.split("/").splice(-1)[0] + ".png");

            const embed1 = new EmbedBuilder()
                .setAuthor({
                    iconURL: METSERVICE_EMOJI_URL,
                    name: "MetService"
                })
                .setTitle("Thunderstorm Outlook (" + (i + 1) + "/" + data.outlooks.length + ")")
                .setDescription(`**Valid ${previousValidToDate ? "from " + previousValidToDate + " to " + validToDate : "to " + validToDate}**\n` + htmlToText(data.outlooks[i].text))
                .setFooter({
                    text: "Issued: " + issuedDate
                });

            const embed2 = new EmbedBuilder()
                .setImage("attachment://" + attachment.name);

            embeds.push([embed1, embed2]);
            attachments.push(attachment);
        }

        if (embeds.length > 1) {
            const actionRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setCustomId("thunderstorm-outlook-previous")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(emojis.previous)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId("thunderstorm-outlook-next")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(emojis.next)
                    ]
                );

            let currentDay = 1;

            const response = await interaction.editReply({ embeds: embeds[currentDay - 1], files: [attachments[currentDay - 1]], components: [actionRow] });
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on("collect", async (_interaction) => {
                if (_interaction.customId === "thunderstorm-outlook-previous" || _interaction.customId === "thunderstorm-outlook-next") {
                    if (_interaction.id === "thunderstorm-outlook-previous") currentDay--;
                    else currentDay++;

                    if (currentDay <= 1) actionRow.components[0].setDisabled(true);
                    else actionRow.components[0].setDisabled(false);

                    if (currentDay >= data.outlooks.length) actionRow.components[1].setDisabled(true);
                    else actionRow.components[1].setDisabled(false);

                    await _interaction.update({ embeds: embeds[currentDay - 1], files: [attachments[currentDay - 1]], components: [actionRow] });
                }
            });

            collector.on("end", () => {
                actionRow.components[0].setDisabled(true);
                actionRow.components[1].setDisabled(true);
            });
        }
        else await interaction.editReply({ embeds: embeds[0], files: [attachments[0]] });
    }
} as Command;