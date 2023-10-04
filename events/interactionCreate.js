const { Events, ChatInputCommandInteraction } = require("discord.js");
const Bot = require("../struct/Bot");

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    /**
     * 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(bot, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = bot.slashCommands.get(interaction.commandName);

        // TODO: Permissions Checker

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