const { Events, ChatInputCommandInteraction } = require("discord.js");
const Bot = require("../structures/Bot");

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    /**
     * 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(bot, interaction) {
        if (!interaction.isCommand()) return;

        const command = bot.slashCommands.get(interaction.commandName);

        if (command) {
            try {
                await command.execute(bot, interaction);
            }
            catch (error) {
                console.error(error);
            }
        }
    }
}