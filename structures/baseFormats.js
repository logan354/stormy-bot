const { EmbedBuilder, ButtonBuilder } = require("discord.js");
const { getIconEmojiID } = require("./icons");
const { days, shortDays } = require("../utils/constants");

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
 * @param {Object} data RAW API forecast element
 * @param {boolean} isToday
 * @returns {string}
 */
const baseForecast = (data, isToday) => {
    const d = new Date(data.issuedAtRaw);
    let partDayData = null;

    if (data.partDayData) {
        partDayData = `| **Overnight** | **Morning** | **Afternoon** | **Evening** |\n|        ${getIconEmojiID(data.partDayData.overnight.forecastWord, data.partDayData.overnight.iconType)}        |      ${getIconEmojiID(data.partDayData.morning.forecastWord, data.partDayData.morning.iconType)}      |         ${getIconEmojiID(data.partDayData.afternoon.forecastWord, data.partDayData.afternoon.iconType)}        |      ${getIconEmojiID(data.partDayData.evening.forecastWord, data.partDayData.evening.iconType)}     |`;
    }

    return "\n\n" + `${getIconEmojiID(data.forecastWord)} **${isToday ? "Today" : data.dowTLA}** ${data.date} | High: ${data.max}°, Low: ${data.min}°\n${partDayData ? partDayData + "\n\n" + data.forecast : data.forecast}\n*Issued: ${data.issuedAt.split(" ")[0]} ${shortDays[d.getDay() > 0 ? d.getDay() - 1 : 6]} ${data.issuedAt.split(" ")[1]} ${data.issuedAt.split(" ")[2]}*`;
}

/**
 * Base format for observations
 * @param {Object} data RAW API observation data
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
            text: "Weather Observation " + data.threeHour.dateTime + "\nWinds and Temperatures may slightly differ from actual conditions"
        });

    return embed;
}

const baseRadar = () => { }

/**
 * Base format for warnings
 * @param {Object} data RAW CAP info data
 * @returns {string}
 */
const baseWarning = (data) => {
    const effective = new Date(data.onset._text);
    const expires = new Date(data.expires._text);

    const dateFmt = (date) => {
        return date.toLocaleDateString("en-GB", { hour: "numeric", hour12: true }).split(" ")[1] + date.toLocaleDateString("en-GB", { hour: "numeric", hour12: true }).split(" ")[2] + " " + date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" });
    }

    let colourCode = null;
    data.parameter.forEach(param => { 
        if (param.valueName._text === "ColourCode") colourCode = param.value._text;
    });

    return `${getIconEmojiID("Warning " + colourCode)} **${data.headline._text}**\n**Area:** ${data.area.areaDesc._text}\n**Period:** ${data.headline._text === "Severe Thunderstorm Warning" ? "until " + dateFmt(expires) : dateFmt(effective) + " - " + dateFmt(expires)}\n\n`;
}

/**
 * Base format for severe weather outlook
 * @param {Object} data RAW API outlook data
 * @returns {EmbedBuilder}
 */
const baseSevereWeatherOutlook = (data) => {
    const embed = new EmbedBuilder()
        .setColor("Grey")
        .setTitle("Severe Weather Outlook")
        .setImage("https://www.metservice.com" + data.pic.url)
        .setTimestamp();

        return embed;
}

/**
 * Base format for thunderstorm outlooks
 * @param {Object} data RAW API outlook data
 * @param {number} index 
 * @returns {string}
 */
const baseThunderstormOutlook = (data, index) => {
    return "https://www.metservice.com" + data.outlooks[index].url;
}

const baseTropicalCycloneActivity = () => { }

module.exports = { baseForecastTitle, baseForecast, baseObservation, baseWarning, baseSevereWeatherOutlook, baseThunderstormOutlook }