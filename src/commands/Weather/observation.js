const { Client, Message } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { observationFormat } = require("../../struct/baseFormats");
const { apiURL, ApiEndpoints } = require("../../util/constants");

module.exports = {
    name: "observation",
    aliases: ["obs", "weather"],
    description: "Displays the current weather observation for a specified location.",
    category: "Weather",
    utilisation: "observation <location>",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        const location = args.join(" ");
        if (!location) return message.channel.send(client.emotes.error + " **A location is required**");

        let data = null;

        // Fetch data from MetService API
        try {
            const response = await fetch(apiURL + ApiEndpoints.OBSERVATION + location.replace(" ", "-"));
            data = await response.json();
        } catch (error) {
            if (error.name === "FetchError" && error.type === "invalid-json") {
                return message.channel.send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(error);
                return message.channel.send(client.emotes.error + " **Error**");
            }
        }

        // Format
        const payload = observationFormat(data);

        message.channel.send({ embeds: payload });
    }
}