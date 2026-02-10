import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { XMLParser } from "fast-xml-parser";

import Command from "../../structures/Command";
import { METSERVICE_CAP_RSS_URL, METSERVICE_EMOJI_URL } from "../../utils/constants";
import { formatMetServiceDate, getMetServiceIconEmoji } from "../../utils/util";
import { emojis } from "../../../config.json";

export default {
    name: "warnings",
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("The current Warnings and Watches for New Zealand issued by MetService."),
    async execute(bot, interaction) {
        await interaction.deferReply();

        let data;

        try {
            const response = await fetch(METSERVICE_CAP_RSS_URL);

            if (response.ok) {
                const text = await response.text();
                data = new XMLParser().parse(text);
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

        if (!data.rss.channel.item.length) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    iconURL: METSERVICE_EMOJI_URL,
                    name: "MetService"
                })
                .setTitle("Warnings & Watches")
                .setDescription("No Weather Warnings or Watches in force.")
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const embeds: EmbedBuilder[] = [];

        let j = 0;

        for (let i = 0; i < Math.ceil(data.rss.channel.item.length / 5); i++) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "MetService",
                    iconURL: METSERVICE_EMOJI_URL
                })
                .setTitle("Warnings & Watches")
                .setTimestamp();

            let description = "";

            while (j < data.rss.channel.item.length && j < (i + 1) * 5) {
                let itemData: any;

                try {
                    const response = await fetch(data.rss.channel.item[j].link);

                    if (response.ok) {
                        const text = await response.text();
                        itemData = new XMLParser().parse(text).alert.info;
                    }
                    else {
                        await interaction.editReply(emojis.error + " **Error**");
                        return;
                    }
                }
                catch (error) {
                    console.error(error);
                    await interaction.editReply(emojis.error + " **Error**");
                    return;
                }

                let warningColourCode: string = "";

                itemData.parameter.forEach((x: any) => {
                    if (x.valueName=== "ColourCode") warningColourCode = x.value;
                });

                const effectiveDate = new Date(itemData.onset);
                const expiresDate = new Date(itemData.expires);

                const effectiveDateFormat = formatMetServiceDate(effectiveDate, true, { useNoon: true });
                const expiresDateFormat = formatMetServiceDate(expiresDate, true, { useNoon: true });

                const metserviceIconEmojiKey = warningColourCode.toLowerCase() === "yellow" ? "watch" : warningColourCode.toLowerCase() + "_warning";

                const title = `${getMetServiceIconEmoji(metserviceIconEmojiKey)} **${itemData.headline}**`;
                const area = `\n**Area:** ${itemData.area.areaDesc.replaceAll(",", ", ")}`;
                const period = `\n**Period:** ${itemData.headline === "Severe Thunderstorm Warning" ? "until " + expiresDateFormat : effectiveDateFormat + " - " + expiresDateFormat}`;
                const forecast = `\n**Forecast:** ${itemData.description}`;

                description += title + area + period + forecast + "\n\n"

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
                            .setCustomId("warning-previous")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(emojis.previous)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId("warning-next")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(emojis.next)
                    ]
                );

            let currentEmbed = 1;

            const response = await interaction.editReply({ embeds: [embeds[currentEmbed - 1]], components: [actionRow] });
            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on("collect", async (_interaction) => {
                if (_interaction.customId === "warning-previous" || _interaction.customId === "warning-next") {
                    if (_interaction.id === "warning-previous") currentEmbed--;
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