const { EmbedBuilder } = require("discord.js");
const { getIconEmojiID } = require("./utils/icons");
const { days, shortDays } = require("../utils/constants");

/**
 * Base format for forecast title
 * @param {string} location RAW API location data
 * @param {?days|shortDays|string} outlookDay
 * @param {?number} outlookNum
 * @returns {string}
 */
const baseForecastTitle = (location, outlookDay, outlookNum) => { return `${getIconEmojiID("fine")} __**${outlookNum ? outlookNum + "-Day" : outlookDay} Forecast for ${location.toLowerCase().split(" ").map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(" ")}**__`; }

/**
 * Base format for forecast
 * @param {Object} data RAW API days data
 * @param {boolean} isToday
 * @returns {string}
 */
const baseForecast = (data, isToday) => {
    const d = new Date(data.issuedAtRaw);
    let partDayData = null;

    if (data.partDayData) {
        partDayData = `| **Overnight** | **Morning** | **Afternoon** | **Evening** |\n|        ${getIconEmojiID(data.partDayData.overnight.forecastWord, data.partDayData.overnight.iconType)}       |      ${getIconEmojiID(data.partDayData.morning.forecastWord, data.partDayData.morning.iconType)}      |        ${getIconEmojiID(data.partDayData.afternoon.forecastWord, data.partDayData.afternoon.iconType)}        |      ${getIconEmojiID(data.partDayData.evening.forecastWord, data.partDayData.evening.iconType)}     |`;
    }
    
    return "\n\n" + `${getIconEmojiID(data.forecastWord)} **${isToday ? "Today" : data.dowTLA}** ${data.date} | High: ${data.max}°, Low: ${data.min}°\n${partDayData ? partDayData + "\n\n" + data.forecast : data.forecast}\n*Issued: ${data.issuedAt.split(" ")[0]} ${shortDays[d.getDay() > 0 ? d.getDay() - 1 : 6]} ${data.issuedAt.split(" ")[1]} ${data.issuedAt.split(" ")[2]}*`;
}

/**
 * Base format for warning title
 * @param {string} location RAW API location data
 * @returns {string}
 */
const baseWarningTitle = (location) => { return `${getIconEmojiID("Warning orange")} __**Warning(s) for ${location}**__`; }

/**
 * Base format for warning
 * @param {Object} data RAW API warnings data
 * @returns {string}
 */
const baseWarning = (data) => { return "\n\n" + `${getIconEmojiID("warning " + data.warnLevel)} **${data.name}**\n${data.editions[0].datum.text}`; }

/**
 * Base format for all local observations
 * @param {Object} data RAW API data
 * @returns {EmbedBuilder}
 */
const baseLocalObservation = (data) => {
    const embed = new EmbedBuilder()
        .setColor("Grey")
        .setAuthor({
            name: "Current Conditions at " + data.location
        })
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
            })
        .setFooter({
            text: "Weather Observation " + data.threeHour.dateTime + "\nWinds and Temperatures may slightly differ from actual conditions"
        });

    return embed;
}

module.exports = { baseForecastTitle, baseForecast, baseWarningTitle, baseWarning, baseLocalObservation }