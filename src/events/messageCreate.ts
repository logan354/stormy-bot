import { ChannelType, Client, Events, Message } from "discord.js";
import Bot from "../structures/Bot";
import Event from "../structures/Event";

export default {
    name: Events.MessageCreate,
    once: false,
    async execute(bot: Bot, message: Message) {
        if (message.author.bot || message.channel.isDMBased()) return;

        const mention = `<@${bot.user?.id}>`;

        if (message.content.indexOf(mention) !== 0) return;

        try {
            // Help Command
        }
        catch (error) {
            console.error(error);
            await message.channel.send("An error while executing this command");
        }
    }
} as Event;