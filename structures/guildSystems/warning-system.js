const { Client } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { baseWarningTitle, baseWarning } = require("../baseFormats");
const { apiBaseURL, apiOptions, guildLocation, guildChannels } = require("../../utils/constants");

/**
 * @param {Client} client 
 */
module.exports = (client) => {
    let perviousWarning = null;
    
    async function run() {
        // Fetch data from MetService API
        try {
            const response = await fetch(apiBaseURL + apiOptions.WARNINGS + guildLocation.replace(" ", "-"));
            var data = await response.json();
        } catch (error) {
            if (e.name === "FetchError" && e.type === "invalid-json") {
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Invalid location**");
            } else {
                console.error(error);
                return client.channels.cache.get(guildChannels.SERVER_LOGS_CHANNEL).send(client.emotes.error + " **Error(Guild System: Warning System)** `" + error.message + "`");
            }
        }

        const finalData = [];
        const charLimit = 2000;
        let k = 0;

        for (let i = 0; i < data.warnings.length; i++) {
            if (i === 0) finalData[k] = "[ @everyone ]\n" + baseWarningTitle(data.locationName);

            if (finalData[k].length + baseWarning(data.warnings[i]).length > charLimit) {
                k++
                finalData[k] = baseWarning(data.warnings[i]);
            } else {
                finalData[k] += baseWarning(data.warnings[i]);
            }
        }

        if (!finalData.length || finalData.join() === perviousWarning) return;

        // Iterate through formatted data array
        for (let i of finalData) {
            client.channels.cache.get(guildChannels.WARNING_CHANNEL).send(i)
            .then(message => message.crosspost())
            .catch(e => console.error(error));
        }

        perviousWarning = finalData.join();
    }

    setInterval(run, 60000);
}