const { Client, Message, Permissions } = require("discord.js");
const { localForecast } = require("../../structures/formats");
const { LoadType } = require("../../utils/constants");

module.exports = {
    name: "forecast",
    aliases: ["f"],
    category: "Weather",
    description: "Displays the forecast for a specified location in New Zealand.",
    utilisation: "{prefix}forecast [outlook] <location>",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.me);
        if (!botPermissionsFor.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + message.channel.name + "`");

        let outlook = args[0];
        if (!outlook) outlook = 1;

        args.shift();

        const location = args.join(" ");
        if (!location) return message.channel.send(client.emotes.error + " A location is required");

        const res = await localForecast(location, outlook);
        if (res.loadType === LoadType.LOADED_DATA) {
            for (let i = 0; i < res.data.length; i++) {
                message.channel.send(res.data[i]);
            }
        } else {
            if (res.loadType === LoadType.NO_DATA) message.channel.send(client.emotes.error + " **" + res.exception + "**");
            else if (res.loadType === LoadType.LOAD_FAILED) message.channel.send(client.emotes.error + " **Error** `" + res.exception + "`");
        }
    }
}