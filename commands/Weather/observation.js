const { Client, Message, PermissionsBitField } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseLocalObservation } = require("../../structures/baseFormats");
const { apiBaseURL, apiOptions } = require("../../utils/constants");

module.exports = {
    name: "observation",
    aliases: ["obs", "weather"],
    category: "Weather",
    description: "Displays the current weather observation for a specified location in New Zealand.",
    utilisation: "observation <location>",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + message.channel.name + "`");
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Embed Links in** " + "`" + message.channel.name + "`");

        const location = args.join(" ");
        if (!location) return message.channel.send(client.emotes.error + " **A location is required**");

        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.LOCAL_OBS + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return message.channel.send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return message.channel.send(client.emotes.error + " **Error** `" + e.message + "`");
            }
        }

        const embed = baseLocalObservation(data);
        message.channel.send({ embeds: [embed] });
    }
}