const { Client } = require("discord.js");
const { locations, guildChannels } = require("../constants");
const { default: fetch } = require("node-fetch");
const { apiBaseURL, apiOptions } = require("../../../utils/constants");
const { baseForecastTitle, baseForecast } = require("../../baseFormats");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    const channels = new Map();

    for (let i = 0; i < locations.length; i++) {
        let channelExsits = false;

        client.channels.cache.get(guildChannels.FORECAST_CHANNEL).threads.cache.forEach((channel) => {
            if (channel.name === locations[i]) {
                channels.set(locations[i], channel.id);
                channelExsits = true;
            }
        });

        if (!channelExsits) {
            const threadChannel = client.channels.cache.get(guildChannels.FORECAST_CHANNEL).threads.create({
                name: locations[i],
            })

            channels.set(locations[i], threadChannel.id);
        }
    }

    let issuedAtDateCache = [];
    let lastMessage = null;

    const run = async () => {
        for (let i = 0; i < channels.size; i++) {
            const location = locations[i];
            const outlook = 3;

            // Fetch data from MetService API
            try {
                const response = await fetch(apiBaseURL + apiOptions.FORECAST + location.replace(" ", "-"));
                var data = await response.json();
            } catch (error) {
                console.error(error);
            }

            let issuedAtDate = [];
            for (let i = 0; i < outlook; i++) {
                issuedAtDate.push(data.days[i].issuedAtISO);
            }

            if (!issuedAtDateCache.length) { // Empty Cache
                issuedAtDateCache = issuedAtDate;
                lastMessage = null;
            }
            else if (issuedAtDate.toString() !== issuedAtDateCache.toString()) {
                if (new Date(issuedAtDate[0]).getDate() !== new Date(issuedAtDateCache[0]).getDate()) {
                    lastMessage = null;
                }

                issuedAtDateCache = issuedAtDate;
            }
            else {
                return;
            }

            let finalData = null;
            const charLimit = 2000;
            let isToday = false;

            for (let i = 0; i < outlook; i++) {
                if (i === 0) {
                    isToday = true;
                    finalData = baseForecastTitle(data.locationIPS, null, outlook);
                } else {
                    isToday = false;
                }

                if (finalData.length + baseForecast(data.days[i], isToday).length > charLimit) {
                    break;
                } else {
                    finalData += baseForecast(data.days[i], isToday);
                }
            }

            if (lastMessage) {
                lastMessage.edit(finalData);
            }
            else {
                lastMessage = await client.channels.cache.get(guildChannels.FORECAST_CHANNEL).threads.fetch(channels.get(location))
                    .then((thread) => thread.send(finalData));
            }
        }
    }

    const date = new Date();
    setInterval(run, 3_600_000 - (date.getMinutes() * 60 + date.getSeconds()) * 1000 + date.getMilliseconds()); // Runtime set every hour exactly
}