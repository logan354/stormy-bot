const { MessageEmbed } = require("discord.js");
const { formatFormalTime } = require("../../src/Utils");
const package = require("../../package.json");
const memory = 512;

module.exports = {
    name: "stats",
    aliases: [],
    category: "Utility",
    description: "Shows the bot's statistics",
    utilisation: "{prefix}stats",
    permissions: {
        channel: [],
        member: [],
    },

    execute(client, message, args) {
        const embed = new MessageEmbed()
            .setColor("GREY")
            .setAuthor("-- Stormy's Statistics --", client.config.app.logo)
            .setFields(
                {
                    name: ":joystick: Bot Statistics",
                    value: `Servers: **${client.guilds.cache.size}**\nUsers: **${client.users.cache.size}**\nChannels: **${client.channels.cache.size}**`
                },
                {
                    name: ":pencil: Bot Information",
                    value: `Creator: **Block354#3452**\nVersion: **${package.version}**\nLines of Code: **?**\nNumber of Commands: **${client.commands.size}**`
                },
                {
                    name: ":desktop: Hosting Statistics",
                    value: `Memory Usage: **${Math.trunc((process.memoryUsage().heapTotal / (memory * 1000000)) * 100)}% (${memory}mb)**\nUptime: **${formatFormalTime(client.uptime)}**\nDiscord.js: **v${package.dependencies["discord.js"].split("^")[1]}**\nOperating System: **${process.platform}**`
                }
            )
            .setTimestamp(new Date())
            .setFooter("Thanks For Choosing Stormy", client.config.app.logo);

        message.channel.send({ embeds: [embed] });
    },

    slashCommand: {
        options: [],

        execute(client, interaction, args) {

        }
    }
}

