const { Client } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseObservation } = require("../baseFormats");
const { apiBaseURL, apiOptions, guildLocation, guildChannels } = require("../../utils/constants");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    async function run() {
        const d = new Date();

        // NZST = UTC+12
        if (d.getMinutes() !== 0) return;

        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.LOCAL_OBSERVATION + guildLocation.replace(" ", "-"));
            var data = await response.json();
        } catch (error) {
            if (error.name === "FetchError" && error.type === "invalid-json") {
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(error);
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error(Guild System: Observation System)** `" + error.message + "`");
            }
        }

        const embed = baseObservation(data);

        client.channels.cache.get(guildChannels.HOURLY_OBSERVATION_CHANNEL).send({ embeds: [embed] })
            .then(message => message.crosspost())
            .catch(error => console.error(error));
    }

    setInterval(run, 60000);
}