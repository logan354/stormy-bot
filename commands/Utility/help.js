const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "Utility",
    description: "Shows the bot's commands.",
    utilisation: "{prefix}help <command name>",
    permissions: {
        channel: [],
        member: [],
    },

    execute(client, message, args) {
        if (!args[0]) {
            // Command categories
            const weather = client.commands.filter(x => x.category == "Weather").map((x) => "`" + x.name + "`");
            const utility = client.commands.filter(x => x.category == "Utility").map((x) => "`" + x.name + "`");

            const embed = new MessageEmbed()
                .setColor("BLACK")
                .setAuthor("Stormy Commands", client.config.app.logo)
                .setDescription("My current prefix in this server is `" + client.config.app.prefix + "` type `" + this.utilisation.replace("{prefix}", client.config.app.prefix) + "` to get information about a specific command.")
                .setThumbnail(message.guild.iconURL())
                .setFields(
                    {
                        name: `**Weather [${weather.length}]**\n`,
                        value: weather.join(", ")
                    },
                    {
                        name: `**Utility [${utility.length}]**\n`,
                        value: utility.join(", ")
                    }
                )
                .setTimestamp(new Date())
                .setFooter(`Total Commands: ${weather.length + utility.length}`);

            message.channel.send({ embeds: [embed] });
        } else {
            const command = client.commands.get(args.join(" ").toLowerCase()) || client.commands.find(x => x.aliases && x.aliases.includes(args.join(" ").toLowerCase()));

            if (!command) return message.channel.send(client.emotes.error + " **I could not find that command**");

            const embed = new MessageEmbed()
                .setColor("BLACK")
                .setAuthor(`${command.name.charAt(0).toUpperCase() + command.name.slice(1)} Command`, client.config.app.logo)
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
                        value: "`" + command.utilisation.replace("{prefix}", client.config.app.prefix) + "`",
                        inline: true
                    }
                )
                .setTimestamp(new Date());

            message.channel.send({ embeds: [embed] });
        }
    }
}