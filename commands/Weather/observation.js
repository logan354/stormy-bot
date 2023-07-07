const { Client, Message, PermissionsBitField } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseObservation } = require("../../structures/baseFormats");
const { apiBaseURL, apiOptions } = require("../../utils/constants");

module.exports = {
    name: "observation",
    aliases: ["obs", "weather"],
    category: "Weather",
    description: "Displays the current weather observation for a specified location.",
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
            const response = await fetch(apiBaseURL + apiOptions.OBSERVATION + location.replace(" ", "-"));
            var data = await response.json();
        } catch (error) {
            if (error.name === "FetchError" && error.type === "invalid-json") {
                return message.channel.send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(error);
                return message.channel.send(client.emotes.error + " **Error**");
            }
        }

        const embed = baseObservation(data);

        message.channel.send({ embeds: [embed] });
    }
}