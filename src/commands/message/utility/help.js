const { PermissionsBitField, Message, EmbedBuilder } = require("discord.js");
const Bot = require("../../../struct/Bot");
const emojis = require("../../../../data/emojis.json");

module.exports = {
    name: "help",
    description: "Displays information and commands.",
    category: "Utility",
    usage: "help [command]",
    aliases: [],
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
        if (args[0]) {
            const command = bot.commands.get(args.join(" ").toLowerCase()) || bot.commands.find((x) => x.aliases && x.aliases.includes(args.join(" ").toLowerCase()));

            if (!command) return message.channel.send(emojis.fail + " **I could not find that command**");

            const embed = new EmbedBuilder()
                .setColor("Grey")
                .setTitle(command.name.charAt(0).toUpperCase() + command.name.slice(1) + " Command")
                .setDescription("Required arguments: `<>` | Optional arguments: `[]`\n\n" + command.description)
                .setThumbnail(message.guild.iconURL())
                .setFields(
                    {
                        name: "Usage",
                        value: "<@" + bot.client.user.id + "> `" + this.utilisation + "`",
                        inline: true
                    },
                    {
                        name: "Category",
                        value: "`" + command.category + "`",
                        inline: true
                    },
                    {
                        name: "Permission(s)",
                        value: command.permissions.member.length === 0 ? "`None`" : command.permissions.member.map((x) => "`" + x[0] + "`").join(", ")
                    }
                )
                .setTimestamp(new Date());

            message.channel.send({ embeds: [embed] });
        }
        else {
            const embed = new EmbedBuilder()
                .setColor("Grey")
                .setTitle("Help Centre")
                .setDescription("**Hello <@" + message.author.id + ">, welcome to the Help Centre.**\n\nBelow is a list of all my commands. Type <@" + bot.client.user.id + "> `" + this.utilisation + "` to get information about a specific command.")
                .setThumbnail(message.guild.iconURL())
                .setFields(
                    {
                        name: "Weather",
                        value: bot.commands.filter((x) => x.category === "Weather").map((x) => "`" + x.name + "`").join(", "),
                    },
                    {
                        name: "Utility",
                        value: bot.commands.filter((x) => x.category === "Utility").map((x) => "`" + x.name + "`").join(", "),
                    }
                )
                .setTimestamp(new Date())
                .setFooter({
                    text: "Total commands: " + bot.commands.size
                });

            message.channel.send({ embeds: [embed] });
        }
    }
}