import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";

import Command from "../../../structures/Command";
import emojis from "../../../../emojis.json";

export default {
    name: "help",
    category: "Utility",
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Helpful information about the bot.")
        .addStringOption(option =>
            option.setName("command")
                .setDescription("Enter a command.")
                .setRequired(false)
        ),
    async execute(bot, interaction) {
        const textChannel = interaction.channel;
        const commandOption = interaction.options.getString("command");

        if (!textChannel || !interaction.guild.members.me) {
            await interaction.reply({ content: "An error occured while executing this command", ephemeral: true });
            return;
        }

        const botPermissionsFor = textChannel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) return interaction.reply(emojis.permission_error + " **I do not have permission to Use External Emojis in** <#" + textChannel.id + ">");
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) return interaction.reply(emojis.permission_error + " **I do not have permission to Embed Links in** <#" + textChannel.id + ">");

        const applicationCommands = await interaction.guild.commands.fetch();

        if (commandOption) {
            const command = bot.commands.get(commandOption.toLowerCase());

            if (!command) {
                await interaction.reply(emojis.error + " **I could not find that command**");
                return;
            }

            const embed = new EmbedBuilder()
                .setColor("Default")
                .setAuthor({
                    name: `${command.name.charAt(0).toUpperCase() + command.name.slice(1)} Command`,
                    iconURL: bot.user.avatarURL() ?? undefined
                })
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(command.data.description)
                .setFields(
                    {
                        name: "Category",
                        value: "`" + command.category + "`",
                        inline: true
                    }
                )
                .setTimestamp(new Date());

            // Add command link to the embed if one exists
            for (const applicationCommand of applicationCommands.values()) {
                if (applicationCommand.name === command.name) {
                    embed.addFields(
                        {
                            name: "Command",
                            value: "</" + applicationCommand.name + ":" + applicationCommand.id + ">",
                            inline: true
                        }
                    );

                    break;
                }
            }

            await interaction.reply({ embeds: [embed] });
        }
        else {
            await interaction.deferReply();
            
            const embed = new EmbedBuilder()
                .setColor("Default")
                .setAuthor({
                    name: "Help Centre",
                    iconURL: bot.user.avatarURL() ?? undefined
                })
                .setThumbnail(interaction.guild.iconURL())
                .setDescription("**Hello <@" + interaction.user.id + ">, welcome to the Help Centre.**\nBelow is a list of all the commands.")
                .setTimestamp(new Date());

            // Dynamic category injection (This is bad code but ehhh)
            const categories: Map<string, Array<Command>> = new Map();

            for (const command of bot.commands) {
                let categoryFound = false;

                for (const category of categories) {
                    if (category[0] === command[1].category) {
                        category[1].push(command[1]);
                        categoryFound = true;
                        break;
                    }
                }

                if (!categoryFound) {
                    categories.set(command[1].category, [command[1]]);
                }
            }

            // Loop over completed map
            for (const category of categories) {
                embed.addFields(
                    {
                        name: category[0],
                        value: category[1].map((x) => "`" + x.name + "`").join(", "),
                    }
                )
            }

            await interaction.editReply({ embeds: [embed] });
        }
    }
} as Command;