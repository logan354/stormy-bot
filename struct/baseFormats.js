const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { IconType, fetchMetServiceIcon, fetchMetServiceWeatherIcon } = require("../util/util");
const { days, shortDays } = require("../util/constants");
const { htmlToText } = require("html-to-text");
const emojis = require("../data/emojis.json")

/**
 * Converts date to MetService date & time standard
 * @param {Date} date
 * @param {boolean} useTime
 * @param {{ useWeekday: boolean; useNoon: boolean; useMinutes: boolean; }} [options = { useWeekday: true, useNoon: false, useMinutes: false }] 
 * @returns {string}
 */
function formatDate(date, useTime, options = { useWeekday: true, useNoon: false, useMinutes: true }) {
    let dateFormat = date.toLocaleString("en-GB", { day: "numeric" }) + " " + date.toLocaleString("en-GB", { month: "long" }).slice(0, 3);;
    if (options.useWeekday) {
        date.toLocaleString("en-GB", { weekday: "short" }) + ", " + dateFormat;
    }

    if (useTime) {
        let timeFormat = null;

        if (options.useNoon) {
            if (date.getHours() === 12) {
                timeFormat = "noon";
            }
            else if (date.getHours() === 0) {
                timeFormat = "midnight";
            }
        }

        if (!timeFormat) {
            if (options.useMinutes) {
                timeFormat = (date.toLocaleString("en-GB", { hour: "numeric", minute: "numeric", hourCycle: "h12" })).replace(" ", "");
            }
            else {
                timeFormat = (date.toLocaleString("en-GB", { hour: "numeric", hourCycle: "h12" })).replace(" ", "");
            }
        }

        return timeFormat + " " + dateFormat;
    }
    else {
        return dateFormat;
    }
}



/**
 * The discord message format for weather forecasts
 * @param {Object} data
 * @param {string} location
 * @param {boolean} hasToday
 * @returns {Array<Array<EmbedBuilder>>}
 */
function forecastFormat(data, location, hasToday) {
    const format = (data, isToday) => {
        const heading = `${fetchMetServiceIcon(data.forecastWord, IconType.EMOJI)} **${isToday ? "Today" : data.dowTLA}** ${data.date} | ${emojis.temperature_high} ${data.max}° ${emojis.temperature_low} ${data.min}°\n`;
        const paragraph = `${data.forecast}`;

        return heading + paragraph + "\n\n";
    }

    let isToday = true;

    if (hasToday) {
        isToday = true
    }
    else {
        isToday = false
    }

    // Algorithm for formatting and sorting data into pages
    const pages = []
    const charLimit = 4096;
    let j = 0;

    for (let i = 0; i < data.length; i++) {
        if (pages.length && pages[j].length + format(data[i], isToday).length > charLimit) {
            j++
            k++
            pages[j] = format(data[i], isToday);
        }
        else {
            if (pages[j] === undefined) {
                pages[j] = format(data[i], isToday);
            }
            else {
                pages[j] += format(data[i], isToday);
            }
        }

        // Reset isToday variable
        isToday = false;
    }

    const embeds = [];
    for (let i = 0; i < pages.length; i++) {
        const embed = new EmbedBuilder()
            .setColor("DarkBlue")
            .setTitle("Forecast for " + location)
            .setDescription(pages[i])
            .setTimestamp();

        if (data.length === 1) {
            embed.setTitle(data[0].dow + " " + embed.data.title)
        } 
        else {
            embed.setTitle(data.length + "-Day " + embed.data.title)
        }

        embeds.push(embed);
    }

    return [embeds];
}

/**
 * The discord message format for weather observations
 * @param {Object} data 
 * @returns {Array<EmbedBuilder>}
 */
function observationFormat(data) {
    const embed = new EmbedBuilder()
        .setColor("Grey")
        .setTitle("Current Conditions at " + data.location)
        .addFields(
            {
                name: "Temperature",
                value: "**" + data.threeHour.temp + "°**\nFeels like " + data.threeHour.windChill + "°",
                inline: true
            },
            {
                name: "Clothing",
                value: data.threeHour.clothingLayers + " layers\n" + data.threeHour.windProofLayers + " windproof",
                inline: true
            },
            {
                name: "Wind",
                value: data.threeHour.windSpeed + "km/h " + data.threeHour.windDirection,
                inline: true
            },
            {
                name: "Rainfall",
                value: data.threeHour.rainfall + "mm",
                inline: true
            },
            {
                name: "Humidity",
                value: data.threeHour.humidity + "%",
                inline: true
            },
            {
                name: "Pressure",
                value: data.threeHour.pressure + "hPa\n" + data.threeHour.pressureTrend,
                inline: true
            }
        )
        .setFooter({
            text: "Observed at: " + data.threeHour.dateTime
        });

    return [embed];
}

/**
 * The discord message format for MetService warnings
 * @param {Array<Object>} data
 * @returns {Array<Array<EmbedBuilder>, ActionRowBuilder>}
 */
function warningFormat(data) {
    const format = (data) => {
        let colourCode = null;
        data.parameter.forEach(param => {
            if (param.valueName._text === "ColourCode") colourCode = param.value._text;
        });

        const effectiveDate = new Date(data.onset._text);
        const expiresDate = new Date(data.expires._text);

        const effectiveDateFormat = formatDate(effectiveDate, true, { useNoon: true });
        const expiresDateFormat = formatDate(expiresDate, true, { useNoon: true });

        return `${fetchMetServiceIcon(data.headline._text.includes("Watch") ? "Watch" : colourCode + " Warning", IconType.EMOJI)} **${data.headline._text}**\n**Area:** ${data.area.areaDesc._text}\n**Period:** ${data.headline._text === "Severe Thunderstorm Warning" ? "until " + expiresDateFormat : effectiveDateFormat + " - " + expiresDateFormat}\n\n`;
    }

    // TODO: Algorithm for sorting data into correct order

    // Algorithm for formatting and sorting data into pages
    const pages = []
    const charLimit = 4096;
    let j = 0;

    for (let i = 0; i < data.length; i++) {
        if (pages.length && pages[j].length + format(data[i]).length > charLimit) {
            j++
            k++
            pages[j] = format(data[i]);
        }
        else {
            if (pages[j] === undefined) {
                pages[j] = format(data[i]);
            }
            else {
                pages[j] += format(data[i]);
            }
        }
    }

    const embeds = [];
    for (let i = 0; i < pages.length; i++) {
        const embed = new EmbedBuilder()
            .setColor("Grey")
            .setTitle("Warnings & Watches")
            .setDescription(pages[i])
            .setTimestamp();

        embeds.push(embed);
    }

    return [embeds];
}

/**
 * The discord message format for the severe weather outlook product
 * @param {Object} data
 * @returns {Array<Array<EmbedBuilder, EmbedBuilder>, AttachmentBuilder>}
 */
function severeWeatherOutlookFormat(data) {
    const issuedAtDate = new Date(data.issuedAtISO);
    const validFromDate = new Date(data.validFromISO);
    const validToDate = new Date(data.validToISO);

    // Set dates to MetService date standard (Which is a kinda dumb standard)
    issuedAtDate.setDate(issuedAtDate.getDate() - 1);
    validFromDate.setDate(validFromDate.getDate() - 1);
    validToDate.setDate(validToDate.getDate() - 1);

    const issuedAtDateFormat = formatDate(issuedAtDate, true);
    const validFromDateFormat = formatDate(validFromDate, true);
    const validToDateFormat = formatDate(validToDate, true);


    const attachment = new AttachmentBuilder()
        .setFile("https://www.metservice.com" + data.pic.url)
        .setName(data.pic.url.split("/").splice(-1)[0] + ".png");

    const embed1 = new EmbedBuilder()
        .setColor("Grey")
        .setTitle("Severe Weather Outlook")
        .setDescription(`### Valid from ${validFromDateFormat} to ${validToDateFormat}\n` + htmlToText(data.mainText))
        .setFooter({
            text: "Issued: " + issuedAtDateFormat
        });

    const embed2 = new EmbedBuilder()
        .setColor("Grey")
        .setImage("attachment://" + attachment.name);

    return [[embed1, embed2], attachment];
}

/**
 * The discord message format for the thunderstorm outlook product
 * @param {Object} data
 * @param {boolean} previousValidToDate
 * @returns {Array<Array<EmbedBuilder, EmbedBuilder>, AttachmentBuilder}
 */
function thunderstormOutlookFormat(data, previousValidToDateFormat) {
    const issuedDateFormat = data.issuedAt;
    const validToDateFormat = data.validTo;

    const attachment = new AttachmentBuilder()
        .setFile("https://www.metservice.com" + data.url)
        .setName(data.url.split("/").splice(-1)[0] + ".png")

    const embed1 = new EmbedBuilder()
        .setColor("Grey")
        .setTitle("Thunderstorm Outlook")
        .setDescription(`### Valid ${previousValidToDateFormat ? "from " + previousValidToDateFormat + " to " + validToDateFormat : "to " + validToDateFormat}\n` + htmlToText(data.text))
        .setFooter({
            text: "Issued: " + issuedDateFormat
        });

    const embed2 = new EmbedBuilder()
        .setColor("Grey")
        .setImage("attachment://" + attachment.name);

    return [[embed1, embed2], attachment];
}

module.exports = { forecastFormat, observationFormat, warningFormat, severeWeatherOutlookFormat, thunderstormOutlookFormat }