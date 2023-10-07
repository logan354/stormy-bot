const { Client, CommandInteraction, CommandInteractionOptionResolver, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { formatFormalTime } = require("../../util/formats");
const { version, dependencies } = require("../../../package.json");

module.exports = {
    name: "statistics",
    category: "Utility",
    description: "Displays statistic information about Stormy.",
    utilisation: "statistics",

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} args 
     */
    execute(client, interaction, args) {
        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Embed Links in** <#" + interaction.channel.id + ">");

        let members = 0;
        client.guilds.cache.forEach(x => members += x.memberCount)

        const embed = new EmbedBuilder()
            .setColor("Default")
            .setAuthor({
                name: "Information",
                iconURL: client.user.avatarURL()
            })
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
            .setFooter({
                text: "Thanks For choosing Stormy",
                iconURL: client.user.avatarURL()
            });

        interaction.reply({ embeds: [embed] });
    }
}