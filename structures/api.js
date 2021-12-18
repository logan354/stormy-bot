const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

const { METSERVICE_BASE, API_OPTIONS } = require("../utils/constants");
const { getIconEmoji } = require("../utils/icons");

/**
 * Gets hourly forecast
 * @param {string} city 
 * @returns {HourlyForecast}
 */
async function getHourlyForecast(city) {
    try {
        const response = await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_OBS + city);
        const data = await response.json();

        const embed = new MessageEmbed()
            .setColor("BLACK")
            .setAuthor("Current Conditions in " + data.location)
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
            .setFooter("Weather Observation " + data.threeHour.dateTime + "\nWinds and Temperatures may slightly differ from actual conditions");

        return { forecast: embed, exception: null }
    } catch (ex) {
        if (ex.name === "FetchError" && ex.type === "invalid-json") return { forecast: null, exception: Exception.INVALID_LOCATION }
        else {
            console.log(ex);
            return { forecast: null, exception: Exception.UNKNOWN_ERROR }
        }
    }
}

/**
 * Gets forecast
 * @param {string} city 
 * @param {string|number} outlook 
 * @returns {Forecast}
 */
async function getForecast(city, outlook) {
    try {
        const response = await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_FORECAST + city);
        const data = await response.json();

        let isNum = false;
        // Checks if outlook is a number
        if (!isNaN(parseInt(outlook))) isNum = true;
        else {
            // Else converts the outlook into the correct format
            outlook = outlook.charAt(0).toUpperCase() + outlook.slice(1).toLowerCase();
        }

        const title = `${getIconEmoji("Fine")} **${isNum ? outlook + " Day" : outlook} Weather Outlook for ${data.locationIPS.toLowerCase().split(" ").map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(" ")}** ${getIconEmoji("Fine")}\nhttps://www.metservice.com/towns-cities/locations/hamilton`;
        const body = (i) => { return `\n\n${getIconEmoji(data.days[i].forecastWord)} **${i > 0 ? data.days[i].dowTLA : "Today"}** ${data.days[i].date} | High: ${data.days[i].max}°, Low: ${data.days[i].min}°${!data.days[i].partDayData ? "\n" : `\n| **Overnight** | **Morning** | **Afternoon** | **Evening** |\n|        ${getIconEmoji(data.days[i].partDayData.overnight.forecastWord, data.days[i].partDayData.overnight.iconType)}       |      ${getIconEmoji(data.days[i].partDayData.morning.forecastWord, data.days[i].partDayData.morning.iconType)}      |        ${getIconEmoji(data.days[i].partDayData.afternoon.forecastWord, data.days[i].partDayData.afternoon.iconType)}        |      ${getIconEmoji(data.days[i].partDayData.evening.forecastWord, data.days[i].partDayData.evening.iconType)}     |\n\n`}${data.days[i].forecast}\n*Issued: ${data.days[i].issuedAt.split(" ")[0]} ${data.days[i].dowTLA}, ${data.days[i].issuedAt.split(" ")[1]} ${data.days[i].issuedAt.split(" ")[2]}*`; }
        let forecast = title;
        let extention = "";

        for (let i = 0; isNum ? i < (outlook > data.days.length ? data.days.length : outlook) : i < 7; i++) {
            if (isNum) {
                if (forecast.length + body(i).length < 2000) forecast += body(i);
                else extention += body(i);
            }
            else {
                if (data.days[i].dow === outlook || data.days[i].dowTLA === outlook) forecast += body(i);
            }
        }

        if (forecast === title) return { forecast: null, extention: null, exception: Exception.INVALID_OUTLOOK }

        if (extention) return { forecast: forecast, extention: extention, exception: null }
        else return { forecast: forecast, extention: null, exception: null }
    } catch (ex) {
        if (ex.name === "FetchError" && ex.type === "invalid-json") return { forecast: null, exception: Exception.INVALID_LOCATION }
        else {
            console.log(ex);
            return { forecast: null, exception: Exception.UNKNOWN_ERROR }
        }
    }
}

/**
 * Gets warnings
 * @param {string} city
 * @returns {Warning}
 */
async function getWarnings(city) {
    try {
        const response = await fetch(METSERVICE_BASE + API_OPTIONS.WARNINGS + city);
        const data = await response.json();

        const title = `${getIconEmoji("Warning red")} **Warning(s) for ${data.locationName}** ${getIconEmoji("Warning red")}\nhttps://www.metservice.com/warnings/`;
        const body = (i) => { return `\n\n${getIconEmoji("Warning " + data.warnings[i].warnLevel)} **${data.warnings[i].name}** ${getIconEmoji("Warning " + data.warnings[i].warnLevel)}\n${data.warnings[i].editions[0].datum.text}`; }
        let warning = title;
        let extention = "";

        for (let i = 0; i < data.warnings.length; i++) {
            if (warning.length + body(i).length < 2000) warning += body(i);
            else extention += body(i);
        }

        if (warning === title) warning += "\n\nNo warnings for this region";

        if (extention) return { warning: warning, extention: extention, exception: null }
        else return { warning: warning, extention: null, exception: null }
    } catch (ex) {
        if (ex.name === "FetchError" && ex.type === "invalid-json") return { warning: null, extention: null, exception: Exception.INVALID_LOCATION }
        else {
            console.log(ex);
            return { warning: null, extention: null, exception: Exception.UNKNOWN_ERROR }
        }
    }
}

/**
 * Gets radar image
 * @param {string} region
 * @returns {RadarImage}
 */
async function getRadarImage(region) {
    let parseAPI_OPTION = API_OPTIONS.RAIN_RADAR.replace("{0}", region);

    try {
        const response = await fetch(METSERVICE_BASE + parseAPI_OPTION);
        const data = await response.json();

        const embed = new MessageEmbed()
            .setColor("BLACK")
            .setAuthor(data[0].url.split("/publicData/rainRadar/image/")[1].split("/")[0] + " Radar Image " + data[0].longDateTime)
            .setImage("http://metservice.com" + data[0].url)

        return { image: embed, exception: null }
    } catch (ex) {
        if (ex.name === "FetchError" && ex.type === "invalid-json") return { image: null, exception: Exception.INVALID_LOCATION }
        else {
            console.log(ex);
            return { image: null, exception: Exception.UNKNOWN_ERROR }
        }
    }
}

const Exception = {
    INVALID_LOCATION: "INVALID_LOCATION",
    INVALID_OUTLOOK: "INVALID_OUTLOOK",
    UNKNOWN_ERROR: "UNKNOWN_ERROR"
}

/**
 * @typedef HourlyForecast
 * @property {MessageEmbed|null} forecast
 * @property {Exception|null} exception
 */

/**
 * @typedef Forecast
 * @property {string|null} forecast
 * @property {string|null} extention
 * @property {Exception|null} exception
 */

/**
 * @typedef Warning
 * @property {string|null} warning
 * @property {string|null} extention
 * @property {Exception|null} exception
 */

/**
 * @typedef RadarImage
 * @property {MessageEmbed} image
 * @property {Exception|null} exception
 */

module.exports = { getHourlyForecast, getForecast, getWarnings, getRadarImage, Exception }