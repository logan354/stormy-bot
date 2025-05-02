import { ChannelType, Events, Interaction } from "discord.js";
import Bot from "../structures/Bot";
import Event from "../structures/Event";

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(bot: Bot, interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            if (interaction.user.bot) return;

            const command = bot.commands.get(interaction.commandName);

            if (command) {
                try {
                    if (!interaction.inCachedGuild()) {
                        if (interaction.replied || interaction.deferred) {
                            await interaction.followUp({ content: "An error while executing this command", ephemeral: true });
                        }
                        else {
                            await interaction.reply({ content: "An error while executing this command", ephemeral: true });
                        }
                    }
                    else await command.execute(bot, interaction);
                }
                catch (e) {
                    console.error(e);

                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: "An error while executing this command", ephemeral: true });
                    }
                    else {
                        await interaction.reply({ content: "An error while executing this command", ephemeral: true });
                    }
                }
            }
        }
        else return;
    }
} as Event;