const { Client, Message, ChannelType } = require("discord.js");

/**
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type === ChannelType.DM) return;

    const prefix = client.config.app.prefix;

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (cmd) {
        try {
            await cmd.execute(client, message, args);
        } catch (e) {
            console.error(e);
        }
    }
}