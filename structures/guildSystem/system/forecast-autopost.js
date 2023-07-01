const { Client } = require("discord.js");
const { locations, guildChannels } = require("../utils/constants");
const { apiBaseURL, apiOptions } = require("../../../utils/constants");
const { baseForecastTitle, baseForecast } = require("../../baseFormats");
const { default: fetch } = require("node-fetch");
const database = require("../database/guild-system.json");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    const locationChannels = new Map(); // <location, channelId>

    function onLoad() {

        for (let i = 0; i < locations.length; i++) {
            let channelExsits = false;

            client.channels.cache.get(guildChannels.FORECAST_CHANNEL).threads.cache.forEach((channel) => {
                if (channel.name === locations[i]) {
                    locationChannels.set(locations[i], channel.id);
                    channelExsits = true;
                }
            });

            if (!channelExsits) {
                const threadChannel = client.channels.cache.get(guildChannels.FORECAST_CHANNEL).threads.create({
                    name: locations[i],
                    message: { content: "**3-Day Forecast for " + locations[i] + "**" }
                })

                locationChannels.set(locations[i], threadChannel.id);
            }
        }
    }

    async function run() {
        for (let i = 0; i < locations.length; i++) {
            const outlook = 3;
            const location = locations[i]

            // Fetch data from MetService API
            try {
                const response = await fetch(apiBaseURL + apiOptions.FORECAST + location.replace(" ", "-"));
                var data = await response.json();
            } catch (error) {
                console.error(error);
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error(Forecast System)**");
            }

            // Database
            const timestamps = [];
            for (let i = 0; i < outlook; i++) {
                timestamps.push(data.days[i].issuedAtISO);
            }

            if (timestamps.toString() === database.forecast_issuedAt_timestamps.toString()) {
                return;
            }
            else {
                database.forecast_issuedAt_timestamps = timestamps;
            }

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
            for (let data of finalData) {
                client.channels.cache.get(guildChannels.FORECAST_CHANNEL).threads.cache.get(locationChannels.get(locations[i])).send(data);
            }
        }
    }

    onLoad();
    setInterval(run, 6000)
}