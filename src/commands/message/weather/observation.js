const { PermissionsBitField, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Bot = require("../../../struct/Bot");
const emojis = require("../../../../data/emojis.json");
const { default: fetch } = require("node-fetch");
const { apiURL, APIEndpoints } = require("../../../util/constants");
const { buildObservationMessage } = require("../../../struct/messageBuilders");

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
     * @param {Bot} bot
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(bot, message, args) {
        // Define location parameter
        const location = args.join(" ");
        if (!location) return message.channel.send(emojis.fail + " **A location is required**");

        // Fetch MetService API JSON data
        let data = null;

        try {
            const response = await fetch(apiURL + APIEndpoints.OBSERVATION + location.replace(" ", "-"));

            if (response.ok) {
                data = await response.json();
            }
            else {
                if (response.status === 404) {
                    return message.channel.send(emojis.fail + " **Invalid/Unknown location**");
                }
                else {
                    return message.channel.send(emojis.fail + " **Error**")
                }
            }
        } catch (error) {
            console.error(error);
            return message.channel.send(emojis.fail + " **Error**");
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

        message.channel.send({ embeds: [payload], components: [row] });
    }
}