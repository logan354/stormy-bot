const { Client, Message } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: [],
    category: "Utility",
    description: "Checks Stormy's response time to Discord",
    utilisation: "{mention}ping",

    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    execute(client, message, args) {
        message.channel.send(client.emotes.ping + " Ping: **" + client.ws.ping + "ms**");
    }
}