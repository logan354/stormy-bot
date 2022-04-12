const { Client, Message, Permissions } = require("discord.js");
const { warnings } = require("../../structures/formats");
const { LoadType } = require("../../utils/constants");

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
        const botPermissionsFor = message.channel.permissionsFor(message.guild.me);
        if (!botPermissionsFor.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + message.channel.name + "`");

        const location = args.join(" ");
        if (!location) return message.channel.send(client.emotes.error + " A location is required");

        const res = await warnings(location);
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