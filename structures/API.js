const fetch = require("node-fetch");
const { METSERVICE_BASE, API_OPTIONS, getIcon, getIconEmoji } = require("./Database");

function getHourlyForecast(client, city, channel) {
    fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_OBS + city)
        .then(res => res.json())
        .then(json => {
            if (!json) return client.channels.cache.get(channel).send(client.emotes.error + "**Error:** `Invalid location`");

            client.channels.cache.get(channel).send({
                embed: {
                    color: "BLACK",
                    author: { name: "Current Conditions in " + city },
                    thumbnail: { url: "" },
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
}

function getDailyForecast(client, city, channel) {
    fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_FORECAST + city)
        .then(res => res.json())
        .then(json => {
            if (!json) return client.channels.cache.get(channel).send(client.emotes.error + "**Error:** `Invalid location`");

            client.channels.cache.get(channel).send({
                embed: {
                    color: "BLACK",
                    author: { name: "Forecast for " + city },
                    description: json.days[0].forecast + "\n\n| __Overnight__ | __Morning__ | __Afternoon__ | __Evening__ |\n " + getIconEmoji(json.days[0].partDayData.overnight.forecastWord, json.days[0].partDayData.overnight.iconType) + " | " + getIconEmoji(json.days[0].partDayData.morning.forecastWord, json.days[0].partDayData.morning.iconType) + " | " + getIconEmoji(json.days[0].partDayData.afternoon.forecastWord, json.days[0].partDayData.afternoon.iconType) + " | " + getIconEmoji(json.days[0].partDayData.evening.forecastWord, json.days[0].partDayData.evening.iconType) + " ",
                    thumbnail: { url: getIcon(json.days[0].forecastWord) },
                }
            });
        });
}

function get5DayForecast(client, city, channel) {
    fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_FORECAST + city)
        .then(res => res.json())
        .then(json => {
            if (!json) return client.channels.cache.get(channel).send(client.emotes.error + "**Error:** `Invalid location`");

            client.channels.cache.get(channel).send({
                embed: {
                    color: "BLACK",
                    author: { name: "5 Day Forecast for " + city },
                    fields: [
                        { name: getIconEmoji(json.days[0].forecastWord) + " " + json.days[0].dow, value: json.days[0].forecast },
                        { name: getIconEmoji(json.days[1].forecastWord) + " " + json.days[1].dow, value: json.days[1].forecast },
                        { name: getIconEmoji(json.days[2].forecastWord) + " " + json.days[2].dow, value: json.days[2].forecast },
                        { name: getIconEmoji(json.days[3].forecastWord) + " " + json.days[3].dow, value: json.days[3].forecast },
                        { name: getIconEmoji(json.days[4].forecastWord) + " " + json.days[4].dow, value: json.days[4].forecast }
                    ]
                }
            });
        });
}

function getWarnings(client, city, channel) {
    fetch(METSERVICE_BASE + API_OPTIONS.WARNINGS + city)
        .then(res => res.json())
        .then(json => {
            if (!json) return client.channels.cache.get(channel).send(client.emotes.error + "**Error:** `Invalid location`");

            for (let i = 0; i < json.warnings.length; i++) {
                client.channels.cache.get(channel).send({
                    embed: {
                        color: "BLACK",
                        author: { name: "Warning(s) for " + city },
                        description: "**" + json.warnings[i].name + "**\nhttps://www.metservice.com/warnings/ @everyone\n\n" + json.warnings[i].editions[0].datum.text
                    }
                });
            }
        });
}

function getRadarImage(client, city, channel) {

}

module.exports = { getHourlyForecast, getDailyForecast, get5DayForecast, getWarnings, getRadarImage }