const { Client } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { METSERVICE_BASE, API_OPTIONS } = require("../../utils/constants");
const { base_forecast_title, base_forecast, base_local_observation } = require("../baseFormats");
const { location, guildChannels } = require("./utils/constants");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    function timeManager() {
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
            const response = await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_FORECAST + location.replace(" ", "-"));
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
        let finalData = [];
        const charLimit = 2000;
        let k = 0;

        for (let i = 0; i < outlook; i++) {
            if (i === 0) finalData[k] = base_forecast_title(i, data, outlook);

            if (finalData[k].length + base_forecast(i, data).length > charLimit) {
                k++
                finalData[k] = base_forecast(i, data);
            } else {
                finalData[k] += base_forecast(i, data);
            }
        }

        // Iterate through formatted data array
        for (let i of finalData) {
            client.channels.cache.get(guildChannels.DAILY_FORECAST_CHANNEL).send(i);
        }

        outlook = 3;
        finalData = [];
        k = 0;

        for (let i = 0; i < outlook; i++) {
            if (i === 0) finalData[k] = base_forecast_title(i, data, outlook);

            if (finalData[k].length + base_forecast(i, data).length > charLimit) {
                k++
                finalData[k] = base_forecast(i, data);
            } else {
                finalData[k] += base_forecast(i, data);
            }
        }

        // Iterate through formatted data array
        for (let i of finalData) {
            client.channels.cache.get(guildChannels.THREE_DAY_FORECAST_CHANNEL).send(i);
        }

        outlook = 5;
        finalData = [];
        k = 0;

        for (let i = 0; i < outlook; i++) {
            if (i === 0) finalData[k] = base_forecast_title(i, data, outlook);

            if (finalData[k].length + base_forecast(i, data).length > charLimit) {
                k++
                finalData[k] = base_forecast(i, data);
            } else {
                finalData[k] += base_forecast(i, data);
            }
        }

        // Iterate through formatted data array
        for (let i of finalData) {
            client.channels.cache.get(guildChannels.FIVE_DAY_FORECAST_CHANNEL).send(i);
        }
    }

    async function localObservationSystem() {
         // Fetch data from MetService API
         try {
            const response = await fetch(METSERVICE_BASE + API_OPTIONS.LOCAL_OBS + location.replace(" ", "-"));
            var data = await response.json();
        } catch (e) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(e);
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error(Guild System: Local Observation System)** `" + e.message + "`");
            }
        }

        const embed = base_local_observation(data);
        client.channels.cache.get(guildChannels.HOURLY_OBSERVATION_CHANNEL).send({ embeds: [embed] });
    }

    setInterval(timeManager, 1000);
}