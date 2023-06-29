const { Client } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseForecastTitle, baseForecast } = require("../baseFormats");
const { apiBaseURL, apiOptions, guildChannels } = require("../../utils/constants");
const { locations } = require("./utils/constants");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    const channels = []; // [location, channelId]

    for (let i = 0; i < locations.length; i++) {
        let channelExsits = false;

        client.channels.cache.get(guildChannels.FORECAST_CHANNEL).threads.cache.forEach((channel) => {
            if (channel.name === locations[i]) {
                channels.push([locations[i], channel.id])
                channelExsits = true;
            }
        });

        if (!channelExsits) {
            client.channels.cache.get(guildChannels.FORECAST_CHANNEL).threads.create({
                name: locations[i],
                message: { content: "**3-Day Forecast for " + locations[i] + "**" }
            })
        }
    }

    async function run() {
        const d = new Date();

        // NZST = UTC+12
        if (d.getUTCHours() !== 6 || 12 || 18 || 24 && d.getMinutes() !== 0) return;

        for (let i = 0; i < channels.length; i++) {
            const outlook = 3;
            const location = location[i]

            // Fetch data from MetService API
            try {
                const response = await fetch(apiBaseURL + apiOptions.FORECAST + location.replace(" ", "-"));
                var data = await response.json();
            } catch (error) {
                console.error(error);
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error(Forecast System)**");
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
            for (let i of finalData) {
                client.channels.cache.get(guildChannels.FORECAST_CHANNEL).threads.cache.get(fourmChannels[i]).send(i);
            }
        }
    }

    setInterval(run, 60000);
}