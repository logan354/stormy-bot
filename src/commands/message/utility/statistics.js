const { PermissionsBitField, Message, EmbedBuilder } = require("discord.js");
const Bot = require("../../../struct/Bot");
const config = require("../../../../config.json");
const { version, dependencies } = require("../../../../package.json");
const { formatUptime } = require("../../../util/util");
const os = require("os");

module.exports = {
    name: "statistics",
    aliases: ["stats"],
    description: "Displays statistical information about the bot.",
    category: "Utility",
    permissions: {
        client: [
            ["Embed Links", PermissionsBitField.Flags.EmbedLinks]
        ],
        member: []
    },
    utilisation: "statistics",

    /**
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(bot, message, args) {
        const paragraph1 = `Servers: ${bot.client.guilds.cache.size}\nUsers: ${bot.client.users.cache.size}`;
        const paragraph2 = `Owner: <@${config.owner_id}>\nVersion: ` + "`v" + version + "`" + `\ndiscord.js: ` + "`v" + dependencies["discord.js"].split("^")[1] + "`";
        const paragraph3 = `Uptime: ${formatUptime(bot.client.uptime)}\nCPU: 0% (0GHz)\nMemory: ${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(1)}/${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB (${Math.trunc(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)}%)\nOS: ${os.platform()}`

        const embed = new EmbedBuilder()
            .setColor("Grey")
            .setTitle("Statistics")
            .setDescription(`__**Bot**__\n${paragraph1}\n\n__**Information**__\n${paragraph2}\n\n__**Hosting**__\n${paragraph3}`)
            .setThumbnail(bot.client.user.avatarURL())
            .setTimestamp(new Date())

        message.channel.send({ embeds: [embed] });
    }
}