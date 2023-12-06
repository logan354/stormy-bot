const { Events, Message, PermissionsBitField } = require("discord.js");
const Bot = require("../struct/Bot");
const emojis = require("../../data/emojis.json");

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

        const command = bot.messageCommands.get(commandName) || bot.messageCommands.find(x => x.aliases && x.aliases.includes(commandName));


        // Permission Checker
        const clientPermissionsFor = message.channel.permissionsFor(message.guild.members.me);
        const memberPermissionsFor = message.channel.permissionsFor(message.author);

        // Check client permissions
        // Basic permissions
        if (!clientPermissionsFor.has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages])) {
            return;
        }

        // Advanced permissions
        for (let i = 0; i < command.permissions.client.length; i++) {
            if (!clientPermissionsFor.has(command.permissions.client[i][1])) {
                return message.channel.send(emojis.permission_fail + " **I do not have permission to " + command.permissions.client[i][0] + " in** <#" + message.channel.id + ">");
            }
        }

        // Check member permissions
        for (let i = 0; i < command.permissions.member.length; i++) {
            if (!memberPermissionsFor.has(command.permissions.member[i][1])) {
                return message.channel.send(emojis.permission_fail + " **This command requires you to have the " + command.permissions.member[i][0] + " in** <#" + message.channel.id + ">");
            }
        }


        // Execute
        try {
            await command.execute(bot, message, args);
        }
        catch (error) {
            console.error(error);
        }
    }
}