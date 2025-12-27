import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";

import Command from "../../structures/Command";
import { version } from "../../../package.json"

export default {
    name: "help",
    category: "Utility",
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("The command guide."),
    async execute(bot, interaction) {
        await interaction.deferReply();

        const applicationCommands = await bot.getApplicationCommands();

        let commandList = "";

        for (const [commandName, command] of bot.commands) {
            const applicationCommand = applicationCommands.find((x) => x.name === commandName)!;

            const commandMention = `</${applicationCommand.name}:${applicationCommand.id}>`;
            const options = applicationCommand.options ? applicationCommand.options.map((x: any) => x.required ? "`<" + x.name + ">`" : "`[" + x.name + "]`").join(" ") : "";

            commandList += `\n${commandMention} ${options}`;
        }

        const embed = new EmbedBuilder()
            .setTitle("Command Guide")
            .setThumbnail(bot.user.avatarURL())
            .setDescription(`**Hello <@${interaction.user.id}>,**\nBelow is a list of all the commands.\n*Format: **name** \`<required>\` \`[optional]\`\n*${commandList}`)
            .setFooter({
                text: "v" + version
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
} as Command;