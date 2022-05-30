const { MessageEmbed } = require("discord.js");
const { getIconEmojiID } = require("./icons");
const { days, shortDays } = require("../utils/constants");

/**
 * Base format for forecast title
 * @param {number} i 
 * @param {Object} data 
 * @param {days|shortDays|number} outlook 
 * @returns {string}
 */
const base_forecast_title = (i, data, outlook) => { return `${getIconEmojiID("fine")} __**${Number(outlook) && outlook > 1 ? outlook.toString() + "-Day" : data.days[i].dow} Forecast for ${data.locationIPS.toLowerCase().split(" ").map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(" ")}**__`; }

/**
 * Base format for all forecasts
 * @param {number} i 
 * @param {Object} data 
 * @returns {string}
 */
const base_forecast = (i, data) => {
    const d = new Date(data.days[i].issuedAtRaw);
    let partDayData = null;

    if (data.days[i].partDayData) {
        partDayData = `| **Overnight** | **Morning** | **Afternoon** | **Evening** |\n|        ${getIconEmojiID(data.days[i].partDayData.overnight.forecastWord, data.days[i].partDayData.overnight.iconType)}       |      ${getIconEmojiID(data.days[i].partDayData.morning.forecastWord, data.days[i].partDayData.morning.iconType)}      |        ${getIconEmojiID(data.days[i].partDayData.afternoon.forecastWord, data.days[i].partDayData.afternoon.iconType)}        |      ${getIconEmojiID(data.days[i].partDayData.evening.forecastWord, data.days[i].partDayData.evening.iconType)}     |`;
    }
    
    return "\n\n" + `${getIconEmojiID(data.days[i].forecastWord)} **${i === 0 ? "Today" : data.days[i].dowTLA}** ${data.days[i].date} | High: ${data.days[i].max}°, Low: ${data.days[i].min}°\n${partDayData ? partDayData + "\n\n" + data.days[i].forecast : data.days[i].forecast}\n*Issued: ${data.days[i].issuedAt.split(" ")[0]} ${shortDays[d.getDay() - 1]} ${data.days[i].issuedAt.split(" ")[1]} ${data.days[i].issuedAt.split(" ")[2]}*`;
}

/**
 * Base format for warning title
 * @param {Object} data
 * @returns {string}
 */
const base_warning_title = (data) => { return `${getIconEmojiID("warning_orange")} __**Warning(s) for ${data.locationName}**__`; }


/**
 * Base format for all warnings
 * @param {number} i 
 * @param {Object} data 
 * @returns {string}
 */
const base_warning = (i, data) => { return `\n\n${getIconEmojiID("warning_" + data.warnings[i].warnLevel)} **${data.warnings[i].name}**\n${data.warnings[i].editions[0].datum.text}`; }

/**
 * Base format for all local observations
 * @param {Object} data 
 * @returns {MessageEmbed}
 */
const base_local_observation = (data) => {
    const embed = new MessageEmbed()
        .setColor("GREY")
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

module.exports = { base_forecast_title, base_forecast, base_warning_title, base_warning, base_local_observation }