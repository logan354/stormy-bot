const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { IconType, fetchMetServiceIcon } = require("../util/util");
const { ForecastPeriodType } = require("../util/constants");
const { htmlToText } = require("html-to-text");
const emojis = require("../data/emojis.json");

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
 * Builds the Discord message for weather forecasts from MetService
 * @param {Object} data MetService API JSON data
 * @param {ForecastPeriodType} [period] 
 * @returns {EmbedBuilder}
 */
function buildForecastMessage(data, period) {
    if (!data) {
        throw new Error();
    }

    if (!period) {
        period = ForecastPeriodType.SEVEN_DAYS;
    }

    console.log(period)

    // Format and Define location
    const rawLocation = data.locationIPS;
    const rawLocationSplit = rawLocation.toLowerCase().split(" ");

    for (let i = 0; i < rawLocationSplit.length; i++) {
        rawLocationSplit[i] = rawLocationSplit[i].charAt(0).toUpperCase() + rawLocationSplit[i].substring(1);
    }

    const location = rawLocationSplit.join(" ");

    // Message format
    const format = (data, isToday) => {
        const heading = `${fetchMetServiceIcon(data.forecastWord, IconType.EMOJI)} **${isToday ? "Today" : data.dowTLA}** ${data.date} | ${emojis.temperature_high} ${data.max}° ${emojis.temperature_low} ${data.min}°\n`;
        const paragraph = `${data.forecast}`;

        return heading + paragraph + "\n\n";
    }

    // Format data within peroid and character limit
    let section = "";
    const charLimit = 4096;

    let days = 0;
    if (period === ForecastPeriodType.SEVEN_DAYS) {
        days = 7;
    }
    else if (period === ForecastPeriodType.FORTY_EIGHT_HOURS) {
        days = 2;
    }
    else if (period === ForecastPeriodType.EXTENDED) {
        days = data.days.length;
    }

    for (let i = 0; i <= days - 1; i++) {
        let isToday = i === 0 ? true : false;

        section += format(data.days[i], isToday);
    }

    if (section > charLimit) {
        section = section.slice(charLimit - 5) + ". . .";
    }

    const embed = new EmbedBuilder()
        .setColor("DarkBlue")
        .setAuthor({
            iconURL: "https://play-lh.googleusercontent.com/UNBPQbc5SNqlD9G_vFQqUE3AP8mQX9qgMZBMUb8Qj4oSjakmLybwummpzk4QW9DjRQ",
            name: "MetService"
        })
        .setURL("https://www.metservice.com/national")
        .setDescription(section)
        .setTimestamp();

        if (period === ForecastPeriodType.SEVEN_DAYS) {
            embed.setTitle(location + " - 7 Days");
        }
        else if (period === ForecastPeriodType.FORTY_EIGHT_HOURS) {
            embed.setTitle(location + " - 48 Hours");
        }
        else if (period === ForecastPeriodType.EXTENDED) {
            embed.setTitle(location + " - Extended");
        }

    return embed;
}

/**
 * Builds the Discord message for weather observations from MetService
 * @param {Object} data MetService API JSON data
 * @returns {EmbedBuilder}
 */
function buildObservationMessage(data) {
    if (!data) {
        throw new Error();
    }

    const embed = new EmbedBuilder()
        .setColor("DarkBlue")
        .setAuthor({
            iconURL: "https://play-lh.googleusercontent.com/UNBPQbc5SNqlD9G_vFQqUE3AP8mQX9qgMZBMUb8Qj4oSjakmLybwummpzk4QW9DjRQ",
            name: "MetService"
        })
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

    return embed;
}

/**
 * Builds the Discord message for severe weather warnings from MetService
 * @param {Array} data MetService CAP XML data
 * @returns {Array<EmbedBuilder>}
 */
function buildWarningMessage(data) {
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
    const descriptionPages = []
    const charLimit = 4096;
    let j = 0;

    for (let i = 0; i < data.length; i++) {
        if (d.length && pages[j].length + format(data.days[i], isToday).length > charLimit) {
            j++;
            pages[j] = format(data.days[i], isToday);
        }
        else {
            if (pages[j] === undefined) {
                pages[j] = format(data.days[i], isToday);
            }
            else {
                pages[j] += format(data.days[i], isToday);
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

    return embeds;
}

/**
 * Builds the discord message for the severe weather outlook
 * WAITING FOR METSERVICE TO FINISH API
 */
function buildSevereWeatherOutlookMessage() { }

/**
 * Builds the Discord message for the thunderstorm outlook
 * @param {Object} data MetService API JSON data
 * @returns {Array<Array<Array<EmbedBuilder>>, Array<AttachmentBuilder>>}
 */
function buildThunderstormOutlookMessage(data) {
    const embeds = [];
    const attachments = [];
    const charLimit = 4096;

    // Format loop
    for (let i = 0; i < data.outlooks.length; i++) {
        const issuedDate = data.outlooks[i].issuedAt;
        const previousValidToDate = data.outlooks[i - 1] ? data.outlooks[i - 1].validTo : null;
        const validToDate = data.outlooks[i].validTo;

        let section = `**Valid ${previousValidToDate ? "from " + previousValidToDate + " to " + validToDate : "to " + validToDate}**\n` + htmlToText(data.outlooks[i].text);
        
        if (section.length > charLimit) {
            section = section.slice(charLimit - 5) + ". . .";
        }

        const embed1 = new EmbedBuilder()
            .setColor("DarkBlue")
            .setAuthor({
                iconURL: "https://play-lh.googleusercontent.com/UNBPQbc5SNqlD9G_vFQqUE3AP8mQX9qgMZBMUb8Qj4oSjakmLybwummpzk4QW9DjRQ",
                name: "MetService"
            })
            .setTitle("Thunderstorm Outlook (" + (i + 1) + "/" + data.outlooks.length + ")")
            .setDescription(section)
            .setFooter({
                text: "Issued: " + issuedDate
            });

        const attachment = new AttachmentBuilder()
            .setFile("https://www.metservice.com" + data.outlooks[i].url)
            .setName(data.outlooks[i].url.split("/").splice(-1)[0] + ".png");

        const embed2 = new EmbedBuilder()
            .setColor("DarkBlue")
            .setImage("attachment://" + attachment.name);

        embeds.push([embed1, embed2]);
        attachments.push(attachment);
    }


    return [embeds, attachments];
}

module.exports = { buildForecastMessage, buildObservationMessage, buildWarningMessage, buildSevereWeatherOutlookMessage, buildThunderstormOutlookMessage }