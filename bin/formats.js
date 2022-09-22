const { EmbedBuilder } = require("discord.js");
const { METSERVICE_BASE } = require("../utils/constants");

/**
 * Creates a formatted sun protection alert from MetService data
 */
const sunProtectionAlert = new EmbedBuilder()
    .setColor("GREY")
    .setAuthor({
        name: "Sun Protection Alert for " + data.spaData[0].location
    })
    .setDescription(data.spaData[0].message)
    .setFields(
        {
            name: "Protection required",
            value: data.spaData[0].uvStartTime + data.spaData[0].uvStartTimeMeridian.toLowerCase() + " to " + data.spaData[0].uvEndTime + data.spaData[0].uvEndTimeMeridian.toLowerCase(),
            inline: true
        },
        {
            name: "UV index",
            value: data.spaData[0].uvIndex,
            inline: true
        },
        {
            name: "Max Temperature",
            value: data.spaData[0].maxTemp.toString() + "°",
            inline: false
        }
    );


// Incomplete
const tides = null;

/**
 * Creates formatted rise times from MetService data
 */
const riseTimes = new EmbedBuilder()
    .setColor("GREY")
    .setAuthor({
        name: "Rise Times at " + data.location
    })
    .setFields(
        {
            name: "Sun Rise",
            value: data.sunRise,
            inline: true
        },
        {
            name: "Sun Set",
            value: data.sunSet,
            inline: true
        },
        {
            name: "First Light",
            value: data.firstLight,
            inline: true
        },
        {
            name: "Last Light",
            value: data.lastLight,
            inline: true
        }
    );

if (data.moonRise) embed.addField("Moon Rise", data.moonRise, true);
if (data.moonSet) embed.addField("Moon Set", data.moonSet, true);


/**
 * Creates formatted pollen levels from MetService data
 */
const pollenLevels = new EmbedBuilder()
    .setColor("GREY")
    .setAuthor({
        name: "Pollen Levels for " + data.location.toLowerCase().split(" ").map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(" ")
    })

for (let i = 0; i < data.pollen.length; i++) {
    if (data.pollen[i].dayDescriptor) embed.addField(data.pollen[i].dayDescriptor, "Level: **" + data.pollen[i].level + "**\nType: " + data.pollen[i].type);
}

// Incomplete
const climate = null; /** Use embed to display one */ 

/**
 * Creates a formatted radar image from MetService data
 */
const rainRadar = new EmbedBuilder()
    .setColor("GREY")
    .setAuthor({
        name: data[0].url.split("/publicData/rainRadar/image/")[1].split("/")[0] + " Radar Image " + data[0].longDateTime
    })
    .setImage(METSERVICE_BASE + data[0].url.split("/publicData/")[1]);