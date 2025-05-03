import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { xml2json } from "xml-js";

import Command from "../../../structures/Command";
import { METSERVICE_CAP_RSS_URL, METSERVICE_ICON } from "../../../util/constants";
import { formatMetServiceDate, getMetServiceIconEmoji } from "../../../util/util";
import emojis from "../../../../emojis.json";

export default {
    name: "warnings",
    category: "Weather",
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("The current Watches, Warnings and Advisories for New Zealand issued by MetService."),
    async execute(bot, interaction) {
        if (!interaction.channel || !interaction.guild.members.me) return new ReferenceError();

        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(emojis.permission_error + " **I do not have permission to Use Embed Links in** <#" + interaction.channel.id + ">");

        const url = METSERVICE_CAP_RSS_URL;
        let data: any;

        await interaction.deferReply();

        try {
            const response = await fetch(url);

            if (response.status === 200) {
                const text = await response.text();
                data = JSON.parse(xml2json(text, { compact: true, spaces: 4 }));
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
            .setTitle("Warnings & Watches")
            .setDescription("No Weather Warnings or Watches in force.")
            .setTimestamp();

        if (!data.rss.channel.item) return interaction.editReply({ embeds: [embed] });

        const embeds: EmbedBuilder[] = [];

        let j = 0;
        for (let i = 0; i < Math.ceil(data.rss.channel.item.length / 7); i++) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "MetService",
                    iconURL: METSERVICE_ICON
                })
                .setTitle("Warnings & Watches")
                .setTimestamp();

            let description = "";

            while (j < data.rss.channel.item.length && j < (i + 1) * 7) {
                let _data: any;

                try {
                    const response = await fetch(data.rss.channel.item[j].link._text);

                    if (response.status === 200) {
                        const text = await response.text();
                        _data = JSON.parse(xml2json(text, { compact: true, spaces: 4 })).alert.info;
                    }
                    else {
                        return await interaction.editReply(emojis.error + " **Error**");
                    }
                }
                catch (error) {
                    console.error(error);
                    return await interaction.editReply(emojis.error + " **Error**");
                }

                let colourCode = null;

                _data.parameter.forEach((x: any) => {
                    if (x.valueName._text === "ColourCode") colourCode = x.value._text;
                });

                const effectiveDate = new Date(data.onset._text);
                const expiresDate = new Date(data.expires._text);

                const effectiveDateFormat = formatMetServiceDate(effectiveDate, true, { useNoon: true });
                const expiresDateFormat = formatMetServiceDate(expiresDate, true, { useNoon: true });

                description += `${getMetServiceIconEmoji(data.headline._text.includes("Watch") ? "watch" : colourCode + "_warning")} **${data.headline._text}**\n**Area:** ${data.area.areaDesc._text}\n**Period:** ${data.headline._text === "Severe Thunderstorm Warning" ? "until " + expiresDateFormat : effectiveDateFormat + " - " + expiresDateFormat}\n\n`;

                j++;
            }

            embed.setDescription(description);
            embeds.push(embed);
        }

        if (embeds.length > 1) {
            const actionRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setCustomId("warning-previous-button")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(emojis.previous_button)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId("warning-next-button")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(emojis.next_button)
                    ]
                );

            let currentEmbed = 1;

            const response = await interaction.editReply({ embeds: [embeds[currentEmbed - 1]], components: data.outlooks.length > 1 ? [actionRow] : [] });
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 }); // Button collector for 1 minute

            collector.on("collect", async (_interaction) => {
                if (_interaction.customId === "warning-previous-button" || _interaction.customId === "warning-next-button") {
                    if (_interaction.id === "warning-previous-button") currentEmbed--;
                    else currentEmbed++;

                    if (currentEmbed <= 1) actionRow.components[0].setDisabled(true);
                    else actionRow.components[0].setDisabled(false);

                    if (currentEmbed >= data.outlooks.length) actionRow.components[1].setDisabled(true);
                    else actionRow.components[1].setDisabled(false);

                    await _interaction.update({ embeds: [embeds[currentEmbed - 1]], components: [actionRow] });
                }
            });

            collector.on("end", () => {
                actionRow.components[0].setDisabled(true);
                actionRow.components[1].setDisabled(true);
            });
        }
        else await interaction.editReply({ embeds: [embeds[0]] });
    },
} as Command;