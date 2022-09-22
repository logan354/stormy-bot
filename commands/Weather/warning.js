const { Client, Message, PermissionsBitField } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseWarningTitle, baseWarning } = require("../../src/baseFormats");
const { getIconEmojiID } = require("../../src/icons");
const { METSERVICE_BASE, API_OPTIONS } = require("../../utils/constants");

module.exports = {
    name: "warning",
    aliases: ["warn", "w"],
    category: "Weather",
    description: "Displays the current MetService issued warnings for a specified location in New Zealand.",
    utilisation: "{prefix}warning <location>",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + message.channel.name + "`");

        const location = args.join(" ");
        if (!location) return message.channel.send(client.emotes.error + " **A location is required**");

        // Fetch data from MetService API
        try {
            const response = await fetch(METSERVICE_BASE + API_OPTIONS.WARNINGS + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return message.channel.send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return message.channel.send(client.emotes.error + " **Error** `" + e.message + "`");
            }
        }

        const finalData = [];
        const charLimit = 2000;
        let k = 0;

        for (let i = 0; i < data.warnings.length; i++) {
            if (i === 0) finalData[k] = baseWarningTitle(data);

            if (finalData[k].length + baseWarning(i, data).length > charLimit) {
                k++
                finalData[k] = baseWarning(i, data);
            } else {
                finalData[k] += baseWarning(i, data);
            }
        }

        if (!finalData.length) finalData[k] = baseWarningTitle(data) + "\n\nNo warnings for this region";

        // Iterate through formatted data array
        for (let i of finalData) {
            message.channel.send(i);
        }
    }
}