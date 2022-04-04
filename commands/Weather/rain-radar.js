const { Client, Message, Permissions } = require("discord.js");
const { rainRadar } = require("../../structures/database");
const { LoadType } = require("../../utils/constants");

module.exports = {
    name: "rainradar",
    aliases: ["radar", "rr"],
    category: "Weather",
    description: "Displays the current rain radar image for a specified location in New Zealand.",
    utilisation: "{prefix}rainradar <location>",

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
        if (!location) return message.channel.send(client.emotes.error + " A location is required");

        const res = await rainRadar(location);
        if (res.loadType === LoadType.LOADED_DATA) message.channel.send({ embeds: [res.data] });
        else {
            if (res.loadType === LoadType.NO_DATA) message.channel.send(client.emotes.error + " **" + res.exception + "**");
            else if (res.loadType === LoadType.LOAD_FAILED) message.channel.send(client.emotes.error + " **Error** `" + res.exception + "`");
        }
    }
}