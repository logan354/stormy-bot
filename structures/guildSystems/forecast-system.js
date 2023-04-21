const { Client } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseForecastTitle, baseForecast } = require("../baseFormats");
const { apiBaseURL, apiOptions, guildLocation, guildChannels } = require("../../utils/constants");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    async function run() {
        const d = new Date();

        // NZST = UTC+12
        if (d.getUTCHours() !== 18 && d.getMinutes() !== 0) return;

        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.LOCAL_FORECAST + guildLocation.replace(" ", "-"));
            var data = await response.json();
        } catch (error) {
            if (error.name === "FetchError" && error.type === "invalid-json") {
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(error);
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error(Guild System: Forecast System)** `" + error.message + "`");
            }
        }

        let outlook = 3;

        const finalData = [];
        const charLimit = 2000;
        let k = 0;
        let isToday = false;

        for (let i = 0; i < outlook; i++) {
            if (i === 0) {
                isToday = true;
                finalData[k] = baseForecastTitle(data.locationIPS, null, outlook);
            } else {
                isToday = false;
            }

            if (finalData[k].length + baseForecast(data.days[i], isToday).length > charLimit) {
                k++
                finalData[k] = baseForecast(data.days[i], isToday);
            } else {
                finalData[k] += baseForecast(data.days[i], isToday);
            }
        }

        // Iterate through formatted data array
        for (let i of finalData) {
            client.channels.cache.get(guildChannels.FORECAST_CHANNEL).send(i)
                .then(message => message.crosspost())
                .catch(error => console.error(error));
        }
    }

    setInterval(run, 60000);
}