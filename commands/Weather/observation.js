const { Client, Message, Permissions } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { base_local_observation } = require("../../src/baseFormats");
const { METSERVICE_BASE, API_OPTIONS } = require("../../utils/constants");

module.exports = {
    name: "observation",
    aliases: ["obs", "weather"],
    category: "Weather",
    description: "Displays the current weather observation for a specified location in New Zealand.",
    utilisation: "{prefix}observation <location>",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.me);
        if (!botPermissionsFor.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + message.channel.name + "`");
        if (!botPermissionsFor.has(Permissions.FLAGS.EMBED_LINKS)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Embed Links in** " + "`" + message.channel.name + "`");

        const location = args.join(" ");
        if (!location) return message.channel.send(client.emotes.error + " **A location is required**");

        // Fetch data from MetService API
        try {
            const response = await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_OBS + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return message.channel.send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return message.channel.send(client.emotes.error + " **Error** `" + e.message + "`");
            }
        }

        const embed = base_local_observation(data);
        message.channel.send({ embeds: [embed] });
    }
}