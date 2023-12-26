const { PermissionsBitField, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Bot = require("../../../structures/Bot");
const emojis = require("../../../data/emojis.json");

module.exports = {
    name: "severe-weather-outlook",
    aliases: ["swo"],
    description: "Displays the severe weather outlook product.",
    category: "Weather",
    permissions: {
        client: [
            ["Embed Links", PermissionsBitField.Flags.EmbedLinks]
        ],
        member: []
    },
    utilisation: "severe-weather-outlook",

    /**
     * @param {Bot} bot
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(bot, message, args) {
        const row = new ActionRowBuilder()
            .addComponents(
                [
                    new ButtonBuilder()
                        .setLabel("Product")
                        .setURL("https://www.metservice.com/warnings/severe-weather-outlook")
                        .setStyle(ButtonStyle.Link),
                ]
            );

        message.channel.send({ content: emojis.neutral + " No Data", components: [row] });
    }
}