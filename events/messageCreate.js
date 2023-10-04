const { Events, Message } = require("discord.js");
const Bot = require("../struct/Bot");

module.exports = {
    name: Events.MessageCreate,
    once: false,

    /**
     * @param {Bot} bot 
     * @param {Message} message 
     */
    async execute(bot, message) {
        const mention = `<@${bot.client.user.id}>`;

        if (!message.content.startsWith(mention) || message.author.bot) return;

        const args = message.content.slice(mention.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = bot.commands.get(commandName) || bot.commands.find(x => x.aliases && x.aliases.includes(commandName));

        // TODO: Permissions Checker

        try {
            await command.execute(bot, message, args);
        }
        catch (error) {
            console.error(error);
        }
    }
}