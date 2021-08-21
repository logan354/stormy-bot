module.exports = {
    name: "invite",
    aliases: ["links"],
    category: "Utility",
    description: "Shows Stormy's official links!",
    utilisation: "{prefix}invite",

    execute(client, message) {

        message.channel.send({
            embed: {
                color: "BLACK",
                title: "About Me",
                thumbnail: { url: client.config.discord.logo },
                description: `The best weather bot for New Zealand on Discord. Connecting directly to the MetService API!\n\n[Invite the bot here](${client.config.discord.invite})`
            }
        });

    }
}