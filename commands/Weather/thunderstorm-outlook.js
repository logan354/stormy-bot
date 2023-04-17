const { Client, Message, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseThunderstormOutlook } = require("../../structures/baseFormats");
const { apiBaseURL, apiOptions } = require("../../utils/constants");

module.exports = {
    name: "thunderstorm-outlook",
    aliases: ["tso"],
    category: "Weather",
    description: "Displays the severe weather outlook for New Zealand.",
    utilisation: "swo",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + message.channel.name + "`");
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Embed Links in** " + "`" + message.channel.name + "`");

        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.THUNDERSTORM_OUTLOOK);
            var data = await response.json();
        } catch (error) {
            console.error(error);
            return message.channel.send(client.emotes.error + " **Error**");
        }

        let currentPage = 1;

        const embed = new EmbedBuilder()
            .setColor("Grey")
            .setTitle(data.outlooks.length > 1 ? "Thunderstorm Outlook (" + currentPage + "/" + data.outlooks.length + ")" : "Thunderstorm Outlook")
            .setImage(baseThunderstormOutlook(data, currentPage - 1))
            .setTimestamp();

        if (data.outlooks.length > 1) {
            const row = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setLabel("Outlook")
                            .setURL("https://www.metservice.com/warnings/thunderstorm-outlook")
                            .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                            .setCustomId("thunderstorm-outlook-embed-previous")
                            .setEmoji("⬅️")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(),
                        new ButtonBuilder()
                            .setCustomId("thunderstorm-outlook-embed-next")
                            .setEmoji("➡️")
                            .setStyle(ButtonStyle.Secondary)
                    ]
                );

            const response = await message.channel.send({
                embeds: [embed],
                components: [row]
            });

            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 900000 });

            collector.on("collect", async i => {
                if (i.customId === "thunderstorm-outlook-embed-previous") {
                    currentPage--;

                    const embed2 = new EmbedBuilder(embed)
                        .setTitle(data.outlooks.length > 1 ? "Thunderstorm Outlook (" + currentPage + "/" + data.outlooks.length + ")" : "Thunderstorm Outlook")
                        .setImage(baseThunderstormOutlook(data, currentPage - 1))

                    const row2 = new ActionRowBuilder(row);
                    if (currentPage <= 1) row2.components[1].setDisabled();
                    row2.components[2].setDisabled(false);

                    await i.update({ embeds: [embed2], components: [row2] });
                }
                else if (i.customId === "thunderstorm-outlook-embed-next") {
                    currentPage++;

                    const embed2 = new EmbedBuilder(embed)
                        .setTitle(data.outlooks.length > 1 ? "Thunderstorm Outlook (" + currentPage + "/" + data.outlooks.length + ")" : "Thunderstorm Outlook")
                        .setImage(baseThunderstormOutlook(data, currentPage - 1))

                    const row2 = new ActionRowBuilder(row);
                    if (currentPage >= data.outlooks.length) row2.components[2].setDisabled();
                    row2.components[1].setDisabled(false);

                    await i.update({ embeds: [embed2], components: [row2] });
                }
            });

            collector.on("end", () => {
                const row2 = new ActionRowBuilder(row);
                row2.components[1].setDisabled();
                row2.components[2].setDisabled();

                response.edit({ components: [row2] });
            });
        }
        else {
            const row2 = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setLabel("Outlook")
                            .setURL("https://www.metservice.com/warnings/thunderstorm-outlook")
                            .setStyle(ButtonStyle.Link),
                    ]
                );

            message.channel.send({ embeds: [embed], components: [row2] });
        }
    }
}