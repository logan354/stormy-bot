const { Client } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseForecastTitle, baseForecast, baseLocalObservation } = require("../baseFormats");
const { apiBaseURL, apiOptions, location, guildChannels } = require("../utils/constants");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    function manager() {
        const time = new Date().toLocaleTimeString();

        if (time === "6:00:00 PM") {
            //-------"6:00:00 AM NZDT"
            localForecastSystem();
        }

        if (time === "3:00:00 PM" || time === "6:00:00 PM" || time === "9:00:00 PM" || time === "12:00:00 AM" || time === "3:00:00 AM" || time === "6:00:00 AM" || time === "9:00:00 AM" || time === "12:00:00 PM") {
            //-------"3:00:00 AM NZDT"--------"6:00:00 AM NZDT"--------"9:00:00 AM NZDT"--------"12:00:00 PM NZDT"--------"3:00:00 PM NZDT"--------"6:00:00 PM NZDT"--------"9:00:00 PM NZDT"--------"12:00:00 AM NZDT"
            localObservationSystem();
        }
    }

    async function localForecastSystem() {
        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.LOCAL_FORECAST + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error(Guild System: Local Forecast System)** `" + e.message + "`");
            }
        }

        let outlook = 1;
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
            client.channels.cache.get(guildChannels.DAILY_FORECAST_CHANNEL).send(i)
                .then(message => message.crosspost())
                .catch(e => console.error(e));
        }

        outlook = 3;
        finalData = [];
        k = 0;
        isToday = false;

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
            client.channels.cache.get(guildChannels.THREE_DAY_FORECAST_CHANNEL).send(i)
                .then(message => message.crosspost())
                .catch(e => console.error(e));
        }

        outlook = 5;
        finalData = [];
        k = 0;
        isToday = false;

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
            client.channels.cache.get(guildChannels.FIVE_DAY_FORECAST_CHANNEL).send(i)
                .then(message => message.crosspost())
                .catch(e => console.error(e));
        }
    }

    async function localObservationSystem() {
        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.LOCAL_OBS + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error(Guild System: Local Observation System)** `" + e.message + "`");
            }
        }

        const embed = baseLocalObservation(data);
        client.channels.cache.get(guildChannels.THREE_HOUR_OBSERVATION_CHANNEL).send({ embeds: [embed] })
            .then(message => message.crosspost())
            .catch(e => console.error(e));
    }

    setInterval(manager, 1000);
}