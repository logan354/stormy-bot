const { Message, PermissionsBitField, EmbedBuilder, Colors } = require("discord.js");
const Bot = require("../../struct/Bot");
const emojis = require("../../data/emojis.json");

module.exports = {
    name: "help",
    aliases: [],
    description: "Displays help information about the bot.",
    category: "Utility",
    utilisation: "help [command]",
    permissions: {
        channel: [],
        member: []
    },

    /**
     * @param {Bot} bot
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(bot, message, args) {
        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor(Colors.DarkGreen)
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
                .setFooter({ text: "Total commands: " + bot.commands.size });

            message.channel.send({ embeds: [embed] });
        }
        else {
            const command = bot.commands.get(args.join(" ").toLowerCase()) || bot.commands.find((x) => x.aliases && x.aliases.includes(args.join(" ").toLowerCase()));

            if (!command) return message.channel.send(emojis.fail + " **I could not find that command**");

            const embed = new EmbedBuilder()
                .setColor(Colors.DarkGreen)
                .setTitle(command.name.charAt(0).toUpperCase() + command.name.slice(1) + " Command")
                .setDescription("Required arguments `<>`, optional arguments `[]`")
                .setThumbnail(message.guild.iconURL())
                .setFields(
                    {
                        name: "Description",
                        value: command.description,
                    },
                    {
                        name: "Category",
                        value: "`" + command.category + "`",
                        inline: true
                    },
                    {
                        name: "Aliase(s)",
                        value: command.aliases.length === 0 ? "`None`" : command.aliases.map((aliase) => "`" + aliase + "`").join(", "),
                        inline: true
                    },
                    {
                        name: "Utilisation",
                        value: "<@" + bot.client.user.id + "> `" + this.utilisation + "`",
                        inline: true
                    }
                )
                .setTimestamp(new Date());

            message.channel.send({ embeds: [embed] });
        }
    }
}