const fetch = require('node-fetch');
const { MessageEmbed } = require("discord.js");
const { METSERVICE_BASE, API_OPTIONS, LoadType, days, shortDays, Exception } = require("../utils/constants");
const { getIconEmoji } = require("../utils/icons");

/**
 * Creates a formatted local forecast from MetService data
 * @param {string} location 
 * @param {days|shortDays|number} outlook
 * @returns {StringData}
 */
async function localForecast(location, outlook) {
    try {
        // Fetch data from MetService API
        const response = await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_FORECAST + location.replace(" ", "-"));
        const data = await response.json();

        // Check if the outlook is a number
        const isOutlookNum = Number(outlook);

        // Base variables
        const base_title = (i) => { return `${getIconEmoji("Fine")} __**${isOutlookNum ? outlook.toString() + "-Day" : data.days[i].dow} Forecast for ${data.locationIPS.toLowerCase().split(" ").map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(" ")}**__`; }

        const base_forecast = (i) => { return `\n\n${getIconEmoji(data.days[i].forecastWord)} **${i > 0 ? data.days[i].dowTLA : "Today"}** ${data.days[i].date} | High: ${data.days[i].max}°, Low: ${data.days[i].min}°${!data.days[i].partDayData ? "\n" : `\n| **Overnight** | **Morning** | **Afternoon** | **Evening** |\n|        ${getIconEmoji(data.days[i].partDayData.overnight.forecastWord, data.days[i].partDayData.overnight.iconType)}       |      ${getIconEmoji(data.days[i].partDayData.morning.forecastWord, data.days[i].partDayData.morning.iconType)}      |        ${getIconEmoji(data.days[i].partDayData.afternoon.forecastWord, data.days[i].partDayData.afternoon.iconType)}        |      ${getIconEmoji(data.days[i].partDayData.evening.forecastWord, data.days[i].partDayData.evening.iconType)}     |\n\n`}${data.days[i].forecast}\n*Issued: ${data.days[i].issuedAt.split(" ")[0]} ${data.days[i].dowTLA} ${data.days[i].issuedAt.split(" ")[1]} ${data.days[i].issuedAt.split(" ")[2]}*`; }

        const finalData = [];
        const charLimit = 2000;
        let k = 0;

        // Main engine
        if (!isOutlookNum) {
            // Format outlook
            outlook = outlook.charAt(0).toUpperCase() + outlook.slice(1).toLowerCase();

            // Check outlook
            if (!days.includes(outlook) && !shortDays.includes(outlook)) {
                return {
                    loadType: LoadType.NO_DATA,
                    exception: Exception.INVALID_OUTLOOK,
                    data: null,
                }
            }

            for (let i = 0; i < 7; i++) {
                if (data.days[i].dow.toLowerCase() === outlook.toLowerCase() || data.days[i].dowTLA.toLowerCase() === outlook.toLowerCase()) {
                    finalData.push(base_title(i) + base_forecast(i));
                    break;
                }
            }
        } else {
            // Check outlook
            if (outlook < 1 || outlook > data.days.length) {
                return {
                    loadType: LoadType.NO_DATA,
                    exception: Exception.INVALID_LOCATION,
                    data: null,
                }
            }

            for (let i = 0; i < outlook; i++) {
                if (i === 0) finalData[k] = base_title(null);

                if (finalData[k].length + base_forecast(i).length > charLimit) {
                    k++
                    finalData[k] = base_forecast(i);
                } else {
                    finalData[k] += base_forecast(i);
                }
            }
        }

        return {
            loadType: LoadType.LOADED_DATA,
            exception: null,
            data: finalData,
        }
    } catch (e) {
        if (e.name === "FetchError" && e.type === "invalid-json") {
            return {
                loadType: LoadType.NO_DATA,
                exception: Exception.INVALID_LOCATION,
                data: null,
            }
        }
        else {
            console.error(e);
            return {
                loadType: LoadType.LOAD_FAILED,
                exception: e,
                data: null,
            }
        }
    }
}

/**
 * Creates a formatted sun protection alert from MetService data
 * @param {string} location 
 * @returns {MessageEmbedData}
 */
async function sunProtectionAlert(location) {
    try {
        // Fetch data from MetService API
        const response = await fetch(METSERVICE_BASE + API_OPTIONS.SUN_PROTECTION_ALERT + location.replace(" ", "-"));
        const data = await response.json();

        const embed = new MessageEmbed()
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

        return {
            loadType: LoadType.LOADED_DATA,
            exception: null,
            data: embed
        }
    } catch (e) {
        if (e.name === "FetchError" && e.type === "invalid-json") {
            return {
                loadType: LoadType.NO_DATA,
                exception: Exception.INVALID_LOCATION,
                data: null
            }
        }
        else {
            console.error(e);
            return {
                loadType: LoadType.LOAD_FAILED,
                exception: e,
                data: null
            }
        }
    }
}

/**
 * Creates a formatted local observation from MetService data
 * @param {string} location 
 * @returns {MessageEmbedData}
 */
async function localObservation(location) {
    try {
        // Fetch data from MetService API
        const response = await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_OBS + location.replace(" ", "-"));
        const data = await response.json();

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

        return {
            loadType: LoadType.LOADED_DATA,
            exception: null,
            data: embed
        }
    } catch (e) {
        if (e.name === "FetchError" && e.type === "invalid-json") {
            return {
                loadType: LoadType.NO_DATA,
                exception: Exception.INVALID_LOCATION,
                data: null
            }
        }
        else {
            console.error(e);
            return {
                loadType: LoadType.LOAD_FAILED,
                exception: e,
                data: null
            }
        }
    }
}

// Incomplete
async function tides(location) { }

/**
 * Creates formatted warning(s) from MetService data
 * @param {string} location 
 * @returns {StringData}
 */
async function warnings(location) {
    try {
        // Fetch data from MetService API
        const response = await fetch(METSERVICE_BASE + API_OPTIONS.WARNINGS + location.replace(" ", "-"));
        const data = await response.json();

        // Base variables
        const title = `${getIconEmoji("Warning orange")} __**Warning(s) for ${data.locationName}**__`;

        const base_warning = (i) => { return `\n\n${getIconEmoji("Warning " + data.warnings[i].warnLevel)} **${data.warnings[i].name}**\n${data.warnings[i].editions[0].datum.text}`; }

        const finalData = [];
        const charLimit = 2000;
        let k = 0;

        // Main engine
        for (let i = 0; i < data.warnings.length; i++) {
            if (i === 0) finalData[k] = title;

            if (finalData[k].length + base_warning(i).length > charLimit) {
                k++
                finalData[k] = base_warning(i);
            } else {
                finalData[k] += base_warning(i);
            }
        }

        if (!finalData.length) finalData[k] = title + "\n\nNo warnings for this region";

        return {
            loadType: LoadType.LOADED_DATA,
            exception: null,
            data: finalData,
        }
    } catch (e) {
        if (e.name === "FetchError" && e.type === "invalid-json") {
            return {
                loadType: LoadType.NO_DATA,
                exception: Exception.INVALID_LOCATION,
                data: null,
            }
        }
        else {
            console.error(e);
            return {
                loadType: LoadType.LOAD_FAILED,
                exception: e,
                data: null,
            }
        }
    }
}

/**
 * Creates formatted rise times from MetService data
 * @param {string} location 
 * @returns {MessageEmbedData}
 */
async function riseTimes(location) {
    try {
        // Fetch data from MetService API
        const response = await fetch(METSERVICE_BASE + API_OPTIONS.RISE_TIMES + location.replace(" ", "-"));
        const data = await response.json();

        const embed = new MessageEmbed()
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

        return {
            loadType: LoadType.LOADED_DATA,
            exception: null,
            data: embed
        }
    } catch (e) {
        if (e.name === "FetchError" && e.type === "invalid-json") {
            return {
                loadType: LoadType.NO_DATA,
                exception: Exception.INVALID_LOCATION,
                data: null
            }
        }
        else {
            console.error(e);
            return {
                loadType: LoadType.LOAD_FAILED,
                exception: e,
                data: null
            }
        }
    }
}

/**
 * Creates formatted pollen levels from MetService data
 * @param {string} location 
 * @returns {MessageEmbedData}
 */
async function pollenLevels(location) {
    try {
        // Fetch data from MetService API
        const response = await fetch(METSERVICE_BASE + API_OPTIONS.POLLEN_LEVELS + location.replace(" ", "-"));
        const data = await response.json();

        const embed = new MessageEmbed()
            .setColor("GREY")
            .setAuthor({
                name: "Pollen Levels for " + data.location.toLowerCase().split(" ").map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(" ")
            })

        for (let i = 0; i < data.pollen.length; i++) {
            if (data.pollen[i].dayDescriptor) embed.addField(data.pollen[i].dayDescriptor, "Level: **" + data.pollen[i].level + "**\nType: " + data.pollen[i].type);
        }

        return {
            loadType: LoadType.LOADED_DATA,
            exception: null,
            data: embed
        }
    } catch (e) {
        if (e.name === "FetchError" && e.type === "invalid-json") {
            return {
                loadType: LoadType.NO_DATA,
                exception: Exception.INVALID_LOCATION,
                data: null
            }
        }
        else {
            console.error(e);
            return {
                loadType: LoadType.LOAD_FAILED,
                exception: e,
                data: null
            }
        }
    }
}

// Incomplete
async function climate(location) { /** Use embed to display one */ }

/**
 * Creates a formatted radar image from MetService data
 * @param {string} location 
 * @returns {MessageEmbedData}
 */
async function rainRadar(location) {
    try {
        // Fetch data from MetService API
        const response = await fetch(METSERVICE_BASE + API_OPTIONS.RAIN_RADAR.replace("{0}", location.replace(" ", "-")));
        const data = await response.json();

        const embed = new MessageEmbed()
            .setColor("GREY")
            .setAuthor({
                name: data[0].url.split("/publicData/rainRadar/image/")[1].split("/")[0] + " Radar Image " + data[0].longDateTime
            })
            .setImage(METSERVICE_BASE + data[0].url.split("/publicData/")[1]);

        return {
            loadType: LoadType.LOADED_DATA,
            exception: null,
            data: embed
        }
    } catch (e) {
        if (e.name === "FetchError" && e.type === "invalid-json") {
            return {
                loadType: LoadType.NO_DATA,
                exception: Exception.INVALID_LOCATION,
                data: null
            }
        }
        else {
            console.error(e);
            return {
                loadType: LoadType.LOAD_FAILED,
                exception: e,
                data: null
            }
        }
    }
}

/**
 * @typedef MessageEmbedData
 * @property {LoadType} loadType - The load type of the result.
 * @property {?MessageEmbed} data - The message embed from the result.
 * @property {?string|?Error} exception - The exception when searching if one.
 */

/**
 * @typedef StringData
 * @property {LoadType} loadType - The load type of the result.
 * @property {?Array} data - The array of strings (under 2000 char) from the result.
 * @property {?string|?Error} exception - The exception when searching if one.
 */

module.exports = { localForecast, sunProtectionAlert, localObservation, tides, warnings, riseTimes, pollenLevels, climate, rainRadar }