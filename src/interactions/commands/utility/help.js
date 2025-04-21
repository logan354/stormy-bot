const { Message, EmbedBuilder } = require("discord.js");
const Bot = require("../../../../structures/Bot");
const emojis = require("../../../data/emojis.json");

module.exports = {
    name: "help",
    aliases: [],
    description: "Displays bot information and commands.",
    category: "Utility",
    options: [
        {
            name: "command",
            description: "A specific command."
        }
    ],

    /**
     * @param {Bot} bot
     * @param {Message} message
     * @param {string[]} args
     */
    execute(bot, message, args) {
        if (args[0]) {
            const command = bot.commands.get(args.join(" "));
            if (!command) return message.channel.send(emojis.fail + " I could not find that command");


            let heading = "**/" + command.name + "**\n" + command.data.description

            let example = "\n\n**Options**" + command.data.options.map((x) => {
                let beginOptionCase, endOptionCase;
                if (!x.required) {
                    beginOptionCase = "[";
                    endOptionCase = "]";
                }
                else {
                    beginOptionCase = "<";
                    endOptionCase = ">";
                }

                return "\n`" + beginOptionCase + x.name + endOptionCase + "` - " + x.description;
            }).join(" ");

            const embed = new EmbedBuilder()
                .setTitle("Help Centre")
                .setDescription(heading + example)
                .setThumbnail(message.guild.iconURL())
                .setFields(
                    {
                        name: "Category",
                        value: command.category,
                        inline: true
                    },
                    {
                        name: "Example",
                        value: "0",
                        inline: true
                    },
                )
                .setTimestamp(new Date())

            message.channel.send({ embeds: [embed] });
        }
        else {
            const embed = new EmbedBuilder()
                .setTitle("Help Centre")
                .setDescription("**Hello <@" + message.author.id + ">, welcome to the Help Centre.**\n\nBelow is a list of all my commands. Type <@" + bot.client.user.id + "> `" + this.usage + "` to get information about a specific command.")
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