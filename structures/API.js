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

async function getForecast(client, city, outlook, channel) {
    try {
        await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_FORECAST + city)
            .then(res => res.json())
            .then(json => {
                let isNum = false;
                if (!isNaN(parseInt(outlook))) isNum = true;

                let title = `${getIconEmoji(json.days[0].forecastWord)} **${isNum ? outlook + " Day" : outlook} Weather Outlook for ${json.locationIPS}** ${getIconEmoji(json.days[0].forecastWord)}\nhttps://www.metservice.com/towns-cities/locations/hamilton`;
                const body = (i) => { return `\n\n${getIconEmoji(json.days[i].forecastWord)} **${i > 0 ? json.days[i].dowTLA : "Today"}** ${json.days[i].date} | High: ${json.days[i].max}°, Low: ${json.days[i].min}°${i > 2 ? "\n" : `\n| **Overnight** | **Morning** | **Afternoon** | **Evening** |\n|        ${getIconEmoji(json.days[i].partDayData.overnight.forecastWord, json.days[i].partDayData.overnight.iconType)}       |      ${getIconEmoji(json.days[i].partDayData.morning.forecastWord, json.days[i].partDayData.morning.iconType)}      |        ${getIconEmoji(json.days[i].partDayData.afternoon.forecastWord, json.days[i].partDayData.afternoon.iconType)}        |      ${getIconEmoji(json.days[i].partDayData.evening.forecastWord, json.days[i].partDayData.evening.iconType)}     |\n\n`}${json.days[i].forecast}\n*Issued: ${json.days[i].issuedAt.split(" ")[0]} ${json.days[i].dowTLA}, ${json.days[i].issuedAt.split(" ")[1]} ${json.days[i].issuedAt.split(" ")[2]}*\n\nSunrise: ${json.days[i].riseSet.sunRise}, Sunset: ${json.days[i].riseSet.sunSet}`; }
                let forecast = title;
                let extention = "";

                for (let i = 0; isNum ? i < (outlook > json.days.length ? json.days.length : outlook) : i < 7; i++) {
                    if (isNum) {
                        if (forecast.length + body(i).length < 2000) forecast += body(i);
                        else extention += body(i);
                    }
                    else {
                        if (json.days[i].dow === outlook || json.days[i].dowTLA === outlook) forecast += body(i);
                    }
                }
                if (forecast === title) return client.channels.cache.get(channel).send(client.emotes.error + "**Error:** `Invalid outlook`");

                client.channels.cache.get(channel).send(forecast);
                if (extention) client.channels.cache.get(channel).send(extention);
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
                const title = `${getIconEmoji("Warning red")} **Warning(s) for ${json.locationName}** ${getIconEmoji("Warning red")}\nhttps://www.metservice.com/warnings/`
                const body = (i) => { return `\n\n${getIconEmoji("Warning " + json.warnings[i].warnLevel)} **${json.warnings[i].name}** ${getIconEmoji("Warning " + json.warnings[i].warnLevel)}\n\n${json.warnings[i].editions[0].datum.text}`; }
                let warning = title;

                for (let i = 0; i < json.warnings.length; i++) {
                    warning += body(i);
                }
                if (warning === title) return client.channels.cache.get(channel).send(warning += "\n\nNo warnings for this region");
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