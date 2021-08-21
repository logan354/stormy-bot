const fetch = require("node-fetch");
const { METSERVICE_BASE, API_OPTIONS, getIcon, getIconEmoji } = require("./Database");

async function getHourlyForecast(client, city, channel) {
    try {
        await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_OBS + city)
            .then(res => res.json())
            .then(json => {
                client.channels.cache.get(channel).send({
                    embed: {
                        color: "BLACK",
                        author: { name: "Current Conditions in " + json.location },
                        fields: [
                            { name: "Temperature", value: "**" + json.threeHour.temp + "°**\nFeels like " + json.threeHour.windChill + "°", inline: true },
                            { name: "Clothing", value: json.threeHour.clothingLayers + " layers\n" + json.threeHour.windProofLayers + " windproof", inline: true },
                            { name: "Wind", value: json.threeHour.windSpeed + "km/h " + json.threeHour.windDirection, inline: true },
                            { name: "Rainfall", value: json.threeHour.rainfall + "mm", inline: true },
                            { name: "Humidity", value: json.threeHour.humidity + "%", inline: true },
                            { name: "Pressure", value: json.threeHour.pressure + "hPa\n" + json.threeHour.pressureTrend, inline: true },
                        ],
                        footer: { text: "Weather Observation " + json.threeHour.dateTime + "\nWinds and Temperatures may slightly differ from actual conditions" }
                    }
                });
            });
    } catch (ex) {
        if (ex.name === "FetchError" && ex.type === "invalid-json") return client.channels.cache.get(channel).send(client.emotes.error + "**Error:** `Invalid location`");
        else {
            console.log(ex);
            return client.channels.cache.get(channel).send(client.emotes.error + "**Unexpected Error**");
        }
    }
}

async function getForecast(client, city, forecastLength, channel) {
    try {
        await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_FORECAST + city)
            .then(res => res.json())
            .then(json => {
                forecast = "";
                for (let i = 0; i < (forecastLength > json.days.length ? json.days.length : forecastLength); i++) {
                    forecast += `${(i > 0 ? "\n\n" : "") + getIconEmoji(json.days[i].forecastWord)} **${i > 0 ? json.days[i].dowTLA : "Today"}** ${json.days[i].date} | High: ${json.days[i].max}°, Low: ${json.days[i].min}°${i > 2 ? "" : `\n\n| **Overnight** | **Morning** | **Afternoon** | **Evening** |\n|        ${getIconEmoji(json.days[i].partDayData.overnight.forecastWord, json.days[i].partDayData.overnight.iconType)}       |      ${getIconEmoji(json.days[i].partDayData.morning.forecastWord, json.days[i].partDayData.morning.iconType)}      |        ${getIconEmoji(json.days[i].partDayData.afternoon.forecastWord, json.days[i].partDayData.afternoon.iconType)}        |      ${getIconEmoji(json.days[i].partDayData.evening.forecastWord, json.days[i].partDayData.evening.iconType)}     |`}\n\n${json.days[i].forecast}\n*Issued: ${json.days[i].issuedAt.split(" ")[0]} ${json.days[i].dowTLA}, ${json.days[i].issuedAt.split(" ")[1]} ${json.days[i].issuedAt.split(" ")[2]}*\n\nSunrise: ${json.days[i].riseSet.sunRise}, Sunset: ${json.days[i].riseSet.sunSet}`;
                }
                client.channels.cache.get(channel).send(forecast);
            });
    } catch (ex) {
        if (ex.name === "FetchError" && ex.type === "invalid-json") return client.channels.cache.get(channel).send(client.emotes.error + "**Error:** `Invalid location`");
        else {
            console.log(ex);
            return client.channels.cache.get(channel).send(client.emotes.error + "**Unexpected Error**");
        }
    }
}

async function getWarnings(client, city, channel) {
    try {
        await fetch(METSERVICE_BASE + API_OPTIONS.WARNINGS + city)
            .then(res => res.json())
            .then(json => {
                let warning = "";
                for (let i = 0; i < json.warnings.length; i++) {
                    warning += `${(i > 0 ? "\n\n" : "") + getIconEmoji("Warning " + json.warnings[i].warnLevel)} **${json.warnings[i].name}** ${getIconEmoji("Warning " + json.warnings[i].warnLevel)}\nhttps://www.metservice.com/warnings/\n\n${json.warnings[i].editions[0].datum.text}`;
                }
                client.channels.cache.get(channel).send(warning);
            });
    } catch (ex) {
        if (ex.name === "FetchError" && ex.type === "invalid-json") return client.channels.cache.get(channel).send(client.emotes.error + "**Error:** `Invalid location`");
        else {
            console.log(ex);
            return client.channels.cache.get(channel).send(client.emotes.error + "**Unexpected Error**");
        }
    }
}

async function getRadarImage(client, region, channel) {
    let radarRegions = [];
    let parseAPI_OPTION = API_OPTIONS.RAIN_RADAR.replace("{0}", region);

    try {
        await fetch(METSERVICE_BASE + parseAPI_OPTION)
            .then(res => res.json())
            .then(json => {
                client.channels.cache.get(channel).send({
                    embed: {
                        color: "BLACK",
                        author: { name: region + " Radar Image " + json[0].longDateTime },
                        image: { url: "http://metservice.com" + json[0].url }
                    }
                });
            });
    } catch (ex) {
        if (ex.name === "FetchError" && ex.type === "invalid-json") return client.channels.cache.get(channel).send(client.emotes.error + "**Error:** `Invalid location`");
        else {
            console.log(ex);
            return client.channels.cache.get(channel).send(client.emotes.error + "**Unexpected Error**");
        }
    }
}

module.exports = { getHourlyForecast, getForecast, getWarnings, getRadarImage }