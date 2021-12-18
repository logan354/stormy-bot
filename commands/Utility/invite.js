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
            .setColor("BLACK")
            .setAuthor("About Me")
            .setDescription(`A weather bot for New Zealand on Discord. \nConnecting directly to the MetService API!\n\n[Invite the bot here](${client.config.app.invite})`)
            .setThumbnail(message.guild.iconURL())
            .setTimestamp(new Date())
            .setFooter("Thanks For Choosing Stormy", client.config.app.logo);

        message.channel.send({ embeds: [embed] });
    }
}