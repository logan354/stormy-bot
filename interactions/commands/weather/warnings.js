const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const Bot = require("../../structures/Bot");
const emojis = require("../../data/emojis.json");
const { MetServiceCAPURL } = require("../../util/constants");
const { xml2js } = require("xml-js");
const { buildWarningMessage } = require("../../structures/messageBuilders");

module.exports = {
    name: "warnings",
    category: "Warnings",
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Displays the latest MetService Warnings and Watches."),

    /**
     * @param {Bot} bot
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(bot, interaction) {
        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);

        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return await interaction.reply(emojis.permission_fail + " **I do not have permission** to Embed Links in <#" + message.channel.id + ">");

        await interaction.deferReply();

        const data = []

        try {
            // Fetch MetService API
            const response = await fetch(MetServiceCAPURL);

            if (response.ok) {
                const xml = await response.text();
                const rawData = xml2js(xml, { compact: true, spaces: 4 });

                for (let i = 0; rawData.rss.channel.item ? i < rawData.rss.channel.item.length : i < 0; i++) {
                    const response = await fetch(rawData.rss.channel.item[i].link._text);
                    const xml = await response.text();

                    // Correcting rank of Severe Thunderstorm Warnings/Watches for data array
                    const json = xml2js(xml, { compact: true, spaces: 4 }).alert.info;
                    if (json.headline._text.includes("Severe Thunderstorm")) {
                        data.unshift(json);
                    }
                    else {
                        data.push(json);
                    }
                }
            }
            else {
                return await interaction.editReply(emojis.fail + " **Error**");
            }
        } catch (error) {
            console.error(error);
            return await interaction.editReply(emojis.fail + " **Error**");
        }

        const payload = buildWarningMessage(data);

        if (payload.length < 2) {
            await interaction.editReply(payload[0]);
        }
        else {
            const row = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setCustomId("warnings-button-previous")
                            .setEmoji("⬅️")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(),
                        new ButtonBuilder()
                            .setCustomId("warnings-button-next")
                            .setEmoji("➡️")
                            .setStyle(ButtonStyle.Secondary)
                    ]
                );

            let index = 0;

            const response = await interaction.editReply({ embeds: payload[index].embeds, components: [row] });

            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 }); // Button collector for 5 minutes

            collector.on("collect", (i) => {
                if (i.customId === "warnings-button-previous") {
                    index--;

                    if (index === 0) {
                        row.components[0].setDisabled(true);
                    }

                    row.components[1].setDisabled(false);

                    i.update({ embeds: payload[index].embeds, components: [row] });
                }
                else if (i.customId === "warnings-button-next") {
                    index++;

                    if (index === data.outlooks.length - 1) {
                        row.components[1].setDisabled(true);
                    }

                    row.components[0].setDisabled(false);

                    i.update({ embeds: payload[index].embeds, components: [row] });
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