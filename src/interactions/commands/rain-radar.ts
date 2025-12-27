import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js";

import Command from "../../structures/Command";
import { METSERVICE_EMOJI_URL, METSERVICE_PUBLIC_API_URL, METSERVICE_RADAR_LOCATIONS } from "../../utils/constants";
import { emojis } from "../../../config.json";
import { getMetServiceRadarEndpoint } from "../../utils/util";

const radarLocationChoices = [
    {
        name: "NZ",
        value: METSERVICE_RADAR_LOCATIONS.NEW_ZEALAND
    },
    {
        name: "Auckland",
        value: METSERVICE_RADAR_LOCATIONS.AUCKLAND
    },
    {
        name: "Bay of Plenty",
        value: METSERVICE_RADAR_LOCATIONS.BAY_OF_PLENTY
    },
    {
        name: "Hawkes Bay",
        value: METSERVICE_RADAR_LOCATIONS.HAWKES_BAY
    },
    {
        name: "New Plymouth",
        value: METSERVICE_RADAR_LOCATIONS.NEW_PLYMOUTH
    },
    {
        name: "Wellington",
        value: METSERVICE_RADAR_LOCATIONS.WELLINGTON
    },
    {
        name: "Canterbury",
        value: METSERVICE_RADAR_LOCATIONS.CANTERBURY
    },
    {
        name: "Westland",
        value: METSERVICE_RADAR_LOCATIONS.WESTLAND
    },
    {
        name: "Southland",
        value: METSERVICE_RADAR_LOCATIONS.SOUTHLAND
    }
];

export default {
    name: "rain-radar",
    data: new SlashCommandBuilder()
        .setName("rain-radar")
        .setDescription("The current rain radar scan from MetService for a radar location.")
        .addStringOption(option =>
            option
                .setName("radar-location")
                .setDescription("Location e.g. Auckland.")
                .setRequired(true)
                .addChoices(radarLocationChoices)
        ),
    async execute(bot, interaction) {
        const radarLocationOption = interaction.options.getString("radar-location", true);

        await interaction.deferReply();

        let data: any;

        try {
            const response = await fetch(METSERVICE_PUBLIC_API_URL + getMetServiceRadarEndpoint(radarLocationOption));

            if (response.status === 200) data = await response.json();
            else if (response.status === 404) {
                await interaction.editReply(emojis.error + " **Invalid/Unknown location**");
                return;
            }
            else {
                await interaction.editReply(emojis.error + " **Error**");
                return;
            }
        }
        catch (e) {
            console.error(e);
            await interaction.editReply(emojis.error + " **Error**");
            return;
        }

        const attachment = new AttachmentBuilder("https://www.metservice.com" + data[0].url)
            .setName(data[0].validFromRaw + ".png");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "MetService",
                iconURL: METSERVICE_EMOJI_URL
            })
            .setTitle(`${radarLocationChoices.find(x => x.value === radarLocationOption)!.name} Radar (${data[0].longDateTime})`)
            .setImage("attachment://" + attachment.name)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], files: [attachment] });
    }
} as Command;