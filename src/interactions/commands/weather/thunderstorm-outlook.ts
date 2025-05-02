import { AttachmentBuilder, ButtonStyle, ComponentType, PermissionsBitField, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { htmlToText } from "html-to-text";

import Command from "../../../structures/Command";
import { METSERVICE_ICON, METSERVICE_PUBLIC_API_ENDPOINTS, METSERVICE_PUBLIC_API_URL } from "../../../util/constants";
import emojis from "../../../../emojis.json";

export default {
    name: "thunderstorm-outlook",
    category: "Weather",
    data: new SlashCommandBuilder()
        .setName("thunderstorm-outlook")
        .setDescription("Displays the MetService Thunderstorm Outlook.")
        .addIntegerOption(option =>
            option
                .setName("day")
                .setDescription("The outlook day.")
                .setMinValue(1)
                .setMaxValue(4)
                .setRequired(false)
        ),
    async execute(bot, interaction) {
        if (!interaction.channel || !interaction.guild.members.me) return new ReferenceError();

        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(emojis.permission_error + " **I do not have permission to Use Embed Links in** <#" + interaction.channel.id + ">");

        const day = interaction.options.getInteger("day") ?? 1;

        const url = METSERVICE_PUBLIC_API_URL + METSERVICE_PUBLIC_API_ENDPOINTS.THUNDERSTORM_OUTLOOK;
        let data: any;

        await interaction.deferReply();

        try {
            const response = await fetch(url);

            if (response.status === 200) {
                data = await response.json();
            }
            else {
                return await interaction.editReply(emojis.error + " **Error**");
            }
        }
        catch (error) {
            console.error(error);
            return await interaction.editReply(emojis.error + " **Error**");
        }

        if (day > data.outlooks.length) return await interaction.editReply(emojis.error + " The `day` value must be between `1` and `" + data.outlooks.length + "`");

        const embeds: EmbedBuilder[][] = [];
        const attachments: AttachmentBuilder[] = [];

        for (let i = 0; i < data.outlooks.length; i++) {
            const issuedDate = data.outlooks[i].issuedAt;
            const previousValidToDate = data.outlooks[i - 1] ? data.outlooks[i - 1].validTo : null;
            const validToDate = data.outlooks[i].validTo;

            let section = `**Valid ${previousValidToDate ? "from " + previousValidToDate + " to " + validToDate : "to " + validToDate}**\n` + htmlToText(data.outlooks[i].text);

            const attachment = new AttachmentBuilder("https://www.metservice.com" + data.outlooks[i].url)
                .setName(data.outlooks[i].url.split("/").splice(-1)[0] + ".png");

            const embed1 = new EmbedBuilder()
                .setAuthor({
                    iconURL: METSERVICE_ICON,
                    name: "MetService"
                })
                .setTitle("Thunderstorm Outlook (" + (i + 1) + "/" + data.outlooks.length + ")")
                .setDescription(section)
                .setFooter({
                    text: "Issued: " + issuedDate
                });

            const embed2 = new EmbedBuilder()
                .setImage("attachment://" + attachment.name);

            embeds.push([embed1, embed2]);
            attachments.push(attachment)
        }

        if (embeds.length > 1) {
            const actionRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setCustomId("thunderstorm-outlook-previous-button")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ id: "896608983429808129" })
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId("thunderstorm-outlook-next-button")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ id: "896608983429808129" })
                    ]
                );

            let currentDay = day;

            const response = await interaction.editReply({ embeds: embeds[currentDay - 1], files: [attachments[currentDay - 1]], components: [actionRow] });
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 }); // Button collector for 5 minutes

            collector.on("collect", async (_interaction) => {
                if (_interaction.customId === "thunderstorm-outlook-previous-button" || _interaction.customId === "thunderstorm-outlook-next-button") {
                    if (_interaction.id === "thunderstorm-outlook-previous-button") currentDay--;
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