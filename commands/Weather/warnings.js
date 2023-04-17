const { Client, Message, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { xml2js } = require("xml-js");
const { baseWarning } = require("../../structures/baseFormats");
const { capBaseURL } = require("../../utils/constants");

module.exports = {
    name: "warnings",
    aliases: ["warn", "w"],
    category: "Weather",
    description: "Displays the current MetService warnings & watches.",
    utilisation: "warnings",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + message.channel.name + "`");

        // Fetch data from MetService CAP Server
        try {
            const response = await fetch(capBaseURL);
            const xml = await response.text();
            const rawData = xml2js(xml, { compact: true, spaces: 4 });

            var data = [];

            for (let i = 0; rawData.rss.channel.item ? i < rawData.rss.channel.item.length : i < 0; i++) {
                const response = await fetch(rawData.rss.channel.item[i].link._text);
                const xml = await response.text();
                data.push(xml2js(xml, { compact: true, spaces: 4 }).alert.info);
            }
        } catch (error) {
            console.error(error);
            return message.channel.send(client.emotes.error + " **Error**");
        }

        const pages = []
        const pageSize = 5;
        let currentPage = 1;

        // Algorithm for sorting data into format data and then pages
        let j = 0;
        let k = 0;
        for (let i = 0; i < data.length; i++) {
            if (j === 0) pages[k] = baseWarning(data[i]);
            else pages[k] += baseWarning(data[i]);

            if (j === pageSize - 1) {
                j = 0;
                k++
            }
            else j++;
        }

        const embed = new EmbedBuilder()
            .setColor("Grey")
            .setTitle(pages.length > 1 ? "Warnings & Watches (" + currentPage + "/" + pages.length + ")" : "Warnings & Watches")
            .setDescription(pages.length > 0 ? pages[currentPage - 1] : "**No Warnings & Watches**")
            .setTimestamp();

        if (pages.length > 1) {
            const row = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setLabel("Warnings")
                            .setURL("https://www.metservice.com/warnings/home")
                            .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                            .setCustomId("warning-embed-previous")
                            .setEmoji("⬅️")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(),
                        new ButtonBuilder()
                            .setCustomId("warning-embed-next")
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
                if (i.customId === "warning-embed-previous") {
                    currentPage--;

                    const embed2 = new EmbedBuilder(embed)
                        .setTitle(pages.length > 1 ? "Warnings & Watches (" + currentPage + "/" + pages.length + ")" : "Warnings & Watches")
                        .setDescription(pages.length > 0 ? pages[currentPage - 1] : "**No Warnings & Watches**");

                    const row2 = new ActionRowBuilder(row);
                    if (currentPage <= 1) row2.components[1].setDisabled();
                    row2.components[2].setDisabled(false);

                    await i.update({ embeds: [embed2], components: [row2] });
                }
                else if (i.customId === "warning-embed-next") {
                    currentPage++;

                    const embed2 = new EmbedBuilder(embed)
                        .setTitle(pages.length > 1 ? "Warnings & Watches (" + currentPage + "/" + pages.length + ")" : "Warnings & Watches")
                        .setDescription(pages.length > 0 ? pages[currentPage - 1] : "**No Warnings & Watches**")

                    const row2 = new ActionRowBuilder(row);
                    if (currentPage >= pages.length) row2.components[2].setDisabled();
                    row2.components[1].setDisabled(false);

                    await i.update({ embeds: [embed2], components: [row2] });
                }
            });

            collector.on("end", () => {
                const row2 = new ActionRowBuilder(row);
                row2.components[1].setDisabled();
                row2.components[1].setDisabled();

                response.edit({ components: [row2] });
            });
        }
        else {
            const row2 = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setLabel("Warnings")
                            .setURL("https://www.metservice.com/warnings/home")
                            .setStyle(ButtonStyle.Link),
                    ]
                );

            message.channel.send({ embeds: [embed], components: [row2] });
        }
    }
}