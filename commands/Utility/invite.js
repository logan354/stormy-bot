const { Client, Message, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "invite",
    aliases: [],
    category: "Utility",
    description: "Displays invite information about Stormy.",
    utilisation: "invite",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(client, message, args) {
        const botPermissionsFor = message.channel.permissionsFor(message.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return message.channel.send(client.emotes.permissionError + " **I do not have permission to Embed Links in** <#" + message.channel.id + ">");

        const embed = new EmbedBuilder()
            .setColor("Default")
            .setAuthor({
                name: "About Me",
                iconURL: client.user.avatarURL()
            })
            .setDescription(client.config.app.slogan.split(".").join(".\n"))
            .setThumbnail(message.guild.iconURL())
            .setFields(
                {
                    name: "Invite",
                    value: "[`Click Here`](" + client.config.app.invite + ")"
                },
                {
                    name: "Support Server",
                    value: "[`Click Here`](" + client.config.app.supportServer + ")"
                }
            )
            .setTimestamp(new Date())
            .setFooter({
                text: "Thanks For choosing Stormy",
                iconURL: client.user.avatarURL()
            });

        message.channel.send({ embeds: [embed] });
    }
}