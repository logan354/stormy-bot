const { PermissionsBitField, Message, EmbedBuilder } = require("discord.js");
const Bot = require("../../struct/Bot");
const emojis = require("../../../data/emojis.json");
const { formatFormalTime } = require("../../util/util");
const { version, dependencies } = require("../../../package.json");

module.exports = {
    name: "statistics",
    aliases: ["stats"],
    description: "Displays statistical information about the bot.",
    category: "Utility",
    utilisation: "statistics",
    permissions: {
        client: [
            ["Embed Links", PermissionsBitField.Flags.EmbedLinks]
        ],
        member: []
    },

    /**
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(bot, message, args) {
        let totalGuildMembers = 0;
        client.guilds.cache.forEach(x => members += x.memberCount)

        const embed = new EmbedBuilder()
            .setColor("Grey")
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