const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "invite",
    aliases: ["links"],
    category: "Utility",
    description: "Shows Stormy's official links!",
    utilisation: "{prefix}invite",
    permissions: {
        channel: [],
        member: [],
    },

    execute(client, message, args) {
        const embed = new MessageEmbed()
            .setColor("GREY")
            .setAuthor("About Me")
            .setDescription(`The best weather bot for New Zealand on Discord. Connecting directly to the MetService API!\n\n[Invite the bot here](${client.config.app.invite})`)
            .setThumbnail(message.guild.iconURL())
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