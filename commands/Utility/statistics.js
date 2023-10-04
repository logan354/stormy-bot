const { Message, PermissionsBitField, EmbedBuilder, Colors } = require("discord.js");
const Bot = require("../../struct/Bot");
const emojis = require("../../data/emojis.json");
const { formatFormalTime } = require("../../util/formatters");
const { version, dependencies } = require("../../package.json");

module.exports = {
    name: "statistics",
    aliases: ["stats"],
    description: "Displays statistical information about Bass.",
    category: "Utility",
    utilisation: "statistics",

    /**
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(bot, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return message.channel.send(emojis.permissionError + " **I do not have permission to Embed Links in** <#" + message.channel.id + ">");

        let members = 0;
        client.guilds.cache.forEach(x => members += x.memberCount)

        const embed = new EmbedBuilder()
            .setColor(Colors.DarkGreen)
            .setTitle("Statistics")
            .setFields(
                {
                    name: ":joystick: Bot Statistics",
                    value: `Servers: **${client.guilds.cache.size}**\nMembers: **${members}**\nText Channels: **${client.channels.cache.filter(x => x.isTextBased()).size}**\nVoice Channels: **${client.channels.cache.filter(x => x.isVoiceBased()).size}**`
                },
                {
                    name: ":pencil: Bot Information",
                    value: `Developer: <@499372750171799554>\nVersion: **${version}**\nNumber of Commands: **${client.commands.size}**`
                },
                {
                    name: ":desktop: Hosting Statistics",
                    value: `Memory Usage: **${Math.trunc(process.memoryUsage().heapUsed / 1000000)}% (${Math.trunc(process.memoryUsage().heapTotal / 1000000)}mb)**\nUptime: **${formatFormalTime(client.uptime)}**\nDiscord.js: **v${dependencies["discord.js"].split("^")[1]}**\nOperating System: **${process.platform}**`
                }
            )
            .setTimestamp(new Date())

        message.channel.send({ embeds: [embed] });
    }
}