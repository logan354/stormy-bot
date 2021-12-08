module.exports = {
    name: "ping",
    aliases: [],
    category: "Utility",
    description: "Checks the bot's response time to Discord.",
    utilisation: "{prefix}ping",

    execute(client, message, args) {
        message.channel.send(client.emotes.ping + " Ping: **" + client.ws.ping + "ms**");
    }
}
