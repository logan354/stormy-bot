const { Client, CommandInteraction, CommandInteractionOptionResolver, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseThunderstormOutlook } = require("../../structures/baseFormats");
const { apiBaseURL, apiOptions } = require("../../utils/constants");

module.exports = {
    name: "thunderstorm-outlook",
    category: "Weather",
    description: "Displays the thunderstorm outlook.",
    utilisation: "thunderstorm-outlook",

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {CommandInteractionOptionResolver} args 
     */
    async execute(client, interaction, args) {
        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + interaction.channel.name + "`");
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Embed Links in** " + "`" + interaction.channel.name + "`");

        interaction.deferReply();
        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.THUNDERSTORM_OUTLOOK);
            var data = await response.json();
        } catch (error) {
            console.error(error);
            return interaction.editReply(client.emotes.error + " **Error**");
        }

        let currentPage = 1;

        // Whether the outlook is the current one
        let isCurrentOutlook = true;

        const embed = new EmbedBuilder(baseThunderstormOutlook(data.outlooks[currentPage - 1], isCurrentOutlook))
            .setTitle(data.outlooks.length > 1 ? "Thunderstorm Outlook (" + currentPage + "/" + data.outlooks.length + ")" : "Thunderstorm Outlook");

        if (data.outlooks.length > 1) {
            const row = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setLabel("Product")
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

            const response = await interaction.editReply({
                embeds: [embed],
                components: [row]
            });

            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 900000 });

            collector.on("collect", async i => {
                if (i.customId === "thunderstorm-outlook-embed-previous") {
                    currentPage--;

                    if (currentPage === 1) isCurrentOutlook = true;
                    else isCurrentOutlook = false;

                    const embed2 = new EmbedBuilder(baseThunderstormOutlook(data.outlooks[currentPage - 1], isCurrentOutlook))
                        .setTitle(data.outlooks.length > 1 ? "Thunderstorm Outlook (" + currentPage + "/" + data.outlooks.length + ")" : "Thunderstorm Outlook");

                    const row2 = new ActionRowBuilder(row);
                    if (currentPage <= 1) row2.components[1].setDisabled();
                    row2.components[2].setDisabled(false);

                    await i.update({ embeds: [embed2], components: [row2] });
                }
                else if (i.customId === "thunderstorm-outlook-embed-next") {
                    currentPage++;

                    if (currentPage === 1) isCurrentOutlook = true;
                    else isCurrentOutlook = false;

                    const embed2 = new EmbedBuilder(baseThunderstormOutlook(data.outlooks[currentPage - 1], isCurrentOutlook))
                        .setTitle(data.outlooks.length > 1 ? "Thunderstorm Outlook (" + currentPage + "/" + data.outlooks.length + ")" : "Thunderstorm Outlook");

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
                            .setLabel("Product")
                            .setURL("https://www.metservice.com/warnings/thunderstorm-outlook")
                            .setStyle(ButtonStyle.Link),
                    ]
                );

            interaction.editReply({ embeds: [embed], components: [row2] });
        }
    }
}