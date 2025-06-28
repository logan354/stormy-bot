import { AttachmentBuilder, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from "discord.js";

import Command from "../../../structures/Command";
import { METSERVICE_ICON, METSERVICE_PUBLIC_API_URL, RADAR_LOCATIONS, getMetServiceRadarEndpoint } from "../../../utils/constants";
import { emojis } from "../../../../config.json";

const radarLocations = [
    {
        name: "NZ",
        value: RADAR_LOCATIONS.NEW_ZEALAND
    },
    {
        name: "Auckland",
        value: RADAR_LOCATIONS.AUCKLAND
    },
    {
        name: "Bay of Plenty",
        value: RADAR_LOCATIONS.BAY_OF_PLENTY
    },
    {
        name: "Hawkes Bay",
        value: RADAR_LOCATIONS.HAWKES_BAY
    },
    {
        name: "New Plymouth",
        value: RADAR_LOCATIONS.NEW_PLYMOUTH
    },
    {
        name: "Wellington",
        value: RADAR_LOCATIONS.WELLINGTON
    },
    {
        name: "Canterbury",
        value: RADAR_LOCATIONS.CANTERBURY
    },
    {
        name: "Westland",
        value: RADAR_LOCATIONS.WESTLAND
    },
    {
        name: "Southland",
        value: RADAR_LOCATIONS.SOUTHLAND
    }
];

export default {
    name: "rain-radar",
    category: "Weather",
    data: new SlashCommandBuilder()
        .setName("rain-radar")
        .setDescription("The current rain radar scan from MetService for a radar location.")
        .addStringOption(option =>
            option
                .setName("radar-location")
                .setDescription("Location e.g. Auckland.")
                .setRequired(true)
                .addChoices(radarLocations)
        ),
    async execute(bot, interaction) {
        if (!interaction.channel || !interaction.guild.members.me) throw new ReferenceError();

        const botPermissionsFor = interaction.channel.permissionsFor(interaction.guild.members.me);
        if (!botPermissionsFor.has(PermissionsBitField.Flags.UseExternalEmojis)) {
            interaction.reply(emojis.permission_error + " **I do not have permission to Use External Emojis in** <#" + interaction.channel.id + ">");
            return;
        }
        if (!botPermissionsFor.has(PermissionsBitField.Flags.EmbedLinks)) {
            interaction.reply(emojis.permission_error + " **I do not have permission to Use Embed Links in** <#" + interaction.channel.id + ">");
            return;
        }

        const radarLocation = interaction.options.getString("radar-location")!;

        const url = METSERVICE_PUBLIC_API_URL + getMetServiceRadarEndpoint(radarLocation);
        let data: any;

        await interaction.deferReply();

        try {
            const response = await fetch(url);

            if (response.status === 200) {
                data = await response.json();
            }
            else if (response.status === 404) {
                await interaction.editReply(emojis.error + " **Invalid/Unknown location**");
                return;
            }
            else {
                await interaction.editReply(emojis.error + " **Error**");
                return;
            }
        }
        catch (error) {
            console.error(error);
            await interaction.editReply(emojis.error + " **Error**");
            return;
        }

        const attachment = new AttachmentBuilder("https://www.metservice.com" + data[0].url)
        .setName(data[0].validFromRaw + ".png");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "MetService",
                iconURL: METSERVICE_ICON
            })
            .setTitle(`${radarLocations.find(x => x.value === radarLocation)!.name} Radar (${data[0].longDateTime})`)
            .setImage("attachment://" + attachment.name)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], files: [attachment] });
    }
} as Command;