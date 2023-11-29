const { Client, Message, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { apiURL, APIEndpoints } = require("../../util/constants");
const { buildObservationMessage } = require("../../struct/messageBuilders");

module.exports = {
    name: "observation",
    aliases: ["obs", "weather"],
    description: "Displays the current weather observation for a specified location.",
    category: "Weather",
    permissions: {
        client: [
            ["Embed Links", PermissionsBitField.Flags.EmbedLinks]
        ],
        member: []
    },
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

        // Fetch MetService API JSON data  
        try {
            const response = await fetch(apiURL + APIEndpoints.OBSERVATION + location.replace(" ", "-"));
            data = await response.json();
        } catch (error) {
            if (error.name === "FetchError" && error.type === "invalid-json") {
                return message.channel.send(client.emotes.error + " **Unknown/Invalid location**");
            } else {
                console.error(error);
                return message.channel.send(client.emotes.error + " **Error**");
            }
        }

        const payload = buildObservationMessage(data);

        const row = new ActionRowBuilder()
        .addComponents(
            [
                new ButtonBuilder()
                    .setLabel("Observations")
                    .setURL("https://www.metservice.com/national")
                    .setStyle(ButtonStyle.Link),
            ]
        )

        message.channel.send({ embeds: payload, components: [row] });
    }
}