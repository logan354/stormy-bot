const { EmbedBuilder } = require("discord.js");
const { IconType, fetchMetServiceIcon, fetchMetServiceWeatherIcon } = require("../utils/util");
const { days, shortDays } = require("../utils/constants");
const { htmlToText } = require("html-to-text");

/**
 * Base format for forecast title
 * @param {string} location
 * @param {?days|shortDays|string} outlookDay
 * @param {?number} outlookNum
 * @returns {string}
 */
const baseForecastTitle = (location, outlookDay, outlookNum) => { return `__**${outlookNum ? outlookNum + "-Day" : outlookDay} Forecast for ${location.toLowerCase().split(" ").map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(" ")}**__`; }

/**
 * Base format for forecasts
 * @param {Object} data API endpoint day data
 * @param {boolean} isToday
 * @returns {string}
 */
const baseForecast = (data, isToday) => {
    const d = new Date(data.issuedAtRaw);
    let partDayData = null;

    if (data.partDayData) {
        partDayData = `| **Overnight** | **Morning** | **Afternoon** | **Evening** |\n|        ${fetchMetServiceWeatherIcon(data.partDayData.overnight.forecastWord, IconType.EMOJI, data.partDayData.overnight.iconType === "NIGHT" ? true : false)}        |      ${fetchMetServiceWeatherIcon(data.partDayData.morning.forecastWord, IconType.EMOJI, data.partDayData.morning.iconType === "NIGHT" ? true : false)}      |         ${fetchMetServiceWeatherIcon(data.partDayData.afternoon.forecastWord, IconType.EMOJI, data.partDayData.afternoon.iconType === "NIGHT" ? true : false)}        |      ${fetchMetServiceWeatherIcon(data.partDayData.evening.forecastWord, IconType.EMOJI, data.partDayData.evening.iconType === "NIGHT" ? true : false)}     |`;
    }

    return "\n\n" + `${fetchMetServiceWeatherIcon(data.forecastWord, IconType.EMOJI)} **${isToday ? "Today" : data.dowTLA}** ${data.date} | High: ${data.max}°, Low: ${data.min}°\n${partDayData ? partDayData + "\n\n" + data.forecast : data.forecast}\n*Issued: ${data.issuedAt.split(" ")[0]} ${shortDays[d.getDay() > 0 ? d.getDay() - 1 : 6]} ${data.issuedAt.split(" ")[1]} ${data.issuedAt.split(" ")[2]}*`;
}

/**
 * Base format for observations
 * @param {Object} data API endpoint data
 * @returns {EmbedBuilder}
 */
const baseObservation = (data) => {
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
        .setTimestamp()
        .setFooter({
            text: "Weather Observation " + data.threeHour.dateTime + "\n"
        });

    return embed;
}

const baseRadar = () => { }

/**
 * Base format for warnings
 * @param {Object} data CAP Alert info data
 * @returns {string}
 */
const baseWarning = (data) => {
    let colourCode = null;
    data.parameter.forEach(param => {
        if (param.valueName._text === "ColourCode") colourCode = param.value._text;
    });

    const effectiveDate = new Date(data.onset._text);
    const expiresDate = new Date(data.expires._text);

    const dateFormat = (date) => {
        const datePart = Intl.DateTimeFormat("en-GB", { weekday: "short", month: "long", day: "numeric" }).format(date);

        if (date.getHours() === 12) {
            return "noon " + datePart;
        }
        else if (date.getHours() === 0) {
            return "midnight " + datePart;
        }
        else {
            return (Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h12" }).format(date)).replace(" ", "") + " " + datePart;
        }

    }

    return `${fetchMetServiceIcon(data.headline._text.includes("Watch") ? "Watch" : colourCode + " Warning", IconType.EMOJI)} **${data.headline._text}**\n**Area:** ${data.area.areaDesc._text}\n**Period:** ${data.headline._text === "Severe Thunderstorm Warning" ? "until " + dateFormat(expiresDate) : dateFormat(effectiveDate) + " - " + dateFormat(expiresDate)}\n\n`;
}

/**
 * Base format for the severe weather outlook
 * @param {Object} data API endpoint data
 * @returns {EmbedBuilder}
 */
const baseSevereWeatherOutlook = (data) => {
    const issuedDate = new Date(data.issuedAtISO);
    const validFromDate = new Date(data.validFromISO);
    const validToDate = new Date(data.validToISO);

    const issuedDateFormat = (Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", hourCycle: "h12" }).format(issuedDate)).replace(" ", "") + " " + Intl.DateTimeFormat("en-GB", { weekday: "short", month: "long", day: "numeric" }).format(issuedDate);
    const validFromDateFormat = validFromDate.getHours() === 12 ? "noon" : "midnight" + " " + Intl.DateTimeFormat("en-GB", { weekday: "short", month: "long", day: "numeric" }).format(validFromDate);
    const validToDateFormat = validToDate.getHours() === 12 ? "noon" : "midnight" + " " + Intl.DateTimeFormat("en-GB", { weekday: "short", month: "long", day: "numeric" }).format(validToDate);

    const embed = new EmbedBuilder()
        .setColor("Grey")
        .setTitle("Severe Weather Outlook")
        .setDescription(htmlToText(data.mainText))
        .setImage("https://www.metservice.com" + data.pic.url)
        .setFooter({
            text: `Issued: ${issuedDateFormat}\nValid from ${validFromDateFormat} to ${validToDateFormat}`
        });

    return embed;
}

/**
 * Base format for thunderstorm outlooks
 * @param {Object} data API endpoint outlook data
 * @param {boolean} isCurrentOutlook
 * @returns {EmbedBuilder}
 */
const baseThunderstormOutlook = (data, validFromDateFormat) => {
    const issuedDateFormat = data.issuedAt;
    const validToDateFormat = data.validTo;

    const embed = new EmbedBuilder()
        .setColor("Grey")
        .setTitle("Thunderstorm Outlook")
        .setDescription(htmlToText(data.text))
        .setImage("https://www.metservice.com" + data.url)
        .setFooter({
            text: `Issued: ${issuedDateFormat}\nValid ${validFromDateFormat ? "from " + validFromDateFormat + " to " + validToDateFormat : "to " + validToDateFormat}`
        });

    return embed;
}

const baseTropicalCycloneActivity = () => { }

module.exports = { baseForecastTitle, baseForecast, baseObservation, baseWarning, baseSevereWeatherOutlook, baseThunderstormOutlook }