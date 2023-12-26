const { PermissionsBitField, Message, EmbedBuilder } = require("discord.js");
const Bot = require("../../../structures/Bot");
const emojis = require("../../../data/emojis.json");

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
            const command = bot.messageCommands.get(args.join(" ").toLowerCase()) || bot.messageCommands.find((x) => x.aliases && x.aliases.includes(args.join(" ").toLowerCase()));

            if (!command) return message.channel.send(emojis.fail + " **I could not find that command**");

            const embed = new EmbedBuilder()
                .setColor("Grey")
                .setTitle(command.name.charAt(0).toUpperCase() + command.name.slice(1) + " Command")
                .setDescription(command.description)
                .setThumbnail(message.guild.iconURL())
                .setFields(
                    {
                        name: "Usage",
                        value: "<@" + bot.client.user.id + "> `" + this.usage + "`",
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
                .setTimestamp(new Date())
                .setFooter({
                    text: "Required arguments: `<>` | Optional arguments: `[]`"
                });

            message.channel.send({ embeds: [embed] });
        }
        else {
            const embed = new EmbedBuilder()
                .setColor("Grey")
                .setTitle("Help Centre")
                .setDescription("**Hello <@" + message.author.id + ">, welcome to the Help Centre.**\n\nBelow is a list of all my commands. Type <@" + bot.client.user.id + "> `" + this.usage + "` to get information about a specific command.")
                .setThumbnail(message.guild.iconURL())
                .setFields(
                    {
                        name: "Weather",
                        value: bot.messageCommands.filter((x) => x.category === "Weather").map((x) => "`" + x.name + "`").join(", "),
                    },
                    {
                        name: "Utility",
                        value: bot.messageCommands.filter((x) => x.category === "Utility").map((x) => "`" + x.name + "`").join(", "),
                    }
                )
                .setTimestamp(new Date())
                .setFooter({
                    text: "Total commands: " + bot.messageCommands.size
                });

            message.channel.send({ embeds: [embed] });
        }
    }
}