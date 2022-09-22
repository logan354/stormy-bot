const { Client, CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "help",
    category: "Utility",
    description: "Shows information about Stormy",
    options: [
        {
            name: "command",
            description: "Enter a command",
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {CommandInteractionOptionResolver} args 
     */
    execute(client, interaction, args) {
        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Use External Emojis in** " + "`" + interaction.channel.name + "`");
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(client.emotes.permissionError + " **I do not have permission to Embed Links in** " + "`" + interaction.channel.name + "`");

        if (!args.getString("command")) {
            // Command categories
            const weather = client.commands.filter(x => x.category == "Weather").map((x) => "`" + x.name + "`");
            const utility = client.commands.filter(x => x.category == "Utility").map((x) => "`" + x.name + "`");

            const embed = new EmbedBuilder()
                .setColor("BLACK")
                .setAuthor({
                    name: "Stormy's Commands",
                    iconURL: client.config.app.logo
                })
                .setDescription("My current prefix in this server is `" + client.config.app.slash_prefix + "` type `" + client.config.app.slash_prefix + this.name + "` to get information about a specific command.")
                .setThumbnail(interaction.guild.iconURL())
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
                .setFooter({
                    text: `Total Commands: ${weather.length + utility.length}`
                });

            interaction.reply({ embeds: [embed] });
        } else {
            const command = client.commands.get(args.getString("command").toLowerCase());

            if (!command) return interaction.reply(client.emotes.error + " **I could not find that command**");

            const embed = new EmbedBuilder()
                .setColor("BLACK")
                .setAuthor({
                    name: `${command.name.charAt(0).toUpperCase() + command.name.slice(1)} Command`,
                    iconURL: client.config.app.logo
                })
                .setDescription("Required arguments `<>`, optional arguments `[]`")
                .setThumbnail(interaction.guild.iconURL())
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

            interaction.reply({ embeds: [embed] });
        }
    }
}